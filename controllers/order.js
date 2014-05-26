'use strict';


var OrderModel = require('../models/order');


module.exports = function (app) {

    var model = new OrderModel();

    app.get('/order', function (req, res) {

        res.redirect("/order/list");

    });

    app.get('/order/list', function (req, res) {
        
        var result = {};
        result["page"] = "order";

        result["todaypay"] = 0;
        result["balance"] = 400;

        result["user"] = "京东618";
        result["campins"] = [{"name": "店庆", "id" : 1},
                        {"name": "新年", "id" : 2}];

        result["exs"] = [{"id":1 ,"name":"google"},
                    {"id":3 ,"name":"taobao"},
                    {"id":5 ,"name":"Tencent"},
                    {"id":7 ,"name":"秒针"}];
        result["anonymous"] = [{"id":0 , "name":"不限"},
                            {"id":1 , "name":"定向匿名媒体"},
                            {"id":2 , "name":"排除匿名媒体"}];

        result["orders"] = [{"id":0 , "campin":"店庆", "money": "300","owner": "京东","time": "3600","last": "64568513132","status":"投放"},
                            {"id":1 , "campin":"店庆", "money": "1000","owner": "京东","time": "86400","last": "64568513132","status":"停止"},
                            {"id":2 , "campin":"新年","money": "60000","owner": "京东","time": "3600","last": "64568513132","status":"停止"}];

        result["model"] = model;
        result["list"] = true;

        res.render('order', result);
        
    });

    app.all('/order/get', function (req, res) {
        
        var result = {};
        result["page"] = "order";

        result["todaypay"] = 0;
        result["balance"] = 400;

        result["user"] = "京东618";
        result["campins"] = [{"name": "店庆", "id" : 1},
                        {"name": "新年", "id" : 2}];

        result["exs"] = [{"id":1 ,"name":"google"},
                    {"id":3 ,"name":"taobao"},
                    {"id":5 ,"name":"Tencent"},
                    {"id":7 ,"name":"秒针"}];
        result["anonymous"] = [{"id":0 , "name":"不限"},
                            {"id":1 , "name":"定向匿名媒体"},
                            {"id":2 , "name":"排除匿名媒体"}];


        result["model"] = model;

        res.render('order', result);
        
    });

    app.all('/order/create', function (req, res) {

        var result = {};
        result["page"] = "order";

        result["todaypay"] = 0;
        result["balance"] = 400;

        result["user"] = "京东618";
        result["campins"] = [{"name": "店庆", "id" : 1},
                        {"name": "新年", "id" : 2}];

        result["exs"] = [{"id":1 ,"name":"google"},
                    {"id":3 ,"name":"taobao"},
                    {"id":5 ,"name":"Tencent"},
                    {"id":7 ,"name":"秒针"}];
        result["anonymous"] = [{"id":0 , "name":"不限"},
                            {"id":1 , "name":"定向匿名媒体"},
                            {"id":2 , "name":"排除匿名媒体"}];

        result["model"] = model;

        res.render('order', result);
        
    });

};
