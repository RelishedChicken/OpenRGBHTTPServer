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

        //if(hasChanged){
            update(status);
        //}
        
        res.end();


    }).listen(56789);

}


async function update (status){

    const client = new Client("OpenRGB HTTP Server", 6742, "localhost", {forceProtocolVersion: 4});

    // Handle socket errors gracefully
    client.on('error', (err) => {
        if (err.code === 'ECONNABORTED' || err.code === 'ECONNRESET') {
            console.log("Connection closed by OpenRGB (this is normal)");
        } else {
            console.error(`Client error: ${err.message}`);
        }
    });

    //Connect to OpenRGB
    await client.connect();

    const controllerCount = await client.getControllerCount();

    console.log(controllerCount);

    var newCol;

    //Get the colour to set
    if(status.currentState == 0 ){
        newCol = hexToRgb("#000000");
    }else{
        newCol = hexToRgb(status.currentColor);
    }

    var devices = await client.getAllControllerData();

    // Update each device sequentially to avoid connection issues
    for (const device of devices) {
        try {
            // Find the Direct/Custom mode
            const directMode = device.modes.find(m =>
                m.name.toLowerCase().includes('direct') ||
                m.name.toLowerCase().includes('custom')
            );

            // Only change mode if not already in direct mode
            if (directMode && device.activeMode !== directMode.id) {
                await client.updateMode(device.deviceId, { id: directMode.id });
                await delay(150); // Wait for mode change to take effect
            }

            const colours = Array(device.colors.length).fill({
                red: newCol.r,
                green: newCol.g,
                blue: newCol.b
            });

            await client.updateLeds(device.deviceId, colours);
        } catch (error) {
            console.log(`Failed to update device ${device.name}: ${error.message}`);
        }
    }

    // Wait a moment before disconnecting to ensure all updates are processed
    await delay(100);

    //Disconnect from OpenRGB
    try {
        await client.disconnect();
    } catch (error) {
        // Connection may already be closed by OpenRGB, ignore the error
    }    

}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}