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

//-------------------------------------------------------------------------------------------
//Handle nc conversion of file sent by POST request
const fs = require('fs');
const NetCDFReader = require('netcdfjs');

//https://stackoverflow.com/questions/24543847/req-body-empty-on-posts
var bodyParser = require('body-parser')

app.use(express.bodyParser(
    { type: 'application/x-netcdf' },
    { limit: '50mb'}
));

var path = require('path');


app.post('/something', function (req, res) {
  const { spawn } = require('child_process');

    console.log("req in node!!!!!!!!!!!!!! "); //, req);
    console.log("req.url: ", req.url);
    console.log("req.files.file.name: ", req.files.file.name)
    console.log("req.files.file.path: ", req.files.file.path)

    var myServerRecord = {};

    const tmpfile = req.files.file.path;
    console.log("tmpfile: ", tmpfile)

    var directory = path.dirname(tmpfile);
    

    const convFile = path.basename(tmpfile, '.nc') + "_conv.nc";
    const convFileJoin = path.join(directory, convFile);
    console.log("convFile: ", convFile)
    console.log("convFile HERE JOINED: ", convFileJoin)

    //Execute shell command to convert nc file
    //$ ncks -3 fileIN.nc fileOUT.nc
    const nco_convert = spawn('ncks', ['-3', tmpfile, convFileJoin, '-O']); //-O to overwrite any existing filename
    nco_convert.stdout.on('data', (data) => {
      console.log("$data in nco_convert: ", `${data}`)
    });

    nco_convert.on('close', (code) => {
      // If you want to handle errors, could check code === 0 here for success
      console.log("code: ", code)
      const datafile = fs.readFileSync(convFileJoin);

      console.log("datafile: ", datafile)
      var reader = new NetCDFReader(datafile);
      var dataArray = reader.getDataVariable('OX');
      console.log("dataArray.length: ", dataArray.length)

      //temporary hack to deal with file that is not a monthly avg
      if (dataArray.length > 12) {
        var n = dataArray.length - 12;
        dataArray = dataArray.slice(n);
        console.log('sliced dataArray length: ', dataArray.length)
      }

      //make header obj
      var nx = reader.getDataVariable("lat").length;
      var ny = reader.getDataVariable("lon").length;
      var la1 = 90, la2 = -90, lo1 = -180, lo2 = 180; //FIXED
      var dx = 360/nx, dy = 180/ny;

      myServerRecord = {
         "header": {"nx": nx, "ny": ny, "la1": 90, "la2": -90, "lo1": -180, "lo2": 180, "dx": dx, "dy": dy},
         "data": dataArray
     }
     


     console.log("myServerRecord in node FAIT! ", myServerRecord)

     res.json( myServerRecord );

    });
   
});
//-------------------------------------------------------------------------------------------

app.listen(port);
console.log("Listening on port " + port + "...");
