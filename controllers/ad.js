'use strict';


var AdModel = require('../models/ad');


module.exports = function (app) {
    var model = new AdModel();

    app.get('/ad', function (req, res) {

            res.redirect("/ad/list");

    });

    app.get('/ad/list', function (req, res) {
        var result = {};

        result["page"] = "ad";
        result["model"] = model;

        result["todaypay"] = 0;
        result["balance"] = 400;

        result["user"] = "京东618"; 
        result["campins"] = [{"name": "店庆", "id" : 1},
                {"name": "新年", "id" : 2}];

        result["ads"] = [{ "id" : 1, "order": "京东618", "size":"120*200"},
            {"id" : 2, "order": "京东3c","size":"60*40"},
            {"id" : 3, "order": "京东母婴","size":"300*150"}];
        
        res.render('ad', result);
    });

    app.all('/ad/get', function (req, res) {

        var result = {};

        result["page"] = "ad";
        result["model"] = model;

        result["todaypay"] = 0;
        result["balance"] = 400;

        result["user"] = "京东618";
        result["campins"] = [{"name": "店庆", "id" : 1},
                {"name": "新年", "id" : 2}];
        result["orders"] = [{"name": "京东618", "id" : 1},
                        {"name": "京东3c", "id" : 2}];

        result["ad_tmps"] = [{"name": "京东618", "id" : 1},
                {"name": "京东3c", "id" : 2}];            
        
        res.render('ad', result);
        
    });

    app.all('/ad/create', function (req, res) {
        var result = {};

        result["page"] = "ad";
        result["model"] = model;

        result["todaypay"] = 0;
        result["balance"] = 400;

        result["user"] = "京东618";
        result["campins"] = [{"name": "店庆", "id" : 1},
                {"name": "新年", "id" : 2}];
        result["orders"] = [{"name": "京东618", "id" : 1},
                        {"name": "京东3c", "id" : 2}];

        result["ad_tmps"] = [{"name": "京东618", "id" : 1},
                {"name": "京东3c", "id" : 2}];            
        
        res.render('ad', result);

    });

    app.all('/ad/delete', function (req, res) {
        var id = req.params("id");
    });

};