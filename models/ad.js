var mongoose = require('mongoose');


var adModel = function() {

    var adSchema = mongoose.Schema(


        {
            Ad_name: String,
            Order_id: String,
            Size: String,
            Ad_type: String,
            Priority: String,
            Thirdparty_url: String,
            Landingpage_url: String,
            Creative_url: String,
            Displaymonitor_url:String,
            Clickmonitor_url : String,
            Tmp_name: String,
            Attribute: String,
            Buyer_creative_id: String,
            Advertiser_name: String,
            Duration: String,
            Html_snippet: String,
            Exchange: [String],
        }

        // order_id : String,
        // name : String,
        // size : String,
        // adtype : Number,
        // duration : Number,
        // mimes : Number,
        // channel : String,
        // cs : String,
        // tmp_name : String,
        // html_snippet : String,
        // priority : Number,
        // thirdparty_url : String,
        // landingpage_url : String,
        // category : String,
        // category_product : String,
        // attribute : Number,
        // buyer_creative_id : Number

    );

    return mongoose.model('ad', adSchema);

};

module.exports = new adModel();