var mongoose = require('mongoose');


var adModel = function() {

    var adSchema = mongoose.Schema({
            Ad_name: String,
            Order_id: String,
            Size: String,
            Ad_type: String,
            Priority: String,
            Thirdparty_url: String,
            Landingpage_url: String,
            Creative_url: String,
            Displaymonitor_url: String,
            Clickmonitor_url: String,
            Tmp_name: String,
            Attribute: String,
            Buyer_creative_id: String,
            Advertiser_name: String,
            Duration: String,
            Html_snippet: String,
            Exchange: [String],
            advertiser: String,
            analyst: String,
            dspadmin: String
        }

    );

    return mongoose.model('ad', adSchema);

};

module.exports = new adModel();