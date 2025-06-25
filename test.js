const { Client } = require('openrgb-sdk');

async function testOpenRGB() {
    console.log("Testing OpenRGB connection...");
    
    try {
                
        const client = new Client("OpenRGB HTTP Server", 6742, "localhost");        
        console.log("Attempting to connect...");
        await client.connect();
        console.log("✓ Connected successfully!");        
        const controllerCount = await client.getControllerCount();
        console.log(`✓ Found ${controllerCount} controllers`);
        await client.disconnect();
        console.log("✓ Disconnected successfully");
        
    } catch (error) {
        console.error("✗ OpenRGB connection failed:", error);
        console.error("Make sure:");
        console.error("1. OpenRGB application is running");
        console.error("2. SDK Server is enabled in OpenRGB settings");
        console.error("3. Port 6742 is not blocked by firewall");
    }
}

testOpenRGB();