const { Client } = require('openrgb-sdk');

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function testOpenRGB() {
    console.log("Testing OpenRGB connection...");
    
    try {
                
        const client = new Client("OpenRGB HTTP Server", 6742, "localhost", {forceProtocolVersion: 4});

        // Handle socket errors gracefully
        client.on('error', (err) => {
            if (err.code === 'ECONNABORTED' || err.code === 'ECONNRESET') {
                console.log("ℹ Connection closed by OpenRGB (this is normal)");
            } else {
                console.error(`✗ Client error: ${err.message}`);
            }
        });

        console.log("Attempting to connect...");
        await client.connect();
        console.log("✓ Connected successfully!");        
        const controllerCount = await client.getControllerCount();
        console.log(`✓ Found ${controllerCount} controllers`);
        console.log("Attempting to set LEDs...");           
        
        var devices = await client.getAllControllerData();

        // Update each device sequentially to avoid connection issues
        for (const device of devices) {
            try {
                console.log(`Updating device: ${device.name} (${device.colors.length} LEDs)`);

                // Find the Direct/Custom mode
                const directMode = device.modes.find(m =>
                    m.name.toLowerCase().includes('direct') ||
                    m.name.toLowerCase().includes('custom')
                );

                if (directMode) {
                    console.log(`  Found Direct mode: ${directMode.name} (mode id: ${directMode.id})`);
                    console.log(`  Current mode: ${device.activeMode}`);

                    // Only change mode if not already in direct mode
                    if (device.activeMode !== directMode.id) {
                        console.log(`  Changing to Direct mode...`);
                        await client.updateMode(device.deviceId, { id: directMode.id });
                        await delay(150); // Wait for mode change to take effect
                    } else {
                        console.log(`  Already in Direct mode`);
                    }
                } else {
                    console.log(`  No direct/custom mode found, trying without mode change`);
                }

                const colours = Array(device.colors.length).fill({
                    red: 255,
                    green: 255,
                    blue: 255
                });

                await client.updateLeds(device.deviceId, colours);
                console.log(`✓ Updated ${device.name} successfully`);
            } catch (error) {
                console.error(`✗ Failed to update device ${device.name}: ${error.message}`);
            }
        }

        // Wait a moment before disconnecting to ensure all updates are processed
        await delay(100);

        try {
            await client.disconnect();
            console.log("✓ Disconnected successfully");
        } catch (error) {
            // Connection may already be closed by OpenRGB
            console.log("ℹ Connection already closed");
        }
        
    } catch (error) {
        console.error("✗ OpenRGB error:", error);
    }
}

testOpenRGB();