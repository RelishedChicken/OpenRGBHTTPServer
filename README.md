# OpenRGB HTTP Server

## What is this?
This is a simple NodeJS HTTP to allow control of RGB lighting connected to OpenRGB (https://gitlab.com/CalcProgrammer1/OpenRGB). This is useful for simple browser control (through the URL or through AJAX requests) or for Smart Home integrations (using HomeBridge and the homebridge-better-http-rgb plugin).

## Installation

- Download the `server.js` file and place it somehwere on your PC. You'll need to know it's directory later.
- Make sure you have the latest version of NodeJS. This has been tested on v14.15.0. Please raise an issue if you find it does not work for you.
- Install the dependencies
  - Open CMD, and enter the following `cd <your-directory-from-earlier>`
  - Enter the command `npm install openrgb` (https://www.npmjs.com/package/openrgb)
  - Enter the command `npm install fade-steps` (https://www.npmjs.com/package/fade-steps)
- Make sure that OpenRGB is open, and the SDK Server is running. The port needs to be `6742` and nothing else. Note: the IP setup in the NodeJS server is `localhost` so if you plan to run this server elsewhere, you'd need to change that.
- Run the NodeJS server
  - Open CMD, and enter the following `cd <your-directory-from-earlier>`
  - Then, enter `node server.js`, this should then boot the server and some output should appear.
- The server is now running and listening on port `8080`.

## Usage

Command | URL | Info
------------ | ------------- | -------------
On | http://localhost:8080/on | Turns the lighting on to its last used colour before being turned off.
Off | http://localhost:8080/off | Turns the lighting off.
Status | http://localhost:8080/status | Returns `0` if lights are off (black) and returns `1` if they are any colour and on (note these are returned in the HTML body.
Set Colour | http://localhost:8080/set?val=[HEX-COLOUR] | Sets colour of PC lighting with `[HEX-COLOUR]` being any Hexadecimal colour.
Get Colour | http://localhost:8080/set | Returns the colour as a Hexadecimal (e.g. `#754643`).

## Extra Settings
If you'd like to have a fading animation between colour changes and turning lights on and off, change the boolean `useColourFading` to `true`. This will enable it. Note: this is a very basic implementation of it and therefore may be buggy with slower devices.

## Smart Home (HomeKit)
To do this, I used HomeBridge and a plugin for it called homebridge-better-http-rgb (https://www.npmjs.com/package/homebridge-better-http-rgb). It allows you to configure a HomeKit accessory that uses HTTP calls to turn RGB lighting on, off and change thier colour. If you need any help with this the before-mentioned link should help.

I also setup this NodeJS server as a Windows Service, meaning when the PC boots, the server is automatically started in the background without a CMD window. I can help with this, just let me know.

## Future Additions
If there is anything you'd think I can add to make this better, raise and issue and I'd be happy to take a look!

## Notes
Many thanks to the following:
vlakreeh for the NodeJS OpenRGB Client (https://www.npmjs.com/~vlakreeh)
bencevans for the colour fading library (https://www.npmjs.com/~bencevans)
