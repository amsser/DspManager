'use strict';

var redis = require("redis"),
    client = redis.createClient("6379", "124.232.133.211", {
        detect_buffers: true
    });


var AdModel = require('../models/ad');
var ObjectID = require('mongodb').ObjectID;
var db = require('../lib/db').db;
var CampinModel = require('../models/campin');
var OrderModel = require('../models/order');
var auth = require('../lib/auth');
var q = require('q');
var async = require('async');
var authUtil = require('./authorityUtil');

module.exports = function(app) {
    var model = new AdModel();

    app.get('/ad', auth.isAuthenticated(), function(req, res) {

        res.redirect("/ad/list");

    });

    app.get('/ad/list', auth.isAuthenticated(), function(req, res) {

        var condition = {};

        condition.Order_id = req.param('o_id');

        var result = {};

        result["page"] = "ad";
        result["todaypay"] = 0;
        result["balance"] = 400;


        q.all([

            q.ninvoke(CampinModel, 'find', {
                uid: req.user._id
            }),
            q.ninvoke(AdModel, 'find', condition),
            q.ninvoke(OrderModel, 'find', {
                _id: condition.Order_id
            })

        ]).then(function(r) {

            result["campins"] = r[0];
            result["list"] = true;

            result["ads"] = r[1];
            result.Order_id = condition.Order_id;

            result.order = r[2][0];

            res.render('ad', result);

        });

    });

    app.all('/ad/get', auth.isAuthenticated(), function(req, res) {

        var o_id = req.param('o_id');

        var result = {};

        result["page"] = "ad";
        result["todaypay"] = 0;
        result["balance"] = 400;


        result.Order_id = o_id;

        if (req.param('id')) {
            result['id'] = req.param('id');

            AdModel.findById(req.param('id'), function(err, ad) {

                result["ad"] = ad;

                console.log(result);

                res.render('ad', result);

            });


        }else{
            res.render('ad', result);
        }

        


    });



    app.all('/ad/getjson', auth.isAuthenticated(), function(req, res) {

        var id = req.param('id');

        AdModel.findById(id, function(err, ad) {

            var result = {};

            result["ad"] = ad;

            res.json(result);

        });

    });



    app.all('/ad/save', auth.isAuthenticated(), function(req, res) {

        var ad = req.body;

        console.log(ad);

        ad = authUtil.genID(ad);
        ad = authUtil.setBelongs(ad, req.user);

        // if (ad.Exchange && ad.Exchange != '') {
        //     ad.Exchange = ad.Exchange.split(",");
        // }

        db().collection('ads').save(ad, function(err, result) {

            var cmd = combine_cmds(ad);

            console.log(ad);

            save_redis(cmd, function() {

                res.redirect("/ad/list?o_id=" + ad.Order_id);

            });

        });


    });

    function save_redis(adcmd, callback) {


        var keys = ["dcc-124.232.133.211", "dcc-124.232.133.212", "dcc-124.232.133.213", "dcc-124.232.133.214", "dcc-124.232.133.215"];


        var multi = client.multi();

        for (var i = 0; i < adcmd.length; i++) {

            var c = JSON.stringify(adcmd[i]);

            console.log(c);

            for (var x in keys) {

                var key = keys[x];
                console.log(key);
                console.log("\n");

                multi.rpush(key, c);

            }

        }

        multi.exec(function(errors, results) {

            console.log(errors);
            callback();

        });


    }

    function combine_cmds(rs) {

        rs["Ad_id"] = rs["_id"];

        var adcmd = [];

        adcmd.push({
            "oper_type": "6",
            "fmt_ver": "1",
            "data": [
                rs["_id"]
            ]
        });

        adcmd.push({
            "oper_type": "2",
            "fmt_ver": "1",
            "data": rs
        });

        return adcmd;

    }

    app.all('/ad/find', auth.isAuthenticated(), function(req, res) {

        var result = {};
        var id = req.param('id');

        result["page"] = "ad";
        result["todaypay"] = 0;
        result["balance"] = 400;


        CampinModel.find({
            uid: req.user._id
        }, function(err, dbcampins) {
            result["campins"] = dbcampins;
            result["ad_tmps"] = [{
                "name": "京东母婴",
                "id": 1
            }, {
                "name": "京东3c",
                "id": 2
            }];

            AdModel.findById(id, function(err, ad) {
                result["ads"] = [ad];
                res.render('ad', result);
            });

        });

    });

    app.all('/ad/delete', auth.isAuthenticated(), function(req, res) {
        var id = req.param('id');
        var o_id = req.param('o_id');

        async.auto({
            del_redis: function(callback) {

                console.log('delete from redis');

                var adcmd = [];

                adcmd.push({
                    "oper_type": "6",
                    "fmt_ver": "1",
                    "data": [id]
                });

                console.log(JSON.stringify(adcmd));

                save_redis(adcmd, function() {

                    callback(null);

                });

            },
            del_mongo: ['del_redis',
                function(callback, results) {

                    console.log('del from mongo');

                    AdModel.remove({
                        _id: id
                    }, function(err) {
                        if (err) console.log(err);
                        callback(null);
                    });

                }
            ]
        }, function(err, results) {

            console.log('err = ', err);
            res.redirect("/ad/list?o_id=" + o_id);

        });

    });

};