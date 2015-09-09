

var mongoose = require('mongoose');


var campinModel = function () {

    var campinSchema = mongoose.Schema({
        name : String,
        uid : String,
        advertiser : String,
        analyst : String,
        dspadmin : String
    });

    return mongoose.model('campin', campinSchema);

};

module.exports = new campinModel();