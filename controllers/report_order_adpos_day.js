'use strict';

var db = require('../lib/db').db;

var uc = require('underscore');

var accounting = require('accounting');
var auth = require('../lib/auth');


module.exports = function(app) {


    app.get('/report_order_adpos_day', auth.isAuthenticated(), function(req, res) {

        db().collection('reportday').distinct('OrderName', function(err, orders) {

            var reo = [];

            for (var k in orders) {
                reo.push({
                    value: orders[k]
                });
            }

            console.log(reo);

            res.render('report_order_adpos_day', {
                orders: reo
            });


        });

    });

    app.get('/report_order_adpos_day/datestat', auth.isAuthenticated(), function(req, res) {

        var cd = '2014-05-01';
        var hd = '2014-05-07';

        var order = req.param('order');

        var cond1 = [];
        var cond2 = [];

        console.log(order);

        if (order != '所有订单') {
            cond1.push({
                $match: {
                    OrderName: order
                }
            });
            cond2.push({
                $match: {
                    OrderName: order
                }
            });
        }

        cond1.push({
            $group: {
                _id: {
                    "Date": "$Date"
                },
                Display: {
                    $sum: "$Display"
                },
                Click: {
                    $sum: "$Click"
                },
                Arrive: {
                    $sum: "$Arrive"
                },
                Trans: {
                    $sum: "$Trans"
                },
                Cost: {
                    $sum: "$Cost"
                }
            }
        });

        cond2.push({
            $group: {
                _id: {
                    "ADPosition": "$ADPosition"
                },
                Display: {
                    $sum: "$Display"
                },
                Click: {
                    $sum: "$Click"
                },
                Arrive: {
                    $sum: "$Arrive"
                },
                Trans: {
                    $sum: "$Trans"
                },
                Cost: {
                    $sum: "$Cost"
                }
            }
        });

        console.log(cond1);

        db().collection('reportday').aggregate(cond1, function(err, result) {

            console.log(result);

            uc.each(result, function(item) {

                uc.extend(item, item["_id"])

                item.ClickRatio = parseFloat(accounting.toFixed((item.Click / item.Display) * 10000, 2));
                item.ArriveRatio = parseFloat(accounting.toFixed((item.Arrive / item.Click), 2));
                item.TransRatio = parseFloat(accounting.toFixed((item.Trans / item.Click), 2));
                item.CPC = parseFloat(accounting.toFixed((item.Cost / item.Click), 2));
                item.CPM = parseFloat(accounting.toFixed((item.Cost / (item.Display / 1000)), 2));
                item.CPA = parseFloat(accounting.toFixed((item.Cost / item.Trans), 2));
                item.Cost = parseFloat(accounting.toFixed(item.Cost, 2));

            });

            result = uc.sortBy(result,'Date');

            var chartData = {
                Date: uc(result).pluck('Date'),
                Display: uc(result).pluck('Display'),
                Click: uc(result).pluck('Click'),
                Arrive: uc(result).pluck('Arrive'),
                Trans: uc(result).pluck('Trans'),
                ClickRatio: uc(result).pluck('ClickRatio'),
                ArriveRatio: uc(result).pluck('ArriveRatio'),
                TransRatio: uc(result).pluck('TransRatio'),
                CPC: uc(result).pluck('CPC'),
                CPM: uc(result).pluck('CPM'),
                CPA: uc(result).pluck('CPA'),
                Cost: uc(result).pluck('Cost')
            };

            db().collection('reportday').aggregate(cond2, function(err, result) {

                console.log(result);

                uc.each(result, function(item) {

                    uc.extend(item, item["_id"])

                    item.ClickRatio = parseFloat(accounting.toFixed((item.Click / item.Display) * 10000, 2));
                    item.ArriveRatio = parseFloat(accounting.toFixed((item.Arrive / item.Click), 2));
                    item.TransRatio = parseFloat(accounting.toFixed((item.Trans / item.Click), 2));
                    item.CPC = parseFloat(accounting.toFixed((item.Cost / item.Click), 2));
                    item.CPM = parseFloat(accounting.toFixed((item.Cost / (item.Display / 1000)), 2));
                    item.CPA = parseFloat(accounting.toFixed((item.Cost / item.Trans), 2));
                    item.Cost = parseFloat(accounting.toFixed(item.Cost, 2));

                });

                res.send({
                    chartData: chartData,
                    table: result
                });


            });


        });



    });

};