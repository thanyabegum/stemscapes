var http = require("http");
var sys = require('util')
var exec = require('child_process').exec;
var url = require("url");

function onRequest(request, response) {
    console.log("processing song...")
    var params = url.parse(request.url,true).query;
    let name = params.filename.split(".")[0]
    exec("rm -fr assets/tmp/music/* ; spleeter separate -p spleeter:4stems-16kHz -o assets/tmp/music assets/songs/" + params.filename + " -b 320k ; mv assets/tmp/music/" + name + "/* assets/tmp/music/ ; rmdir assets/tmp/music/"+name,
    function (error, stdout, stderr) {
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);
        if (error !== null) {
             console.log('exec error: ' + error);
            response.write('error' + error);            
        }
        // response.addHeader("Access-Control-Allow-Origin", "*");
        response.end();
    });
    
}

http.createServer(onRequest).listen(8888, function(error){
    if(error){
        console.log("something went wrong", error);
    }
    else console.log("server listening on port 8888");
});
