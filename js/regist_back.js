var express = require("express");
var app = express();
var app_verify = express();
var mysql = require('mysql');
var http = require('http');
var querystring=require("querystring");
var fs = require('fs');
var BMP24 = require('gd-bmp').BMP24;
var connection=mysql.createConnection(
	{
		host : "localhost",
		user :"root",
		password : "lhb980601",
		database : "lietou"
});

connection.connect();

function rand(min, max) {
    return Math.random()*(max-min+1) + min | 0; //特殊的技巧，|0可以强制转换为整数
}

var very = {
    init : function(){
        very.check = [];
        very.makeCapcha();
    },

    makeCapcha : function(){
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
        console.log(str);
        var fonts = [BMP24.font8x16, BMP24.font12x24, BMP24.font16x32];
        var x = 15, y=8;
        for(var i=0; i<str.length; i++){
            var f = fonts[Math.random() * fonts.length |0];
            y = 8 + rand(-10, 10);
            img.drawChar(str[i], x, y, f, rand(0, 0xffffff));
            x += f.w + rand(2, 8);
        }
    /*return img;*/
        very.check[0] = img.getFileData().toString('base64');
        very.check[1] = str;
    }
}

app.get('/regist',function(req , res){
	very.init();
    res.jsonp({
        img : 'data:image/bmp;base64,' + very.check[0],
    })
});
app.get('/regist/add',function(req , res){
    if(req.query.verify != very.check[1])
    {
        res.jsonp("fault");
    }
    else if(req.query.verify == very.check[1])
    {  
        connection.query('SELECT name FROM user' , function(error , result){
            if(error)
            {
                console.log(error)
                return;
            }
            else
            {
                let flag = 0;
                for(let i = 0 ; i < result.length ; i++)
                {
                    if(result[i].name == req.query.name)
                    {
                        flag = 1;
                        break;
                    }
                }
                if(flag == 1)
                {
                    res.jsonp("repeat");
                }
                else
                {
                    let addsql = 'INSERT INTO user(name , password) VALUES(? , ?)';
                    let addsqlparams = [req.query.name , req.query.password];
                    connection.query(addsql , addsqlparams , function(error)
                    {
                        if(error)
                        {
                            console.log(error.message);
                        }
                    });
                    var dirname = "../users/" + req.query.name;
                    fs.mkdir(dirname , function(err){
                        if(err){
                            throw err;
                        }
                        console.log("make dir success");
                    })
                    res.jsonp("right");
                }
            }
        });
    }
});

app.listen(8090 , function(){
	console.log('app is listening at port 8080');
});



