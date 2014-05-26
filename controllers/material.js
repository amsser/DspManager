'use strict';

var fs = require('fs');
var db = require('../lib/db').db;
var ObjectID = require('mongodb').ObjectID;
var moment = require('moment');
var path = require('path');
//var images = require("images");


module.exports = function(app) {

	app.get('/material', function(req, res) {

		res.redirect("/material/list");

	});


	app.get('/material/list', function(req, res) {


		db().collection('material').find({rm : {$ne : true}}).sort({savetime : -1}).toArray(function(err, result) {

			console.log(result);

			res.render('material_list',{data:result});

		});

		

	});

	app.all('/material/create', function(req, res) {

		res.render('material_create');

	});

	app.all('/material/save', function(req, res) {

		var material = req.body;

		// 获得文件的临时路径
		var tmp_path = req.files.m_file.path;

		var mid = Number(new Date());

		console.log(mid);

		var currentdate = moment().format('YYYYMMDDHHmmssSSS');

		// 指定文件上传后的目录
		material.file_name = currentdate + path.extname(req.files.m_file.name);
		material.target_path = './public/materials/' + material.file_name;

		material.dsp_validated = '未审核';
		material.exchange_validated = [];
		material.savetime = moment().format('YYYY-MM-DD HH:mm:ss');
		

		// 移动文件
		fs.rename(tmp_path, material.target_path, function(err) {
			if (err) throw err;

			db().collection('material').save(material, function(err, result) {

				console.log(result);

				fs.unlink(tmp_path, function() {
					if (err) throw err;
					res.redirect("/material/list");

				});

			});

		});



	});

	app.all('/material/remove', function(req, res) {

		var id = req.param('id');

		console.log(id);

		db().collection('material').update({_id: new ObjectID(id)},{$set: { rm : true }},function(err, result) {

			console.log(result);

			res.redirect("/material/list");

		});

	});


	app.all('/material/update', function(req, res) {

		var id = req.param('id');

		console.log(id);

		db().collection('material').findOne({_id: new ObjectID(id)},function(err, result) {

			console.log(result);

			res.render('material_create',result);

		});

	});


	function getExtName(file_name){
		var result =/\.[^\.]+/.exec(file_name);
		return result;
	}


};