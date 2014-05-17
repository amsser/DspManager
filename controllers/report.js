'use strict';

var db = require('../lib/db').db;

var uc = require('underscore');

module.exports = function (app) {

    app.get('/report', function (req, res) {

        var groupby = { ActivityName: "$ActivityName", OrderName: "$OrderName"};


        db().collection('reportday').aggregate([
            {$group: {_id: groupby, Display: {$sum: "$Display"}, Click: {$sum: "$Click"}, ClickRatio: {$sum: "$ClickRatio"}, Arrive: {$sum: "$Arrive"},ArriveRatio: {$sum: "$ArriveRatio"}, Trans: {$sum: "$Trans"}}}
        ], function (err, result) {

            for (var i = 0; i < result.length; i++) {

                result[i] = uc.extend(result[i], result[i]["_id"]);

                console.log(result[i]);

            }


            console.log(result);

            res.render('report', {data: result});

        });


    });

    app.get('/queryDayReport', function (req, res) {



        var groupby = {};

        console.log(req.query.order);

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

            for (var i = 0; i < result.length; i++) {

                result[i] = uc.extend(result[i], result[i]["_id"]);

                //console.log(result[i]);

            }


            //console.log(result);

            res.send({data: result});

            //res.render('report', {data: result});

        });

//        db().collection('reportday').find({},{_id : -1 , "ActivityName":1}).toArray(function (err, docs) {
//
//            console.log(docs);
//
//            res.render('report', {data : docs});
//
//        });

    });

};
