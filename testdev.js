/**
 * dev-server - serves static resources for developing "earth" locally
 */

"use strict";

console.log("============================================================");
console.log(new Date().toISOString() + " - Starting");

var util = require("util");

/**
 * Returns true if the response should be compressed.
 */
function compressionFilter(req, res) {
    return (/json|text|javascript|font/).test(res.getHeader('Content-Type'));
}

/**
 * Adds headers to a response to enable caching.
 */
function cacheControl() {
    return function(req, res, next) {
        res.setHeader("Cache-Control", "public, max-age=300");
        return next();
    };
}

function logger() {
    express.logger.token("date", function() {
        return new Date().toISOString();
    });
    express.logger.token("response-all", function(req, res) {
        return (res._header ? res._header : "").trim();
    });
    express.logger.token("request-all", function(req, res) {
        return util.inspect(req.headers);
    });
    return express.logger(
        ':date - info: :remote-addr :req[cf-connecting-ip] :req[cf-ipcountry] :method :url HTTP/:http-version ' +
        '":user-agent" :referrer :req[cf-ray] :req[accept-encoding]\\n:request-all\\n\\n:response-all\\n');
}

var port = process.argv[2];
var express = require("express");
var app = express();

app.use(cacheControl());
app.use(express.compress({filter: compressionFilter}));
app.use(logger());
app.use(express.static("public"));

//WIP
//https://stackoverflow.com/questions/13342466/send-post-request-from-client-to-node-js
//(see also: //https://itnext.io/how-to-handle-the-post-request-body-in-node-js-without-using-a-framework-cd2038b93190)
// var ServerIP = '127.0.0.1';
// var http = require("http");
// var app = http.createServer(function (request , response) {
//     console.log("request.method: ", request.method)
//     if (request.method === 'POST') {
//         console.log("Request Recieved" + request.url);
//         var SampleJsonData = JSON.stringify([{"ElementName":"ElementValue"}]);        
//         response.end('_testcb(' + SampleJsonData + ')'); // this is the postbackmethod
//     }
//    });

// //WIP
// //https://stackoverflow.com/questions/47119024/using-ajax-post-to-send-data-to-node-js-server
// app.post("/posts",  function (req, res) {
//     console.log("************************** IN HERE!!!!!!!!!!!!!!!!!11***************************************")
//     console.log("req.method: ",req.method);  
//     var SampleJsonData = JSON.stringify([{"NEWElementName":"NEWElementValue"}]);
//     console.log("SampleJsonData in server: ", SampleJsonData)
//     // res.end('_testcb(' + SampleJsonData + ')'); // this is the postbackmethod
//     res.end('_testcb(' + {"NEWElementName":"NEWElementValue"} + ')'); // this is the postbackmethod
// });
// app.use(bodyParser.json())
// app.post('/',  function (req, res) {
//     console.log("************************** IN HERE!!!!!!!!!!!!!!!!!11***************************************")
//     console.log("req.data: ", req.data);
//     console.log("req.body: ", req.body);
//     console.log("req.body.array: ", req.body.array);
//     console.log("req.type: ", req.type);    
//     console.log("req.url: ", req.url);
//     // console.log("req: ", req);
// });

// function getFromJS() {
//     return function(req, res) {
//         console.log('Request received: ');
//         // util.log(util.inspect(req)) // this line helps you inspect the request so you can see whether the data is in the url (GET) or the req body (POST)
//         util.log('Request recieved: \nmethod: ' + req.method + '\nurl: ' + req.url) // this line logs just the method and url

//         res.writeHead(200, { 'Content-Type': 'text/plain' });
//         req.on('data', function (chunk) {
//             console.log('GOT DATA!: ', chunk);
//         });
//         res.end('callback(\'{\"msg\": \"OK\"}\')');

//     };
// }
// app.use(getFromJS());

//https://samueleresca.net/2015/07/json-and-jsonp-requests-using-expressjs/
app.get('/endpointJSONP', function (req, res) {
    //LOG  
    console.log('JSONP response');
    console.log(req.query);
    //JSONP Response (doc: http://expressjs.com/api.html#res.jsonp) 
    res.jsonp(req.query) 
});



//----------------------------

app.listen(port);
console.log("Listening on port " + port + "...");
