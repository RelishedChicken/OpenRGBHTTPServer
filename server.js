const { OpenRGBClient } = require('openrgb');
const http = require('http');
const url = require('url');
const colourFade = require('fade-steps');

///OPTIONS
var useColourFading = false;

var hex = '#000000';
var lastHex = '#ffffff';
var turnedOff = false;

http.createServer(function (req,res){
    
    res.writeHead(200, {'Content-Type': 'text/html'});
    
    var query = url.parse(req.url, true).query;
    var path = url.parse(req.url, true).pathname;
    var val = query.val;
    
    if(path == "/status"){
        if(hex == "#000000"){
            res.write("0");
        }else{
            res.write("1");
        }
    }else if(path == "/set"){
        if(val == null){
            res.write(hex);
        }else{
            lastHex = hex;
            hex = val;
        }
    }else if(path == "/on"){
        hex = lastHex;
        lastHex = "#000000";
        turnedOff = false;
    }else if(path == "/off"){
        lastHex = hex;
        hex = "#000000";
        turnedOff = true;
    }
        
    var interval = 100;
    
    var colArray = colourFade(lastHex.replace("#",""),hex.replace("#",""),10);
    
    if(useColourFading){
        for(i=0;i<colArray.length;i++){
            setTimeout(function(i){
                changeColours(colArray[i]);
            }, interval * i, i);
        }
    }else{
        if(turnedOff){
            changeColours("#000000");
        }else{
            changeColours(hex);
        }
        
    }
    
    console.log("Starting at: "+lastHex.replace("#",""));
    console.log("Ending at: "+hex.replace("#",""));
        
    res.end();
    
}).listen(8080);

async function changeColours (hexcol){
    
    var rgb = hexToRgb(hexcol);
    
    console.log(rgb);
    
    const client = new OpenRGBClient({
        host: "localhost",
        port: 6742,
        name: "Open RGB HTTP Server"
    });

    await client.connect();
    const controllerCount = await client.getControllerCount();

    for (let deviceId = 0; deviceId < controllerCount; deviceId++) {
        var device = await client.getDeviceController(deviceId);
        
        var colors = Array(device.colors.length).fill({
            red: rgb.r,
            green: rgb.g,
            blue: rgb.b
        });
        
        await client.updateLeds(deviceId, colors);
    }

    
    return true;
}

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}
