var events = require('events');
var hex_to_int_array = require('../../helpers.js').hex_to_int_array;
var packets = require('./packets');

function pcap(){
    this.session = false;
    this.badMode = false;
}
pcap.prototype.createSession = function() {
    if (this.badMode === true) {
        throw new Error("Error: pcap_findalldevs didn't find any devs [mocked]");        
    }
    //console.log("sending reference to fake event emitter")
    this.session = new events.EventEmitter();
    return this.session;
};
pcap.prototype.getSession = function() {
    return this.session;
};
pcap.prototype.test = function() {
    return 'inject works!';
};
pcap.prototype.decode = function() {
};
pcap.prototype.decode.packet = function(packet) {
    if (packet.packet_payload_ethertype === packets.bad.packet_payload_ethertype) {
        throw new Error('Catch me!');
    }
    var mock_packet = {
        "payload": {
            "ethertype": packet.packet_payload_ethertype,
            "payload": {
                "sender_ha": {
                    "addr": hex_to_int_array(packet.packet_payload_payload_sender_ha_addr)
                }
            }
        }
    };
    return mock_packet;
};
pcap.prototype.enableBadMode = function() {
    this.badMode = true;
};
pcap.prototype.disableBadMode = function() {
    this.badMode = false;
};
module.exports = pcap;
