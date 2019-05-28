var express = require("express");
var app = express();
var mysql = require('mysql');
var http = require('http');
var querystring=require("querystring");
var fs = require('fs');
var BMP24 = require('gd-bmp').BMP24; // 验证码
var cookieParser = require("cookie-parser");
var session = require('express-session');

app.use(cookieParser('siber'));
app.use(session({
    secret : "siber",
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: 60000 * 60 * 24 * 7 // 7天有效期
    }
}));

var connection=mysql.createConnection(
	{
		host : "localhost",
        user :"root",
        password : "lhb980601",
        database : "lietou"
});


connection.connect();

function thistime(){
    let exptime = new Date();
    exptime.setTime(exptime.getTime());//获得登录时间
    return exptime.toGMTString();
}

function rand(min, max) {
    return Math.random()*(max-min+1) + min | 0; //特殊的技巧，|0可以强制转换为整数
}

function makeCapcha(){//生成验证码函数
	var check  = [];
	var img = new BMP24(100, 40);
    img.fillRect(0 , 0 , 100 , 40 , 0xFFFFFF);
    img.drawCircle(rand(0, 100), rand(0, 40), rand(10 , 40), rand(0, 0xffffff));
    //边框
    img.drawRect(0, 0, img.w-1, img.h-1, rand(0, 0xffffff));
    img.drawLine(rand(0, 100), rand(0, 40), rand(0, 100), rand(0, 40), rand(0, 0xffffff));
    //return img;

    //画曲线
    var w=img.w/2;
    var h=img.h;
    var color = rand(0, 0xffffff);
    var y1=rand(-5,5); //Y轴位置调整
    var w2=rand(10,15); //数值越小频率越高
    var h3=rand(4,6); //数值越小幅度越大
    var bl = rand(1,5);
    for(var i=-w; i<w; i+=0.1) {
        var y = Math.floor(h/h3*Math.sin(i/w2)+h/2+y1);
        var x = Math.floor(i+w);
        for(var j=0; j<bl; j++){
            img.drawPoint(x, y+j, color);
        }
    }

    var p = "ABCDEFGHKMNPQRSTUVWXYZ3456789";
    var str = '';
    for(var i=0; i<5; i++){
        str += p.charAt(Math.random() * p.length |0);
    }

    var fonts = [BMP24.font8x16, BMP24.font12x24, BMP24.font16x32];
    var x = 15, y=8;
    for(var i=0; i<str.length; i++){
        var f = fonts[Math.random() * fonts.length |0];
        y = 8 + rand(-10, 10);
        img.drawChar(str[i], x, y, f, rand(0, 0xffffff));
        x += f.w + rand(2, 8);
    }
/*    for(let i = 0 ; i < str.length ; i++)
    {
        if(str[i] >= 'A' || str[i] <= 'Z')
        {
            str[i] += 32;
        }
    }*/
    check[0] = img.getFileData().toString('base64');
    check[1] = str.toLowerCase();
    console.log(check[1]);
    return check;
}

app.get('/session' , function(req , res){//判断是否登陆
    if(req.session.sign)
    {
        res.jsonp(req.session.name);
    }
    else
    {
        res.jsonp("pleaselog");
    }
})

app.get('/login' , function(req , res){//登陆验证码
	var code = makeCapcha();
	req.session.code = code[1];
    res.jsonp({
        img : 'data:image/bmp;base64,' + code[0],
    })
});

app.get('/logout' , function(req , res){//推出登陆
    req.session.destroy();
    res.jsonp('logout');
})

app.get('/login/add',function(req , res){//登陆条件，判断账号密码是否正确
    /*for(let i = 0 ; i < req.query.verify ; i++)
    {
        if(req.query.verify[i] >= 'A' || req.query.verify[i] <= 'Z')
        {
            req.query.verify[i] += 32;
        }
    }*/
/*    console.log(req.query.verify+"111");*/
    if(req.query.verify.toLowerCase() != req.session.code){
        res.jsonp("fault");
    }
    else if(req.query.verify.toLowerCase() == req.session.code){//判断验证码是否正确
        var strquery = connection.query('SELECT name,password FROM user WHERE name = "' +req.query.name +'"'  , function(error , result){
            if(error)
            {
                res.jsonp("notfind");
                return;
            }
            else//从数据库读取数据是否正确(是否有此人)
            {
                if(result[0] == undefined)
                {
                    res.jsonp("notfind");
                }
                else
                {
                    if(result[0].name != req.query.name || result[0].password != req.query.password){
                        res.jsonp("faultlog");
                    }
                    else if(result[0].name == req.query.name && result[0].password == req.query.password){
                        req.session.name = req.query.name;
                        req.session.sign = true;
                        res.jsonp("login");
                    }
                }
            }
        });
            //读取数据库
    }
});

