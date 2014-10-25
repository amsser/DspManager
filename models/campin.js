

var mongoose = require('mongoose');


var campinModel = function () {

    var campinSchema = mongoose.Schema({
        name : String
    });

    return mongoose.model('campin', campinSchema);

};

module.exports = new campinModel();