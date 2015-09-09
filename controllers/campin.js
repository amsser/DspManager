'use strict';


var CampinModel = require('../models/campin');
var OrderModel = require('../models/order');
var auth = require('../lib/auth');
var authUtil = require('./authorityUtil');
var ObjectID = require('mongodb').ObjectID;
var db = require('../lib/db').db;
var co = require('co');



module.exports = function(app) {

    app.all('/campin', auth.isAuthenticated(), function(req, res) {

        var default_url = '/campin/list';

        if(req.user.role === 'admin' || req.user.role === 'dspadmin'){
            default_url = '/user/list';
        }

        res.redirect(default_url);

    });

    app.all('/campin/list', auth.isAuthenticated(), function(req, res) {

        var cd = {};

        cd = authUtil.genConditionByRole(req.user, cd);

        var result = {};

        result["page"] = "campin";
        result["todaypay"] = 0;
        result["balance"] = 400;
        
        console.log(cd);

        CampinModel.find(cd, function(err, dbcampins) {
            result["campins"] = dbcampins;
            result["list"] = true;

            res.render('campin', result);
        });

    });

    app.all('/campin/get', auth.isAuthenticated(), function(req, res) {
        var result = {};
        var id = req.param('id');

        result["page"] = "campin";
        result["todaypay"] = 0;
        result["balance"] = 400;

        co(function * () {

            result = yield authUtil.getAdvertisers(result, req.user);
            result.advertisers = JSON.stringify(result.advertisers);

            CampinModel.findById(id, function(err, campin) {

                if (err) console.log(err);

                result["campin"] = campin;

                console.log(result);

                res.render('campin', result);
            });

        })();

    });


    app.all('/campin/create', auth.isAuthenticated(), function(req, res) {


        var result = {};

        result["page"] = "campin";
        result["todaypay"] = 0;
        result["balance"] = 400;

        co(function * () {

            result = yield authUtil.getAdvertisers(result, req.user);
            result.advertisers = JSON.stringify(result.advertisers);

            res.render('campin', result);


        })();


    });

    app.all('/campin/save', auth.isAuthenticated(), function(req, res) {

        var cam = {};
        cam["name"] = req.body.campin_name;
        cam["_id"] = req.body.campin_id;
        cam["advertiser"] = req.body.advertiser;

        cam = authUtil.genID(cam);
        cam = authUtil.setBelongs(cam, req.user);

        console.log(cam);

        db().collection('campins').save(cam, function(err, result) {

            console.log(result);

            res.redirect("/campin/list");

        });

    });

    app.all('/campin/delete', auth.isAuthenticated(), function(req, res) {

        var id = req.param('id');

        CampinModel.remove({
            _id: id
        }, function(err) {
            if (err) console.log(err);
            // removed!
            res.redirect("/campin/list");
        });


    });

};