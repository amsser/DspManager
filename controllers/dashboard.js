'use strict';

var db = require('../lib/db').db;

var uc = require('underscore');

var accounting = require('accounting');


module.exports = function (app) {


    app.all('/dashboard', function (req, res) {

    	var groupby = {};

        var cd = '2014-05-25';
        var hd = '2014-05-21';

        db().collection('dashboard').aggregate([
            {$group: {_id: groupby, Display: {$sum: "$Display"}, Click: {$sum: "$Click"}, Arrive: {$sum: "$Arrive"}, Trans: {$sum: "$Trans"},CPC: {$avg: "$CPC"},CPM: {$avg: "$CPM"},CPA: {$avg: "$CPA"},Cost: {$sum: "$Cost"}}}
        ], function (err, result) {

            console.log(result);

        	var rs = uc.extend(result[0], result[0]["_id"]);

        	rs.ClickRatio = accounting.toFixed((rs.Click / rs.Display)*10000,2);
        	rs.ArriveRatio = accounting.toFixed((rs.Arrive / rs.Display)*10000,2);
        	rs.TransRatio = accounting.toFixed((rs.Trans / rs.Display) * 10000,2);

            rs.CPC = accounting.toFixed(rs.CPC,2);
            rs.CPM = accounting.toFixed(rs.CPM,2);
            rs.CPA = accounting.toFixed(rs.CPA,2);
            rs.Cost = accounting.toFixed(rs.Cost,2);

            db().collection('dashboard').find().toArray(function (err, resultDetail) {

                uc.each(resultDetail,function(item){

                    item.ClickRatio = parseFloat(accounting.toFixed((item.Click / item.Display)*10000,2));
                    item.ArriveRatio = parseFloat(accounting.toFixed((item.Arrive / item.Display)*10000,2));
                    item.TransRatio = parseFloat(accounting.toFixed((item.Trans / item.Display)*10000,2));

                    item.CPC = parseFloat(accounting.toFixed(item.CPC,2));
                    item.CPM = parseFloat(accounting.toFixed(item.CPM,2));
                    item.CPA = parseFloat(accounting.toFixed(item.CPA,2));
                    item.Cost = parseFloat(accounting.toFixed(item.Cost,2));

                });

                resultDetail = uc(resultDetail).groupBy(function(item) {
                    return item.Hour;
                });

                var table = [];

                for(var k in resultDetail){

                    table.push({Hour : k , Detail : resultDetail[k]});

                }

                table = uc.sortBy(table,'Hour');

                res.render('dashboard',{ sum : rs , table : table });

            });  

        });
        
        
        
    });

    app.get('/dashboard/detail', function (req, res) {

    	var groupby = {Hour:"$Hour",Date:"$Date"};

        var cd = '2014-05-25';
        var hd = '2014-05-21';

        var indicator = req.param('indicator');

        db().collection('dashboard').find().toArray(function (err, result) {


            result = uc(result).groupBy(function(item) {
                return item.Date;
            });

            var cdd = result[cd];
            var hdd = result[hd];


            cdd = uc(result[cd]).sortBy(function(item) {
                return item.Hour;
            });

            hdd = uc(result[hd]).sortBy(function(item) {
                return item.Hour;
            });


            if(indicator == 'ClickRatio'){

                uc.each(cdd,function(item){
                    item.ClickRatio = parseFloat(accounting.toFixed((item.Click / item.Display)*10000,2));
                });

                uc.each(hdd,function(item){
                    item.ClickRatio = parseFloat(accounting.toFixed((item.Click / item.Display)*10000,2));
                });

            }else if(indicator == 'ArriveRatio'){

                uc.each(cdd,function(item){
                    item.ArriveRatio = parseFloat(accounting.toFixed((item.Arrive / item.Display)*10000,2));
                });

                uc.each(hdd,function(item){
                    item.ArriveRatio = parseFloat(accounting.toFixed((item.Arrive / item.Display)*10000,2));
                });


            }else if(indicator == 'TransRatio'){

                uc.each(cdd,function(item){
                    item.TransRatio = parseFloat(accounting.toFixed((item.Trans / item.Display)*10000,2));
                });

                uc.each(hdd,function(item){
                    item.TransRatio = parseFloat(accounting.toFixed((item.Trans / item.Display)*10000,2));
                });

            }



            cdd = uc(cdd).pluck(indicator);
            hdd = uc(hdd).pluck(indicator);

            console.log(cdd);

            res.send({cdd: cdd ,hdd: hdd });

        });
        
        
        
    });

};
