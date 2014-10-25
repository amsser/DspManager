'use strict';

var redis = require("redis"),
    client = redis.createClient("6379", "124.232.133.211", {
        detect_buffers: true
    });

var ObjectID = require('mongodb').ObjectID;
var OrderModel = require('../models/order');
var CampinModel = require('../models/campin');
var auth = require('../lib/auth');
var db = require('../lib/db').db;
var _ = require('underscore');
var q = require('q');
var async = require('async');

module.exports = function(app) {

    app.get('/order', auth.isAuthenticated(), function(req, res) {

        res.redirect("/order/list");

    });

    app.get('/order/list', auth.isAuthenticated(), function(req, res) {

        var condition = {};

        condition.Campin_id = req.param('c_id');
        condition.uid = req.user._id

        var result = {};

        result["page"] = "order";
        result["todaypay"] = 0;
        result["balance"] = 400;


        q.all([
            q.ninvoke(CampinModel, 'find', {uid:req.user._id}),
            q.ninvoke(OrderModel, 'find', condition),
            q.ninvoke(CampinModel, 'find', {
                _id: condition.Campin_id
            })

        ]).then(function(result) {

            result['campins'] = result[0];
            result['list'] = true;

            result['orders'] = result[1];

            for (var o in result.orders) {

                result.orders[o].Campin_name = result[2][0].name;

            }

            result['campaign'] = result[2][0];

            res.render('order', result);

        });

    });

    app.get('/order/listjson', auth.isAuthenticated(), function(req, res) {

        OrderModel.find({
            uid:req.user._id
            //"advertiser_id": 1
        }, function(err, ors) {
            res.json(ors);
        });

    });

    app.all('/order/get', auth.isAuthenticated(), function(req, res) {

        var result = {};
        var id = req.param("id");

        result["page"] = "order";
        result["todaypay"] = 0;
        result["balance"] = 400;


        CampinModel.find({uid:req.user._id}, function(err, dbcampins) {
            result["campins"] = dbcampins;

            OrderModel.findById(id, function(err, order) {

                result["L_time"] = trans_ltime(order.L_time);
                result["Region_in"] = JSON.stringify(order.Region_in);
                result["Url_price"] = JSON.stringify(order.Url_price);
                result["Slotid_price"] = JSON.stringify(order.Slotid_price);

                var p = {
                    Url_in: order.Url_in,
                    Url_price: order.Url_price,
                    Browser_in: order.Browser_in,
                    Adslotid_in: order.Adslotid_in,
                    Slotid_price: order.Slotid_price,
                    Slot_visibility: order.Slot_visibility,
                    Tags: order.Tags,
                    Operation_in: order.Operation_in
                };

                result.p = JSON.stringify(p);

                console.log(result.p);

                result["order"] = order;
                //result["orderjson"] = JSON.stringify(order);

                console.log(result.order);

                res.render('order', result); // body...
            });

        });

    });

    app.all('/order/create', auth.isAuthenticated(), function(req, res) {

        var c_id = req.param('c_id');

        var result = {};

        result["page"] = "order";
        result["todaypay"] = 0;
        result["balance"] = 400;

        CampinModel.find({uid:req.user._id}, function(err, dbcampins) {
            result["campins"] = dbcampins;

            result["L_time"] = trans_ltime('All');
            result.order = {};
            result.order.Campin_id = c_id;

            res.render('order', result);

        });

    });

    app.all('/order/save', auth.isAuthenticated(), function(req, res) {

        var ord = req.body;

        console.log(JSON.stringify(ord, undefined, 2));

        if (ord._id && ord._id != '') {

            ord._id = new ObjectID(ord._id);

        } else {
            delete ord._id;
        }

        console.log(ord["Region_in"]);
        ord.Region_in = trans_string_array(ord["Region_in"]);
        //console.log(ord["Url_in"]);
        ord.Url_in = JSON.parse(ord["Url_in"]);
        ord.Browser_in = trans_string_array(ord["Browser_in"]);
        ord.Operation_in = trans_string_array(ord["Operation_in"]);
        ord.Slot_visibility = trans_string_array(ord["Slot_visibility"]);

        ord.Adslotid_in = trans_string_array(ord["Adslotid_in"]);

        ord.Url_price = trans_string_object_array(ord["Url_price"]);
        ord.Slotid_price = trans_string_object_array(ord["Slotid_price"]);
        ord.Tags = _.pluck(JSON.parse(ord['Tags']), 'Tag_id');

        ord.uid = req.user._id;

        console.log(JSON.stringify(ord, null, 2));


        db().collection('orders').save(ord, function(err, result) {

            console.log(result);

            save_order_to_redis(ord,function(){

                res.redirect("/order/list?c_id=" + ord.Campin_id);

            });

        });


    });

    function trans_ltime(r) {

        var x = r;

        //console.log('x=' + x);

        var rs = Array(25);

        for (var i = 0; i < 24; i++) {

            rs[i] = {
                value: i,
                ischecked: false
            };

        }

        rs[24] = {
            value: "All",
            ischecked: true
        };


        for (var j = 0; j < x.length; j++) {

            if (x[j] == 'All') {

                rs[24] = {
                    value: "All",
                    ischecked: true
                };

            } else {
                rs[parseInt(x[j])] = {
                    value: x[j],
                    ischecked: true
                };
            }

        }

        //console.log(rs);

        return rs;

    }

    function trans_string_object_array(t) {

        return JSON.parse(t);

    }

    function trans_string_array(t) {

        var r = [];

        if (t) {

            if (typeof(t) == "string") {
                r = [t];
            } else {
                r = t;
            }

        }

        return r;

    }

    function cal_ltime(l_time_str) {

        //计算控频小时
        var hours = '000000000000000000000000'.split('');

        var ltarray = l_time_str;

        for (var k in ltarray) {

            var h = ltarray[k];

            if (h != "All") {
                hours[parseInt(h)] = '1';
            } else if (h == "All") {
                hours = "111111111111111111111111".split("");
                break;
            }
        }

        console.log(hours.join(""));

        return parseInt(hours.join(""), 2);


    }

    function save_order_to_redis(rs,callback) {

        var cmd_rs = rs;

        cmd_rs.Order_id = rs["_id"];
        cmd_rs.Freq_timeout = rs["Freq_timeout"] == "天" ? "86400" : "3600";

        cmd_rs.L_time = cal_ltime(rs["L_time"]);


        var adcmd = [];

        //delete
        adcmd.push({
            "oper_type": "5",
            "fmt_ver": "1",
            "data": [
                rs["_id"] //,
                //"101",
                //"102"
            ]
        });



        //create
        adcmd.push({
            "oper_type": "1",
            "fmt_ver": "1",
            "data": cmd_rs
        });

        console.log(JSON.stringify(adcmd));

        save_to_redis(adcmd,callback);



    }

    function save_to_redis(adcmd,callback){

        var keys = ["dcc-124.232.133.211", "dcc-124.232.133.212", "dcc-124.232.133.213", "dcc-124.232.133.214", "dcc-124.232.133.215"];


        var multi = client.multi();

        for (var i = 0; i < adcmd.length; i++) {

            var c = JSON.stringify(adcmd[i]);

            console.log(c);

            for (var x in keys) {

                var key = keys[x];
                console.log(key);
                console.log("\n\n\n");

                multi.rpush(key, c);

            }

        }

        multi.exec(function(errors, results) {

            console.log(errors);

            callback();

        });

    }

    app.all('/order/find', auth.isAuthenticated(), function(req, res) {

        var result = {};
        var name = req.param("order_name");

        result["todaypay"] = 0;
        result["balance"] = 400;

        CampinModel.find({uid:req.user._id}, function(err, dbcampins) {
            result["campins"] = dbcampins;
            result["list"] = true;

            result["anonymous"] = [{
                "id": 0,
                "name": "不限"
            }, {
                "id": 1,
                "name": "定向匿名媒体"
            }, {
                "id": 2,
                "name": "排除匿名媒体"
            }];

            OrderModel.findById(name, function(err, order) {
                result["orders"] = [order];
                res.render('order', result); // body...
            });

        });

    });

    app.all('/order/delete', auth.isAuthenticated(), function(req, res) {

        var result = {};
        var id = req.param("id");
        var c_id = req.param("c_id");

        async.auto({
            del_redis: function(callback) {

                console.log('delete from redis');

                var adcmd = [];

                //delete
                adcmd.push({
                    "oper_type": "5",
                    "fmt_ver": "1",
                    "data": [ id ]
                });

                console.log(JSON.stringify(adcmd));

                save_to_redis(adcmd,function(){

                    callback(null);

                });

            },
            del_mongo: ['del_redis',
                function(callback, results) {

                    console.log('del from mongo');

                    OrderModel.remove({
                            _id: id
                        }, function(err) {

                            if (err) console.log(err);

                            callback(null);

                        });

                }
            ]
        }, function(err, results) {

            console.log('err = ', err);
            res.redirect("/order/list?c_id=" + c_id);

        });


    });

};