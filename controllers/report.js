'use strict';

var db = require('../lib/db').db;

var uc = require('underscore');

var accounting = require('accounting');

module.exports = function (app) {

    app.get('/report', function (req, res) {

        res.render('report',{curl : res.locals.active});

    });

    app.get('/queryDayReport', function (req, res) {



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
            {$group: {_id: groupby, Display: {$sum: "$Display"}, Click: {$sum: "$Click"}, ClickRatio: {$sum: "$ClickRatio"}, Arrive: {$sum: "$Arrive"},ArriveRatio: {$sum: "$ArriveRatio"}, Trans: {$sum: "$Trans"}}}
        ], function (err, result) {

            uc.each(result, function(item) {

                uc.extend(item, item["_id"])

                item.ClickRatio = parseFloat(accounting.toFixed((item.Click / item.Display) * 10000, 2));
                item.ArriveRatio = parseFloat(accounting.toFixed((item.Arrive / item.Display) * 10000, 2));
                item.TransRatio = parseFloat(accounting.toFixed((item.Trans / item.Display) * 10000, 2));

            });

            res.send({data: result});

        });


    });

};
