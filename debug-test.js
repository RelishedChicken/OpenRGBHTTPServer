const { Client } = require('openrgb-sdk');

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function debugTest() {
    console.log("=== OpenRGB Debug Test ===\n");

    try {
        const client = new Client("OpenRGB Debug Test", 6742, "localhost", {forceProtocolVersion: 4});

        client.on('error', (err) => {
            if (err.code === 'ECONNABORTED' || err.code === 'ECONNRESET') {
                console.log("ℹ Connection closed by OpenRGB");
            } else {
                console.error(`✗ Client error: ${err.message}`);
            }
        });

        console.log("Connecting...");
        await client.connect();
        console.log("✓ Connected\n");

        const devices = await client.getAllControllerData();

        // Just test the first device to keep it simple
        const device = devices[0];
        console.log(`Testing device: ${device.name}`);
        console.log(`  Device ID: ${device.deviceId}`);
        console.log(`  LED count: ${device.colors.length}`);
        console.log(`  Type: ${device.type}`);
        console.log(`  Active mode: ${device.activeMode}`);
        console.log(`  Modes available: ${device.modes.map(m => `${m.name} (id:${m.id})`).join(', ')}`);

        // Read current colors
        console.log(`\nCurrent LED colors (first 5):`);
        for (let i = 0; i < Math.min(5, device.colors.length); i++) {
            const c = device.colors[i];
            console.log(`  LED ${i}: R:${c.red} G:${c.green} B:${c.blue}`);
        }

        // Try to set to RED
        console.log(`\nAttempting to set all LEDs to RED (255,0,0)...`);
        const redColors = Array(device.colors.length).fill({
            red: 255,
            green: 0,
            blue: 0
        });

        await client.updateLeds(device.deviceId, redColors);
        console.log("✓ updateLeds() completed");

        // Wait a moment
        await delay(200);

        // Read colors again to see if they changed
        console.log(`\nRe-reading device data to verify change...`);
        const devices2 = await client.getAllControllerData();
        const device2 = devices2[0];

        console.log(`Colors after update (first 5):`);
        for (let i = 0; i < Math.min(5, device2.colors.length); i++) {
            const c = device2.colors[i];
            console.log(`  LED ${i}: R:${c.red} G:${c.green} B:${c.blue}`);
        }

        // Check if any changed
        const colorsChanged = device2.colors.some((c, i) =>
            c.red !== device.colors[i].red ||
            c.green !== device.colors[i].green ||
            c.blue !== device.colors[i].blue
        );

        console.log(`\n${colorsChanged ? '✓ Colors CHANGED in OpenRGB' : '✗ Colors DID NOT CHANGE in OpenRGB'}`);

        await delay(100);
        await client.disconnect();
        console.log("\n✓ Test complete");

    } catch (error) {
        console.error("✗ Error:", error.message);
        console.error(error.stack);
    }
}

debugTest();
