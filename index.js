var pcap = require('pcap'),
    pcap_session = pcap.createSession();

var _ = require("underscore")
var dash_button = [];
module.exports = dash_button;

dash_button.hex_to_int_array = function(hex){
    var hex_array = hex.split(":");
    var int_array = [];
    for (var i in hex_array) {
        int_array.push( parseInt(hex_array[i], 16));
    }
    return (int_array); 
}

dash_macs = {};

dash_button.register = function(mac_address, callback) {
    dash_button[mac_address] = callback;
};

pcap_session.on('packet', function(raw_packet) {
    var packet = pcap.decode.packet(raw_packet);
    if(packet.payload.ethertype === 2054) {
    	console.log("arp detected");
	        console.log(packet.payload.payload.sender_ha);
	        console.log(packet.payload.payload.target_ha);
    	for (var i in dash_macs){
	    	if(_.isEqual(packet.payload.payload.sender_ha, dash_button.hex_to_int_array(dash_macs))){
	        	console.log("arp detected");
	            console.log(packet.payload.payload.sender_ha);
	            console.log(packet.payload.payload.target_ha);
	        	dash_macs[i](null,mac_address);
	        }	
    	}
         
    }
});