var page;
var tweets;
var username = document.getElementById('username');
var logout = document.getElementById('logout');
$.ajax({
  type : "GET",
  url : 'http://127.0.0.1:8090/session',
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
}); // 是否登陆过
function solve(data)
{
  if(data == "pleaselog")
  {
    window.location.href="http://localhost/猎头/login";
  }
  else{
    console.log(data);
    username.innerHTML = data;
  }
}

logout.onclick = function(){
  $.ajax({
    type : 'GET',
    url : 'http://127.0.0.1:8090/logout',
    dataType : 'jsonp',
    data : {},
    success: function(){
      window.location.href="http://localhost/猎头/login";
    },
    error : function(XMLHttpRequest, textStatus, errorThrown){
      console.log("失败11");
      console.log(XMLHttpRequest.status);
            console.log(XMLHttpRequest.readyState);
            console.log(textStatus);
    }
  })
}


Vue.component('tweet-component', { 
	template: `
		<div class="tweet">
			<div class="box_div">
				<a :href="tweet.path"><h1 class="box_h1">{{ tweet.title }}</h1></a>
				<ul class="box_ul">
					<li class="box_li_1">{{ tweet.salary }}</li>
					<li class="box_li">{{ tweet.place }}</li>
					<li class="box_li">{{ tweet.exprence }}</li>
					<li class="box_li">{{ tweet.learn }} </li>
				</ul>
			</div>
		</div> `,
 	props:{ 
 		 	tweet: Object
 		},
 });

// function fun(data)
// {
// 	page = parseInt(data/15) + 1;//===========15 篇文章一页
// 	new Vue({
// 		el: '#ul_bottom',
// 		data: {
// 			pages: page
// 		}
// 	});
	
// 	let li_bottom = document.getElementsByClassName('li_bottom');
// 	for(let i = 0 ; i < li_bottom.length ; i++)
// 	{
// /*		li_bottom[i].index = i;*/
// 		li_bottom[i].onclick = function()
// 		{
// 			console.log(i);
// 			$.ajax({
// 				type : 'GET',
// 				url : 'http://127.0.0.1:8080/page',
// 				dataType : 'jsonp',
// 				data : {
// 					number : i+1,
// 				},
// 				jsonp:'callback',
// 				jsonpCallback:'writepage',
// 				error : function(XMLHttpRequest, textStatus, errorThrown){
// 					console.log("失败11");
// 					console.log(XMLHttpRequest.status);
//             		console.log(XMLHttpRequest.readyState);
//             		console.log(textStatus);
// 				}
// 			})
// 		}
// 	}
// 	$(li_bottom[1]).trigger("click");
// }

// function fun(data , callback){
// 	page = parseInt(data/15) + 1;
// 	callback(page);
// }
// console.log(page);
/*new Vue({
		el: '#ul-bottom',
		data: {
			pages: page
		}
	});*/
function writepage(datas)
{
	console.log('sss');
	// tweets = datas;
	// console.log(tweets)
}

new Vue({
	el : "#all",
	data () {
		return {
			tweets: [],
			pages: []
		}
	},
	methods: {
		change () {
		},
		getPage () {
			let _that = this;
			$.ajax({
				type : "GET",
				url : 'http://127.0.0.1:8090/post',
				dataType : 'jsonp',
				data : {},
				jsonp:'callback',
				// jsonpCallback:'fun',
				success: function(data) {
					_that.pages = parseInt(data/10) + 1;
				},
				error : function(XMLHttpRequest, textStatus, errorThrown){
						console.log("失败11");
						console.log(XMLHttpRequest.status);
			            console.log(XMLHttpRequest.readyState);
			            console.log(textStatus);
					}
			}); // 有多少篇求职信息 
			console.log(2);
		},
		getData (index) {
			let _that = this;
			$.ajax({
				type : 'GET',
				url : 'http://127.0.0.1:8090/page',
				dataType : 'jsonp',
				data : {
					number : index,
				},
				jsonp:'callback',
				// jsonpCallback:'writepage',
				success: function(datas) {
					_that.tweets = datas;
					// _that.$set(_that.tweets, datas);
				},
				error : function(XMLHttpRequest, textStatus, errorThrown){
					console.log("失败11");
					console.log(XMLHttpRequest.status);
            		console.log(XMLHttpRequest.readyState);
            		console.log(textStatus);
				}
			}) // 请求到文章信息 并渲染到前端
 			console.log(1);
		}
	},
/*	beforeCreate () {
		
	},	*/
	created () {
		// this.$set()
		// this.getData()
		this.getData(1);
		this.getPage();
	}
});