# OpenRGB HTTP Server

## What is this?
This is a simple NodeJS HTTP to allow control of RGB lighting connected to OpenRGB (https://gitlab.com/CalcProgrammer1/OpenRGB). This is useful for simple browser control (through the URL or through AJAX requests) or for Smart Home integrations (using HomeBridge and the homebridge-better-http-rgb plugin).

## Installation

- Clone the repo
- `npm install` within cloned repo
- `node server.js` or `node test.js` to test your connection
- I am currently working on my own redo of the forever deprecated Node SDK of OpenRGB. So you will want to uninstall my directly pathed version and use `openrgb-sdk` instead which is what my new one is a fork of but unfinished...

## Usage

Take a look into the `server.js` file - you'll see some endpoints you can hit - feel free to add more.

A `test.js` file is also included and I use that to make sure my connection to my OpenRGB installation works.

I also setup this NodeJS server as a Windows Service (using NSSM), meaning when the PC boots, the server is automatically started in the background without a CMD window. I can help with this, just let me know.

## Smart Home (HomeKit)
To do this, I used HomeBridge and a plugin for it called homebridge-better-http-rgb (https://www.npmjs.com/package/homebridge-better-http-rgb). It allows you to configure a HomeKit accessory that uses HTTP calls to turn RGB lighting on, off and change thier colour. If you need any help with this the before-mentioned link should help.

There is a much much better implementation here (https://github.com/DallasHoff/homebridge-openrgb) that would be a better choice if this is all you want this for.

## Notes
Many thanks to the following:
- Mola19 for the NodeJS OpenRGB-SDK (https://github.com/Mola19/openrgb-sdk)
