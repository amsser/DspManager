'use strict';

var db = require('../lib/db').db;

var uc = require('underscore');

var accounting = require('accounting');
var auth = require('../lib/auth');

module.exports = function (app) {

    app.get('/report', auth.isAuthenticated(), function (req, res) {

        res.render('report',{curl : res.locals.active});

    });

    app.get('/queryDayReport', auth.isAuthenticated(), function (req, res) {



        var groupby = {};

        if(req.query.activity){
             groupby['ActivityName'] = "$ActivityName";
        }

        if(req.query.order){
            groupby['OrderName'] = "$OrderName";
        }

        if(req.query.exchange){
            groupby['ExchangeName'] = "$ExchangeName";
        }

        if(req.query.media){
            groupby['MediaName'] = "$MediaName";
        }

        if(req.query.adposition){
            groupby['ADPosition'] = "$ADPosition";
        }

        db().collection('reportday').aggregate([
            {$group: {_id: groupby, Display: {$sum: "$Display"}, Click: {$sum: "$Click"}, Trans: {$sum: "$Trans"},Cost: {$sum: "$Cost"}}}
        ], function (err, result) {

            uc.each(result, function(item) {

                item = uc.extend(item, item["_id"]);

                if(item.ADPosition){
                    item.ADPosition = item["ADPosition"].substr(0,10)+'...';
                }

                item.ClickRatio = parseFloat(accounting.toFixed((item.Click / item.Display) * 10000, 2));
                item.ArriveRatio = parseFloat(accounting.toFixed((item.Arrive / item.Click), 2));
                item.TransRatio = parseFloat(accounting.toFixed((item.Trans / item.Click), 2));
                item.CPC = parseFloat(accounting.toFixed((item.Cost / item.Click), 2));
                item.CPM = parseFloat(accounting.toFixed((item.Cost / (item.Display / 1000)), 2));
                item.CPA = parseFloat(accounting.toFixed((item.Cost / item.Trans), 2));
                item.Cost = parseFloat(accounting.toFixed(item.Cost, 2));

            });

            res.send({data: result});

        });


    });

};
