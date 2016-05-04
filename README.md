![Blank Dash](http://i.imgur.com/PP0CJ3s.png?1)
# node-dash-button
[![Travis-CI Build Status](https://travis-ci.org/hortinstein/node-dash-button.svg)](https://travis-ci.org/hortinstein/node-dash-button)  [![Coverage Status](https://coveralls.io/repos/hortinstein/node-dash-button/badge.svg?branch=master&service=github)](https://coveralls.io/github/hortinstein/node-dash-button?branch=master)  [![gitter](https://img.shields.io/badge/gitter-join%20chat-green.svg?style=flat)](https://gitter.im/hortinstein/node-dash-button)

Place it. *Hack it.* Press it. ~~Get it.~~

This module was inspired by [this fantastic article by Edward Bensen](https://medium.com/@edwardbenson/how-i-hacked-amazon-s-5-wifi-button-to-track-baby-data-794214b0bdd8).

It is a simple library that will allow you to utilize a dash button to emit an event.  I am using the same strategy of watching for dash generated ARP requests as the article above.

### Contents
-----------------
- [Installation Instructions](#installation-instructions)
- [First Time Dash Setup](#first-time-dash-setup)
- [Find a Dash](#find-a-dash)
- [Example Usage](#example-usage)
- [Example Projects](#example-projects)
- [Running Tests](#running-tests)
- [To do](#to-do)
- [Contributions](#contributions)
- [License](#license)
 
#### Installation Instructions
The following should work for ubuntu, the main thing for any os is getting the libpcap dependancy.
``` sh
# dependancy on libpcap for reading packets
$ sudo apt-get install libpcap-dev
$ npm install node-dash-button 
```
#### First Time Dash Setup 

Follow Amazon's instructions to configure your button to send messages when you push them but not actually order anything. When you get a Dash button, Amazon gives you a list of setup instructions to get going. Just follow this list of instructions, but don’t complete the final step (#3 I think) **Do not select a product, just exit the app**.

#### Find a Dash
To find a dash on your network, run the following from the node-dash-button directory in node_modules:
``` sh
# you may need to use sudo due to libpcap running in permiscuous mode
$ cd node_modules/node-dash-button
$ node bin/findbutton
```

It will watch for new arp requests on your network.  There may be several arp requests, so press it a few times to make sure. Copy the hardware address as shown below

![hw address](http://i.imgur.com/BngokPC.png)

Note: If your computer has multiple active network interfaces, `findbutton` will use the first one listed. If you need to overwrite this setting, pass your preferred interface
as the first argument, such as `node bin/findbutton eth6`.

#### Example Usage:

**For a single dash**
``` js
//warning this may trigger multiple times for one press
//...usually triggers twice based on testing for each press
var dash_button = require('node-dash-button');
var dash = dash_button("8f:3f:20:33:54:44"); //address from step above
dash.on("detected", function (){
	console.log("omg found");
});
```

**For multiple dashes**:
```js
var dash_button = require('node-dash-button');
var dash = dash_button(["8f:3f:20:33:54:44","2e:3f:20:33:54:22"]); //address from step above
dash.on("detected", function (dash_id){
    if (dash_id === "8f:3f:20:33:54:44"){
        console.log("omg found");
    } else if (dash_id === "2e:3f:20:33:54:22"){
        console.log("found the other!");
    }
});
```

**Binding To Specific Interface**:
By default, the dash button is bound to the [first device with an address](https://github.com/mranney/node_pcap/blob/master/pcap_binding.cc#L89). To bind the button to a specific interface, such as `eth6`, pass the name of the interface as the 2nd argument to the invocation method.
``` js
var dash_button = require('node-dash-button');
var dash = dash_button("8f:3f:20:33:54:44", "eth6"); //address from step above
dash.on("detected", function (){
  console.log("omg found - on eth6!");
});
```

**Adjusting the Timeout (if multiple presses are detected)**:
By default the timeout between presses is 5 seconds.  Depending on the network this may not be enough.  Use the following syntax to specify a new timeout in miliseconds:
``` js
var dash_button = require('node-dash-button');
var dash = dash_button("8f:3f:20:33:54:44", null, 60000); //address from step above
dash.on("detected", function (){
  console.log("omg found - on eth6!");
});
```


#### Running Tests:
Due to the use of pcap permiscuous monitoring this was difficult to test in CI environments, so I ended up making two testing suites.  One uses the live pcap library and does actual packet capturing/arp injections.  The other uses [mockery](https://github.com/mfncooper/mockery) to fake pcap packets.  I will have an upcoming blog post on how I did this, because it was interesting.

To run a live test of the code (requiring root due to permiscuous access please run).
```
sudo npm run-script livetest
```
This will actually inject ARP packets to the network to run the tests to ensure detection.

I wanted to use various CI tools that would not allow the pcap functions to work, so I ended up mocking their functions.  To run the mock tests use:
```
npm test
```


#### Example Projects:
I collected a few examples I found on github of how people are using this module, some projects are more mature than others
- [PizzaDash](https://github.com/bhberson/pizzadash) uses a node dash to order Domino's pizza. [The Verge](http://www.theverge.com/2015/9/28/9407669/amazon-dash-button-hack-pizza), [Gizmodo](http://gizmodo.com/an-american-hero-hacked-an-amazon-dash-button-to-order-1733347471) and [Grubstreet](http://www.grubstreet.com/2015/09/amazon-dash-button-dominos-hack.html#)  did short writeups on the PizzaDash project].  
- [dashgong](https://github.com/danboy/dashgong) uses the node dash to send a message to slack
- [dash-listener](https://github.com/dkordik/dash-listener) performs various home automation tasks like adjusting lights and interacting with a music player
- [dasher](https://github.com/maddox/dasher) lets you map a dash button press to an HTTP request.
- [Nest-Dash](https://github.com/djrausch/Nest-Dash) toggles the Nest setting from away to home via Amazon Dash Button
- [dash-hipchat-doorbell](https://github.com/Sfeinste/dash-hipchat-doorbell) quick and dirty node app that intercepts traffic from an amazon dash button and creates a hipchat notification (think doorbell)
- [netflixandchill](https://github.com/sidho/netflixandchill) button to netflix and chill, dims the lights (no interface with netflix yet)
- [dash-rickroll](https://github.com/girliemac/dash-rickroll/blob/8f0396c7fec871427fe016a2dd5787f07b1402cc/README.md) title explains it all 

#### To do
- refactor

#### Contributions
Accepting pull requests!

#### License

The MIT License (MIT)

Copyright (c) 2016 Alex Hortin

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
