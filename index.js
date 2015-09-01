var pcap = require('pcap'),
    pcap_session = pcap.createSession();

var _ = require("underscore")

var hex_to_int_array = function(hex){
    var hex_array = hex.split(":");
    var int_array = [];
    for (var i in hex_array) {
        int_array.push( parseInt(hex_array[i], 16));
    }
    return (int_array); 
}



var stream = require('stream')

var register = function(mac_address) {
    var readStream = new stream.Readable({
        objectMode: true
    });
    pcap_session.on('packet', function(raw_packet) {
        var packet = pcap.decode.packet(raw_packet); //decodes the packet
        if(packet.payload.ethertype === 2054) { //ensures it is an arp packet
            console.log(hex_to_int_array(mac_address));
            console.log(packet.payload.payload.sender_ha);
            if(_.isEqual(packet.payload.payload.sender_ha, dash_button.hex_to_int_array(mac_address))) {
                readStream.emit('detected');
            }	
        }
    });
    
    return readStream
};

if (process.env.NODE_ENV === 'test') {
  module.exports = { hex_to_int_array: hex_to_int_array, 
                     register: register
                   };
} else {
  module.exports = register;
}
