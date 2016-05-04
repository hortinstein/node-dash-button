"use strict";

var pcap = require('pcap');
var stream = require('stream');
var _ = require('underscore');
var hex_to_int_array = require('./helpers.js').hex_to_int_array;
var int_array_to_hex = require('./helpers.js').int_array_to_hex;


var create_session = function (arp_interface) {
    try {
        var session = pcap.createSession(arp_interface);
    } catch (err) {
        console.error(err);
        console.error("Failed to create pcap session: couldn't find devices to listen on.\n" + "Try running with elevated privileges via 'sudo'");
        throw new Error('Error: No devices to listen');
    }
    return session;
};

//Function to register the node button
var register = function(mac_addresses, arp_interface, timeout) {
    if (timeout === undefined || timeout === null) {
     timeout = 5000;
    }
    if (Array.isArray(mac_addresses)){
        //console.log("array detected")
    } else {
        //console.log("single element detected")
        mac_addresses = [mac_addresses];//cast to array
    }
    var pcap_session = create_session(arp_interface);
    var readStream = new stream.Readable({
        objectMode: true
    });
    var just_emitted = {};
    mac_addresses.forEach(function(mac_address){
        just_emitted[mac_address] = false;
    });
    pcap_session.on('packet', function(raw_packet) {
        var packet;

        /**
         * Perform a try/catch on packet decoding until pcap
         * offers a non-throwing mechanism to listen for errors
         * (We're just ignoring these errors because TCP packets with an
         *  unknown offset should have no impact on this application) 
         *
         * See https://github.com/mranney/node_pcap/issues/153
         */
        try {
            packet = pcap.decode.packet(raw_packet); //decodes the packet
        } catch (err) {
            //console.error(err);
            return;
        }

        if(packet.payload.ethertype === 2054) { //ensures it is an arp packet
            //for element in the mac addresses array
            mac_addresses.forEach(function(mac_address){
                if(!just_emitted[mac_address] && 
                    _.isEqual(packet.payload.payload.sender_ha.addr, 
                             hex_to_int_array(mac_address))) {
                    readStream.emit('detected', mac_address);
                    just_emitted[mac_address] = true;
                    setTimeout(function () { just_emitted[mac_address] = false; }, timeout);
                }                
            });
        }
    });
    return readStream;
};

if (process.env.NODE_ENV === 'test') {
    
    
    module.exports = {  hex_to_int_array: hex_to_int_array, 
                        int_array_to_hex: int_array_to_hex,
                        create_session: create_session,
                        register: register
                    };
    
} else {
    module.exports = register;
}
