const { Client } = require('openrgb-sdk');
const http = require('http');
const url = require('url');
const axios = require('axios');
const { start } = require('repl');
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

var status = {
    "currentState": 1,
    "currentColor": "#FFFFFF",
    "forceOff": false,
    "special": false,
    "specialMode": ""
}

startHTTPServer();

async function startHTTPServer(){

    //Run the server
    http.createServer(function(req,res){

        res.writeHead(200, {'Content-Type': 'application/json'});
            
        var query = url.parse(req.url, true).query;
        var path = url.parse(req.url, true).pathname;
        var val = query.value;
        var hasChanged = false;

        switch(path){
            case "/status":
                res.write(JSON.stringify(status));
                break;
            case "/setState":
                status.special = false;
                status.forceOff = true;
                status.currentState = (val==="true" ? 1 : 0);
                hasChanged = true;
                break;
            case "/setColor":
                status.special = false;
                status.currentColor = "#"+val;
                hasChanged = true;
                break;
            case "/setSpecial":
                status.special = true;
                status.specialMode = val;
                hasChanged = true;
                break;
            case "/statusSwitch":
                if(status.special && status.specialMode == val){
                    res.write("1");
                }else{
                    res.write("0");
                }
                hasChanged = true;
                break;
        }

        if(hasChanged){
            update(status);
        }
        
        res.end();


    }).listen(56789);

}


async function update (status){                 

    const client = new Client("OpenRGB HTTP Server", 6742, "localhost", {forceProtocolVersion: 4});

    //Connect to OpenRGB
    await client.connect();

    const controllerCount = await client.getControllerCount();

    var newCol;

    //Get the colour to set
    if(status.currentState == 0 ){
        newCol = hexToRgb("#000000");
    }else{
        newCol = hexToRgb(status.currentColor);
    }

    var devices = await client.getAllControllerData();   
        
    devices.forEach(async device => {
        const colours = Array(device.colors.length).fill({
            red: newCol.r,
            green: newCol.g,
            blue: newCol.b
        });      

        await client.updateLeds(device.deviceId,colours);
    });

    //Disconnect from OpenRGB
    await client.disconnect();    

}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}