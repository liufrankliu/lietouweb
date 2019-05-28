var username = document.getElementById('username');
var password = document.getElementById('password');
var verify = document.getElementById('verify');
var x = document.getElementById('submit');

let strCookie = document.cookie.split(";");
for(let i = 0 ; i < strCookie.length ; i++ )
{
	let strHead = strCookie[i].split("=");
	if(strHead[0] == "userid")
	{
		username.value = strHead[1];
	}
}

function logtime(){
    let exptime = new Date();
    exptime.setTime(exptime.getTime());//获得登录时间
    return exptime.toGMTString();
}

function setcookie(name , value)
{
	let exp = new Date();
	exp.setTime(exp.getTime() + 60 * 2000);
	document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
}

$.ajax({
	type : 'GET',
	url : 'http://127.0.0.1:8080/session',
	dataType : 'jsonp',
	data : {},
	jsonp:'callback',
	jsonpCallback:'fun',
	/*success : fun,*/
	error : function(XMLHttpRequest, textStatus, errorThrown){
			console.log("失败11");
			console.log(XMLHttpRequest.status);
            console.log(XMLHttpRequest.readyState);
            console.log(textStatus);
		}
});// 验证以前是否登陆

$.ajax({
	type : 'GET',
	url : 'http://127.0.0.1:8090/login',
	dataType : 'jsonp',
	data : {},
	jsonp: 'callback',
	jsonpCallback: 'a',
	/*success : function(data){
		var img = document.createElement("img");  
        img.src = data.img;
        document.body.appendChild(img);
	}*/
});  // 向服务器请求验证码


x.onclick = function(){
	let datas = {
		name : username.value,
		password : password.value,
		verify : verify.value,
		time : logtime()
	}
	console.log(datas);
	$.ajax({
		type : 'GET',
		url : 'http://127.0.0.1:8090/login/add',
		dataType : 'jsonp',
		data : datas,
		jsonp:'callback',
		jsonpCallback:'fun',
/*		success : fun,*/
		error : function(XMLHttpRequest, textStatus, errorThrown){
			console.log("失败");
			console.log(XMLHttpRequest.status);
            console.log(XMLHttpRequest.readyState);
            console.log(textStatus);
		}
	});
}



function fun(data){
			if(data == "fault"){
				console.log("失败");
				setcookie("userid" , username.value);
				window.location.reload(); 
			}
			else if(data == "faultlog"){
				window.location.reload(); 
				console.log("密码不对");
			}
			else if(data == "login"){
				console.log("登陆成功");
				window.location.href="http://localhost/猎头/";
			}
			else if(data == "notfind"){
				console.log("不存在该用户");
				window.location.reload(); 
			}
		
}

function a(data)
{
	var img = document.createElement("img");
	var div = document.getElementById('img_verify');  
    img.src = data.img;
    div.appendChild(img);
}


