'use strict';

var redis = require("redis"),
    client = redis.createClient("6379", "124.232.133.211", {
        detect_buffers: true
    });


var AdModel = require('../models/user');
var ObjectID = require('mongodb').ObjectID;
var db = require('../lib/db').db;
var CampinModel = require('../models/campin');
var OrderModel = require('../models/order');
var auth = require('../lib/auth');
var q = require('q');
var async = require('async');

module.exports = function(app) {
    var model = new AdModel();

    app.get('/user', auth.isAuthenticated(), function(req, res) {

        res.redirect("/user/list");

    });

    app.get('/user/list', auth.isAuthenticated(), function(req, res) {

        var condition = {};

        condition.Order_id = req.param('o_id');
        condition.uid = req.user._id;

        var result = {};

        result["page"] = "user";
        result["todaypay"] = 0;
        result["balance"] = 400;


        q.all([

            q.ninvoke(CampinModel, 'find', {uid:req.user._id}),
            q.ninvoke(AdModel, 'find', condition),
            q.ninvoke(OrderModel, 'find', {
                _id: condition.Order_id
            })

        ]).then(function(r) {

            result["campins"] = r[0];
            result["list"] = true;

            result["users"] = r[1];
            result.Order_id = condition.Order_id;

            result.order = r[2][0];

            res.render('user', result);

        });

    });

    app.all('/user/get', auth.isAuthenticated(), function(req, res) {

        var o_id = req.param('o_id');

        var result = {};

        result["page"] = "user";
        result["todaypay"] = 0;
        result["balance"] = 400;


        result.Order_id = o_id;

        if (req.param('id')) {
            result['id'] = req.param('id');
        }

        console.log(result);

        res.render('user', result);

    });



    app.all('/user/getjson', auth.isAuthenticated(), function(req, res) {

        var id = req.param('id');

        AdModel.findById(id, function(err, user) {

            var result = {};

            result["user"] = user;

            res.json(result);

        });

    });



    app.all('/user/save', auth.isAuthenticated(), function(req, res) {

        var user = req.body;

        console.log(user);

        if (user._id && user._id != '') {
            user._id = new ObjectID(user._id);
        } else {
            delete user._id;
        }

        if (user.Exchange && user.Exchange != '') {
            user.Exchange = user.Exchange.split(",");
        }

        user.uid = req.user._id;

        db().collection('users').save(user, function(err, result) {

            var cmd = combine_cmds(user);

            save_redis(cmd, function() {

                res.redirect("/user/list?o_id=" + user.Order_id);

            });

        });


    });

    app.all('/user/find', auth.isAuthenticated(), function(req, res) {

        var result = {};
        var id = req.param('id');

        result["page"] = "user";
        result["todaypay"] = 0;
        result["balance"] = 400;


        CampinModel.find({uid:req.user._id}, function(err, dbcampins) {
            result["campins"] = dbcampins;
            result["user_tmps"] = [{
                "name": "京东母婴",
                "id": 1
            }, {
                "name": "京东3c",
                "id": 2
            }];

            AdModel.findById(id, function(err, user) {
                result["users"] = [user];
                res.render('user', result);
            });

        });

    });

    app.all('/user/delete', auth.isAuthenticated(), function(req, res) {
        var id = req.param('id');
        var o_id = req.param('o_id');

        async.auto({
            del_redis: function(callback) {

                console.log('delete from redis');

                var usercmd = [];

                usercmd.push({
                    "oper_type": "6",
                    "fmt_ver": "1",
                    "data": [id]
                });

                console.log(JSON.stringify(usercmd));

                save_redis(usercmd, function() {

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
            res.redirect("/user/list?o_id=" + o_id);

        });

    });

};