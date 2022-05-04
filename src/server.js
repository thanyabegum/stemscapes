var http = require("http");
var sys = require('util')
var exec = require('child_process').exec;
var url = require("url");

const express = require("express");
const app = express();
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
  
app.get('/', async function(request, response){
    console.log("processing song...")
    let name = request.query.filename.split(".")[0]
    exec("rm -fr assets/tmp/music/* ; spleeter separate -p spleeter:4stems-16kHz -o assets/tmp/music assets/songs/" + request.query.filename + " -b 320k ; mv assets/tmp/music/" + name + "/* assets/tmp/music/ ; rmdir assets/tmp/music/"+name,
    function (error, stdout, stderr) {
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);        
        if (error !== null) {
            console.log('exec error: ' + error);
            response.send('error' + error);            
        }        
        response.end();
    });
})

app.listen(8888, () => {
    console.log("server running on port 8888");
})
// function onRequest(request, response) {
//     console.log("processing song...")
//     response.setHeader('Access-Control-Allow-Origin', '*');
//     response.setHeader('Access-Control-Allow-Credentials', true);
//     response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//     var params = url.parse(request.url,true).query;
//     let name = params.filename.split(".")[0]
//     exec("rm -fr assets/tmp/music/* ; spleeter separate -p spleeter:4stems-16kHz -o assets/tmp/music assets/songs/" + params.filename + " -b 320k ; mv assets/tmp/music/" + name + "/* assets/tmp/music/ ; rmdir assets/tmp/music/"+name,
//     function (error, stdout, stderr) {
//         console.log('stdout: ' + stdout);
//         console.log('stderr: ' + stderr);        
//         if (error !== null) {
//              console.log('exec error: ' + error);
//             response.write('error' + error);            
//         }        
//         response.end();
//     });
    
// }

// http.createServer(onRequest).listen(8888, function(error){
//     if(error){
//         console.log("something went wrong", error);
//     }
//     else console.log("server listening on port 8888");
// });
