//https://tuchong.com/

//引入依赖
var express = require('express') //web框架
//var utility = require('utility') //md5加密

var app = express()
var superagent = require('superagent') //get 请求
var cheerio = require('cheerio') //解析HTML

var path = require('path') //nodejs 自带path框架
var fs = require('fs') //nodejs 自带文件流框架
var request = require('request') //request get 请求 类似superagnet

//app 为web框架，可搭建一个web服务器，superagent是一个网络请求框架，可以去请求网络
app.get('/', function(req, res, next) {
	superagent.get('https://tuchong.com/').end(function(err, sres) {
		if (err) {
			return next(err);
		}

		var $ = cheerio.load(sres.text);
		var items = [];
		//		$("a.theatre-view").each(function (idx, element) {
		//			var $element = $(element);
		//			items.push({
		//				title: $element.attr('title'),
		//				href: $element.attr('href')
		//			});
		//		});
		$('.post-collage img').each(function(idx, element) {
			var $element = $(element);
			items.push({
				scr: $element.attr('src'),
				href: $element.attr('href')
			});
			var imageSrc = $element.attr('src')
			var fileImage = parseUrlForFileName(imageSrc)
			console.log(fileImage);
			downloadImageForUrl(imageSrc, fileImage)
		});
		res.send(items)
	})

})

function parseUrlForFileName(address) {
	var fileName = path.basename(address)
	return fileName
}

var downloadImageForUrl = function(imageSrc, filename) {
	// request.head(imageSrc, function(err, res, body) {
	// 	request(imageSrc).pipe(fs.createWriteStream('images/' + filename));
	// });

	superagent.get(imageSrc).pipe(fs.createWriteStream('images_superagent/' +filename));
}

app.listen(3000, function(req, res) {
	console.log('app is running at port 3000');
})