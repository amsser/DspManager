/**
 * Created with JetBrains WebStorm.
 * User: bill
 * Date: 5/6/14
 * Time: 11:53 AM
 * To change this template use File | Settings | File Templates.
 */

'use strict';
var mongoose = require('mongoose');

var db = function () {
    return {
        config: function (conf) {
            //mongoose.connect('mongodb://' + conf.host + '/' + conf.database);
            //mongodb://username:password@host:port/database

            mongoose.connect('mongodb://'+conf.username+':'+conf.password+'@'+conf.host+':'+conf.port+'/'+conf.dbname);

            var db = mongoose.connection;
            db.on('error', console.error.bind(console, 'connection error:'));
            db.once('open', function callback() {
                console.log('db connection open');
            });
        }
    };
};

module.exports = db();