var request = require('request');
var http = require('http');
var lineReader = require('line-reader');
var myDate = new Date();

var options = {
    url: 'http://112.126.66.58/ay',
    method : 'post',
    headers: {
        'User-Agent': 'request',
        'Content-type' : 'application/json'
    },
};

lineReader.eachLine('loadtest.json', function(line) {
    options["body"] = line;

    request(options, function (error, res, body) {

    });
});

// Readable.on('data', function(chunk) {
//   console.log(chunk);
// })
// var cmd = JSON.stringify(ord);



// var req = http.request(options, function(res) {
//     console.log(res.statusCode);
// });

// Readable.pipe(req);