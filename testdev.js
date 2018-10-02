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
// app.get('/endpointJSONP', function (req, res) {
//     //LOG  
//     console.log('JSONP response');
//     console.log(req.query);
//     //JSONP Response (doc: http://expressjs.com/api.html#res.jsonp) 
//     res.jsonp(req.query) 
// });


const fs = require('fs');
const NetCDFReader = require('netcdfjs');

// app.get('/endpointJSONP', function (req, res) {
//     var urlpath = "http://127.0.0.1:8080/endpointJSONP?callback=" + req.query.callback;

//     var myServerRecord = {};

//     const { spawn } = require('child_process');
   
//     //ncks -3 foo4c.nc foo3.nc

//     // const nco_convert = spawn('ncks', ['-3', '/homel/cnangini/Bureau/STAGE/PALEO/DATA/APT.Sewall.4x.EARTH.ATM.nc', '/homel/cnangini/Bureau/STAGE/PALEO/DATA/junk.nc']);
//     //  nco_convert.stdout.on('data', (data) => {
//     //     console.log("$data in nco_convert: ", `${data}`)
//     //   // console.log(`stdout: ${data}`);   //`${data}` is the output of ls   
//     // });


//     const datafile = fs.readFileSync('/homel/cnangini/Bureau/STAGE/PALEO/DATA/foo3_APT.Sewall.4x.EARTH.ATM.nc');
//     var reader = new NetCDFReader(datafile); // read the header
//     var dataArray = reader.getDataVariable('t2m');

//     //make header obj
//     var nx = reader.getDataVariable("lat").length;
//     var ny = reader.getDataVariable("lon").length;
//     var la1 = 90, la2 = -90, lo1 = -180, lo2 = 180; //FIXED
//     var dx = 360/nx, dy = 180/ny;

//     myServerRecord = {
//        "header": {"nx": nx, "ny": ny, "la1": 90, "la2": -90, "lo1": -180, "lo2": 180, "dx": dx, "dy": dy},
//        "data": dataArray
//     }

//     //LOG  
//     console.log('JSONP response');
//     console.log(req.query);
//     console.log(req.query.message);
//     //JSONP Response (doc: http://expressjs.com/api.html#res.jsonp) 
//     // res.jsonp(req.query) 
    
//     // console.log("myServerRecord: ", myServerRecord);                                                                                                                                              
//     res.jsonp(myServerRecord);
// });


//https://stackoverflow.com/questions/24543847/req-body-empty-on-posts
var bodyParser = require('body-parser')
//app.use(bodyParser.json({ type: 'application/x-netcdf' }));

app.use(express.bodyParser(
    { type: 'application/x-netcdf' },
    { limit: '50mb'}
));

var path = require('path');

app.post('/something', function (req, res) {
  const { spawn } = require('child_process');

    console.log("req in node!!!!!!!!!!!!!! "); //, req);
    console.log("req.url: ", req.url);
    // console.log("req.files: ", req.files)
    console.log("req.files.file.name: ", req.files.file.name)
    console.log("req.files.file.path: ", req.files.file.path)

    var myServerRecord = {};

    const tmpfile = req.files.file.path;
    console.log("tmpfile: ", tmpfile)

    var directory = path.dirname(tmpfile);
    console.log("directory: ", directory)

    const convFile = path.basename(tmpfile, '.nc') + "_conv.nc";
    console.log("convFile: ", convFile)
    console.log("join: ", path.join(directory, convFile))

    //dynamic filenames not supported? https://github.com/browserify/brfs/issues/36
    const nco_convert = spawn('ncks', ['-3', tmpfile, '/tmp/netcdfv3.nc']);
    nco_convert.stdout.on('data', (data) => {
        console.log("$data in nco_convert: ", `${data}`)
    });


    //const datafile = fs.readFileSync(tmpfile);
    //const datafile = fs.readFileSync(path.join(directory, convFile));
    console.log("convFile HERE: ", convFile)
    console.log("convFile HERE JOINED: ", path.join(directory, convFile))


    console.log('Path of file in parent dir:', require('path').resolve(__dirname, 'testdev.js'));

    const datafile = fs.readFileSync('/tmp/netcdfv3.nc');

   
    var reader = new NetCDFReader(datafile);
    var dataArray = reader.getDataVariable('t2m');
    // console.log("dataArray: ", dataArray)

     //make header obj
    var nx = reader.getDataVariable("lat").length;
    var ny = reader.getDataVariable("lon").length;
    var la1 = 90, la2 = -90, lo1 = -180, lo2 = 180; //FIXED
    var dx = 360/nx, dy = 180/ny;

    myServerRecord = {
       "header": {"nx": nx, "ny": ny, "la1": 90, "la2": -90, "lo1": -180, "lo2": 180, "dx": dx, "dy": dy},
       "data": dataArray
   }

   
   // myServerRecord = {
   //     "header": {"nx": 96, "ny": 96},
   //     "data": [1,3,5,8,11]
   // }

   console.log("myServerRecord: ", myServerRecord)


   res.json( myServerRecord );
   // res.json( JSON.stringify(myServerRecord) );
   // res.end('OK');

// files: 
//    { file: 
//       { fieldName: 'file',
//         originalFilename: 'foo3_testCamille.nc',
//         path: '/tmp/22818-13nmkoi.8jxg.nc',
//         headers: [Object],
//         ws: [Object],
//         size: 454692,
//         name: 'foo3_testCamille.nc',
//         type: 'application/x-netcdf' } },

});





//----------------------------

app.listen(port);
console.log("Listening on port " + port + "...");
