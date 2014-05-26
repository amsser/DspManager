'use strict';

var db = require('../lib/db').db;

var uc = require('underscore');

var accounting = require('accounting');


module.exports = function(app) {


    app.get('/report_order_adpos_day', function(req, res) {

         db().collection('reportday').distinct('OrderName',function(err, orders) {

            var reo = [];

            for(var k in orders){
               reo.push({value : orders[k] }) ;
            }

            console.log(reo);

            res.render('report_order_adpos_day', {
                    orders : reo
            });


        });

    });

    app.get('/report_order_adpos_day/datestat', function(req, res) {

        var cd = '2014-05-25';
        var hd = '2014-05-02';

        var order = req.param('order');

        var cond1 = [];
        var cond2 = [];

        console.log(order);

        if(order != '所有订单'){
            cond1.push({ $match : { OrderName : order } });
            cond2.push({ $match : { OrderName : order } });
        }

        cond1.push({
            $group: {
                _id: {"Date":"$Date"},
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
                    _id: {"ADPosition":"$ADPosition"},
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

        db().collection('reportday').aggregate(cond1, function(err, result) {

            console.log(result);

            uc.each(result, function(item) {

                uc.extend(item, item["_id"])

                item.ClickRatio = parseFloat(accounting.toFixed((item.Click / item.Display) * 10000, 2));
                item.ArriveRatio = parseFloat(accounting.toFixed((item.Arrive / item.Display) * 10000, 2));
                item.TransRatio = parseFloat(accounting.toFixed((item.Trans / item.Display) * 10000, 2));

            });


            var chartData = {
                Date: uc(result).pluck('Date'),
                Display: uc(result).pluck('Display'),
                Click: uc(result).pluck('Click'),
                Arrive: uc(result).pluck('Arrive'),
                Trans: uc(result).pluck('Trans'),
                ClickRatio: uc(result).pluck('ClickRatio'),
                ArriveRatio: uc(result).pluck('ArriveRatio'),
                TransRatio: uc(result).pluck('TransRatio')
            };

            db().collection('reportday').aggregate(cond2, function(err, result) {

                console.log(result);

                uc.each(result, function(item) {

                    uc.extend(item, item["_id"])

                    item.ClickRatio = parseFloat(accounting.toFixed((item.Click / item.Display) * 10000, 2));
                    item.ArriveRatio = parseFloat(accounting.toFixed((item.Arrive / item.Display) * 10000, 2));
                    item.TransRatio = parseFloat(accounting.toFixed((item.Trans / item.Display) * 10000, 2));

                });

                res.send({chartData : chartData,table : result});


            });
 

        });



    });

};