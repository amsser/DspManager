'use strict'

var us =  require('underscore');
var auth = require('../lib/auth');

module.exports = function (app) {

    app.get('/adxtest', auth.isAuthenticated(), function (req, res) {

        var result = {};
        result["todaypay"] = 0;
        result["balance"] = 400;
        result["user"] = "演示账户";

        res.render("adxtest", result);

    });

    app.all('/adxtest', auth.isAuthenticated(), function (req, res) {

        var result = {};
        result["todaypay"] = 0;
        result["balance"] = 400;
        result["user"] = "演示账户";

        var ord = {};
        ord["id"] = req.body.adreqid;

        var site = {};
        site["page"] = req.body.domain;
        ord["site"] = site;

        var device = {};        
        device["ua"] = req.body.ua;
        device["ip"] = req.body.ip;
        ord["device"] = device;

        var user = {};
        user["id"] = req.body.userid;
        ord["user"] = user;

        var imps = [];
        var imp = {}
        imp["id"] = 1;
        if (req.body.bidfloor) {
            var bf = parseFloat(req.body.bidfloor);
            if (bf) {
                imp["bidfloor"] = parseFloat(req.body.bidfloor);
            } else {
                imp["bidfloor"] = 0.0;
            }
        } else {
            imp["bidfloor"] = 0.0;
        }
        
        imp["tagid"] = req.body.tagid;

        var hw = req.body.size.split("*");
        var w = parseInt(hw[0]);
        var h = parseInt(hw[1]);

        var banner = {};
        banner["pos"] = parseInt(req.body.pos);
        banner["h"] = parseInt(h);
        banner["w"] = parseInt(w);
        imp["banner"] = banner;
        imps.push(imp);
        ord["imp"] = imps;
        
        var request = require('request');
        var cmd = JSON.stringify(ord);

        var options = {
            url: 'http://112.126.66.58/ay',
            method : 'post',
            headers: {
                'User-Agent': 'request',
                'Content-type' : 'application/json'
            },
            body : cmd
        };

        function callback(error, response, body) {
            if (!error && response.statusCode == 200) {
                result["json_code"] = cmd;
                result["response_body"] = body;
                res.render("adxtest", result);
            } else if (!error && response.statusCode == 204) {
                result["json_code"] = cmd;
                result["response_body"] = "不参与竞价";
                res.render("adxtest", result);
            } else {
                result["json_code"] = cmd;
                res.render("adxtest", result);
            };
        }

        request(options, callback);

    });


};