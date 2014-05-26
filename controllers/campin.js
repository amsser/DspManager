'use strict';


var CampinModel = require('../models/campin');
var OrderModel = require('../models/order');



module.exports = function (app) {

    app.get('/campin', function (req, res) {

        res.redirect("/campin/list");

    });
        
    app.get('/campin/list', function (req, res) {
        var result = {};

        result["todaypay"] = 0;
        result["balance"] = 400;
        result["user"] = "演示账户";
        CampinModel.where("id").gt(0).exec(function(err, dbcampins) {
            result["campins"] = dbcampins;
        });

        // result["campins"] = [{"name": "店庆", "id" : 1,"order_num":3, "action":"均分"},
        //                 {"name": "新年", "id" : 2,"order_num":1, "action":"按活动"}];
        console.log(result["campins"]);
        result["list"] = true;

        res.render('campin', result);
        
    });

    app.all('/campin/get', function (req, res) {
        var result = {};
        var id = req.param('id');

        result["todaypay"] = 0;
        result["balance"] = 400;
        result["user"] = "演示账户";
        CampinModel.where("id").gt(0).exec(function(err, dbcampins) {
            result["campins"] = dbcampins;
        });

        CampinModel.findById(id, function(err, campin) {
            if(err) console.log(err);
            result["campin"] = campin;
            OrderModel.find({"campin_id":campin.id}, function(err, orders){
                result["campin_orders"] = orders;
            });
        });
        OrderModel.where("id").gt(0).exec(function(err, userorders) {
            result["user_orders"] = userorders;
        });
        // result["campins"] = [{"name": "店庆", "id" : 1},
        //                 {"name": "新年", "id" : 2}];

        res.render('campin', result);
        
    });

    app.all('/campin/create', function (req, res) {
        var result = {};

        result["todaypay"] = 0;
        result["balance"] = 400;
        result["user"] = "演示账户";
        CampinModel.where("id").gt(0).exec(function(err, dbcampins) {
            result["campins"] = dbcampins;
        });
        // result["campins"] = [{"name": "店庆", "id" : 1},
        //                 {"name": "新年", "id" : 2}];

        res.render('campin', result);
        
    });

    app.all('/campin/save', function (req, res) {

        console.log(req.body);
        var cam = {};
        cam["name"] = req.body.campin_name;
        cam["orderpay_type"] = req.body.campin_ptype;
        if(req.body.campin_orders) { 
            cam["orders"] = req.body.campin_orders;
            cam["order_num"] = req.body.campin_orders.length;
   
        } else {
            cam["order_num"] = 0; 
        }

        var camentry = new CampinModel(cam);
        camentry.save();

        res.redirect("/campin/list");
    });

    app.all('/campin/delete', function (req, res) {

        var id = req.param('id');

        CampinModel.remove({ size: 'large' }, function (err) {
            if(err) console.log(err);
          // removed!
        });

        res.redirect("/campin/list");
    });

};