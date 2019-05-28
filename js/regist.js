var username = document.getElementById('username');
var password = document.getElementById('password');
var verify = document.getElementById('verify');
var x = document.getElementById('submit');

$.ajax({
	type : 'GET',
	url : 'http://127.0.0.1:8090/regist',
	dataType : 'jsonp',
	data : {},
	jsonp: 'callback',
	jsonpCallback: 'a',
	/*success : function(data){
		var img = document.createElement("img");  
        img.src = data.img;
        document.body.appendChild(img);
	}*/
});


function a(data)
{
	var img = document.createElement("img");
	var div = document.getElementById('img_verify');  
    img.src = data.img;
    div.appendChild(img);
}

x.onclick=function(){
	let datas = {
		name : username.value,
		password : password.value,
		verify : verify.value
	}
	console.log(datas)
	$.ajax({
		type : 'GET',
		url : 'http://127.0.0.1:8090/regist/add',
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
				window.location.reload(); 
			}
			else if(data == "right"){
				console.log("成功了");
				window.location.href="login.html"; 
			}
			else if(data == "repeat"){
				alert("重复了");
			}
		
}

/*===========================================
今后功能改善
失去焦点时发送请求判断注册名是否重复
===========================================
*/
