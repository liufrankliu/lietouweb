$.ajax({
	type : "GET",
	url : 'http://127.0.0.1:8080/session',
	dataType : 'jsonp',
	data : {},
	jsonp:'callback',
	jsonpCallback:'solve',
	error : function(XMLHttpRequest, textStatus, errorThrown){
			console.log("失败11");
			console.log(XMLHttpRequest.status);
            console.log(XMLHttpRequest.readyState);
            console.log(textStatus);
		}
});

function solve(data)
{
	if(data == "pleaselog")
	{
		window.location.href="http://localhost/猎头/login";
	}
}