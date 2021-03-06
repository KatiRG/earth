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
    { limit: '150mb'}
));

//https://gist.github.com/Maqsim/857a14a4909607be13d6810540d1b04f
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));


var path = require('path');


app.post('/something', function (req, res) {

  const { spawn } = require('child_process');

  console.log("req in node!!!!!!!!!!!!!! ");  
  console.log("req.body.vars: ", req.body.vars);
  console.log("req.url: ", req.url);  
  console.log("req.files.file.name: ", req.files.file.name)
  console.log("req.files.file.path: ", req.files.file.path)

  var dirName = path.dirname(req.files.file.path);
  console.log("dirName: ", dirName)


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


    //Return to client-side JS
    //https://fullstack-developer.academy/res-json-vs-res-send-vs-res-end-in-express/
    // res.json( myServerRecord );
    res.send(datafile);

    //rm temp files using this format otherwise get deprecation error
    //https://github.com/desmondmorris/node-tesseract/issues/57
    fs.unlink(req.files.file.path, err => { 
      if (err) console.log(err)
      else console.log("tmp nc file deleted");
    });
    fs.unlink(convFileJoin, err => { 
      if (err) console.log(err)
      else console.log("tmp converted nc file deleted");
    });
    

  }); //end .on close
   
});
//-------------------------------------------------------------------------------------------

app.listen(port);
console.log("Listening on port " + port + "...");