app.get('/write',function(req , res){//将文章写入数据库
	var number = Math.floor(Math.random()*1000 + 1);
    var Path = "/猎头/users/" + req.session.name + "/" + number + req.query.title + ".html";
    var filepath = "../users/" + req.session.name + "/" + number + req.query.title + ".html";
    var Content = "<!DOCTYPE html><html><head><title></title><meta charset='utf-8'><meta http-equiv='X-UA-Compatible' content='IE=edge'><title>Jonaki | Job Board Template</title><meta name='description' content='company is a free job board template'><meta name='author' content='Ohidul'><meta name='keyword' content='html, css, bootstrap, job-board'><meta name='viewport' content='width=device-width, initial-scale=1'><link href='http://fonts.googleapis.com/css?family=Open+Sans:400,300,700,800' rel='stylesheet' type='text/css'><link rel='shortcut icon' href='../../favicon.ico' type='image/x-icon'><link rel='icon' href='../../favicon.ico' type='image/x-icon'><link rel='stylesheet' href='../../css/normalize.css'><link rel='stylesheet' href='../../css/font-awesome.min.css'><link rel='stylesheet' href='../../css/fontello.css'><link rel='stylesheet' href='../../css/animate.css'><link rel='stylesheet' href='../../css/bootstrap.min.css'><link rel='stylesheet' href='../../css/owl.carousel.css'><link rel='stylesheet' href='../../css/owl.theme.css'><link rel='stylesheet' href='../../css/owl.transitions.css'><link rel='stylesheet' href='../../style.css'><link rel='stylesheet' href='../../responsive.css'><script src='../../js/vendor/modernizr-2.6.2.min.js'></script><link rel='stylesheet' type='text/css' href='../../css/post.css'></head><body><a href='1'></a><div class='header-connect'><div class='container'><div class='row'><div class='col-md-5 col-sm-8 col-xs-8'><div class='header-half header-call'><p><span><i class='icon-cloud'></i>+019 4854 8817</span><span><i class='icon-mail'></i>ohidul.islam951@gmail.com</span></p></div></div><div class='col-md-2 col-md-offset-5  col-sm-3 col-sm-offset-1  col-xs-3  col-xs-offset-1'><div class='header-half header-social'><ul class='list-inline'><li><a href='#'><i class='fa fa-facebook'></i></a></li><li><a href='#'><i class='fa fa-twitter'></i></a></li><li><a href='#'><i class='fa fa-vine'></i></a></li><li><a href='#'><i class='fa fa-linkedin'></i></a></li><li><a href='#'><i class='fa fa-dribbble'></i></a></li><li><a href='#'><i class='fa fa-instagram'></i></a></li></ul></div></div></div></div></div><nav class='navbar navbar-default'><div class='container'><!-- Brand and toggle get grouped for better mobile display --><div class='navbar-header'><button type='button' class='navbar-toggle collapsed' data-toggle='collapse' data-target='#bs-example-navbar-collapse-1'><span class='sr-only'>Toggle navigation</span><span class='icon-bar'></span><span class='icon-bar'></span><span class='icon-bar'></span></button><a class='navbar-brand' href='#'><img src='../../img/logo.png' alt=''></a></div><div class='collapse navbar-collapse' id='bs-example-navbar-collapse-1'><div class='button navbar-right'><button class='navbar-btn nav-button wow bounceInRight login' data-wow-delay='0.8s' id='username'></button><button class='navbar-btn nav-button wow fadeInRight' data-wow-delay='0.6s' id='logout'>log out</button></div><ul class='main-nav nav navbar-nav navbar-right'><li class='wow fadeInDown' data-wow-delay='0s'><a class='' href='../../index.html'>主页</a></li><li class='wow fadeInDown' data-wow-delay='0.2s'><a href='../../post.html' class='active'>求职</a></li><li class='wow fadeInDown' data-wow-delay='0.3s'><a href='#'>关于我们</a></li><li class='wow fadeInDown' data-wow-delay='0.4s'><a href='#'>博客</a></li><li class='wow fadeInDown' data-wow-delay='0.5s'><a href='#'>联系我们</a></li></ul></div></div></nav>" + 
    "<h1 class='h1-1'>"+req.query.title+"</h1>"+
    "<h2 class='h1-1'>"+req.query.firm+"</h1>"+
    "<ul class='ul-1'>"+
    "<li class='li-1'>"+req.query.place+"</li>"+
    "<li class='li-1'>"+req.query.salary+"</li>"+
    "<li class='li-1'>"+req.query.learn+"</li>"+
    "<li class='li-1'>"+req.query.exprence+"</li>"+
    "</ul></div>"+
    "<pre class='p-1'>"+req.query.text+"</pre>"+
    "<script src='https://cdn.jsdelivr.net/npm/vue@2.5.16/dist/vue.js'></script><script type='text/javascript' src='../../js/jquery.min.js'></script><script type='text/javascript' src='../../js/post.js'></script><script>window.jQuery || document.write('<script src='../../js/vendor/jquery-1.10.2.min.js'><\/script>')</script><script src='../../js/bootstrap.min.js'></script><script src='../../js/owl.carousel.min.js'></script><script src='../../js/wow.js'></script><script src='../../js/main.js'></script></body></html>";
    //需要用户名、路径、标题名、内容

    fs.writeFile(filepath , Content , 'utf-8' , function(err){
        if(err){
            console.log(err);
        }
    });
    var sql = "INSERT INTO `post` (`title`, `path`, `place`, `salary`, `learn`, `exprence`) VALUES ('" + req.query.title+"','"+ Path+"','"+req.query.place+"','"+req.query.salary+"','"+req.query.learn+"','"+req.query.exprence+"')";
    connection.query(sql , function(err){
        if(err){
            throw err;
        }
    })
    res.redirect('http://localhost/猎头/post');
});

app.get('/post' , function(req , res){
    connection.query("SELECT * FROM `post`" , function(error , result){
        if(error){
            throw error;
        }
        res.jsonp(result.length);
    })
});

app.get('/page' , function(req , res){
    connection.query("SELECT * FROM `post`" , function(error , result){
        if (error) {
            throw error;
        }
        let askpage = [];
        for(let i = (req.query.number - 1)*10 ; i < req.query.number*10 && i< result.length ; i++)
        {
            askpage.push(result[i]);
        }
        console.log(askpage);
        res.jsonp(askpage);
        //计算第几页所需文章并返回
    });
});

app.listen(8090 , function(){
	console.log('app is listening at port 8080');
});


