
var mongoose = require('mongoose');


var reportDayModel = function () {

    var reportDaySchema = mongoose.Schema({

        ActivityName : String,
        OrderName : String,
        ExchangeName : String,
        MediaName : String,
        ADPosition : String,
        Date : String,
        Display : Number,
        Click : Number,
        ClickRatio : Number,
        Arrive : Number,
        ArriveRatio : Number,
        Trans : Number

    });

    return mongoose.model('reportday', reportDaySchema);
};

module.exports = new reportDayModel();