'use strict';


var CampinModel = require('../models/campin');
var OrderModel = require('../models/order');
var auth = require('../lib/auth');
var ObjectID = require('mongodb').ObjectID;
var db = require('../lib/db').db;



module.exports = function(app) {

    function loadUser(req, res, next) {

        console.log(req.path.split('/')[1]);
        req.user2 = "xxx";

        next();
    }


    app.all('/campin', auth.isAuthenticated(), loadUser ,function(req, res) {

        console.log("/campain");
        console.log(req.user2);
        req.campin = "xx---";

        res.redirect("/campin/list");

    });

    app.all('/campin/list', auth.isAuthenticated(), function(req, res) {

        var result = {};

        console.log(req.user._id);

        result["page"] = "campin";
        result["todaypay"] = 0;
        result["balance"] = 400;
        //

        CampinModel.find({uid:req.user._id}, function(err, dbcampins) {
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
        
        CampinModel.find({uid:req.user._id}, function(err, dbcampins) {
            result["campins"] = dbcampins;

            CampinModel.findById(id, function(err, campin) {
                if (err) console.log(err);
                result["campin"] = campin;

                OrderModel.find({
                    uid:req.user._id
                }, function(err, userorders) {
                    result["user_orders"] = userorders;
                    res.render('campin', result);
                });

            });

        });



    });

    app.all('/campin/create', auth.isAuthenticated(), function(req, res) {
        var result = {};

        result["page"] = "campin";
        result["todaypay"] = 0;
        result["balance"] = 400;
        
        
        CampinModel.find({uid:req.user._id}, function(err, dbcampins) {
            result["campins"] = dbcampins;
            res.render('campin', result);
        });

    });

    app.all('/campin/save', auth.isAuthenticated(), function(req, res) {

        var cam = {};
        cam["name"] = req.body.campin_name;
        cam["_id"] = req.body.campin_id;

        if (cam._id && cam._id != '') {

            cam._id = new ObjectID(cam._id);

        } else {
            delete cam._id;
        }

        cam.uid = req.user._id;

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