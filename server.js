const { OpenRGBClient } = require('openrgb');
const http = require('http');
const url = require('url');
const hexrgb = require('hex-rgb');

var hex = 'ffffff';
var lastHex = 'ffffff';
changeColours(hex);

http.createServer(function (req,res){
    
    res.writeHead(200, {'Content-Type': 'text/html'});
    
    var query = url.parse(req.url, true).query;
    var path = url.parse(req.url, true).pathname;
    var val = query.val;
    
    if(path == "/status"){
        if(hex!="000000"){
            res.write("1");
        }else{
            res.write("0");
        }
    }else if(path == "/set"){
        if(val == null){
            res.write("#"+hex);
        }else{
            hex = val.replace("#","");
            changeColours(hex);
        }
    }else if(path == "/on"){
        hex = lastHex;
        changeColours(hex);
    }else if(path == "/off"){
        if(hex != "000000"){
            lastHex = hex;
            hex = "000000";
            changeColours(hex);
        }
    }
        
    res.end();
    
}).listen(8080);

async function changeColours (hexcol){
    
    var rgb = hexrgb(hexcol);
    console.log(rgb);
    const client = new OpenRGBClient({
        host: "localhost",
        port: 6742,
        name: "Homekit"
    });

    await client.connect();
    const controllerCount = await client.getControllerCount();

    for (let deviceId = 0; deviceId < controllerCount; deviceId++) {
        var device = await client.getDeviceController(deviceId);
        
        var colors = Array(device.colors.length).fill({
            red: rgb.red,
            green: rgb.green,
            blue: rgb.blue
        });
        
        await client.updateLeds(deviceId, colors);
    }

    await client.disconnect();
}
