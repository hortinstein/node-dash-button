var pcap = require('pcap'),
    pcap_session = pcap.createSession();

var _ = require("underscore");

// converts a string: "8f:3f:20:33:54:44"
// to a numeric array: [ 143, 63, 32, 51, 84, 68 ]
// for comparison
var hex_to_int_array = function(hex){
    var hex_array = hex.split(":");
    var int_array = [];
    for (var i in hex_array) {
        int_array.push( parseInt(hex_array[i], 16));
    }
    //console.log(hex,int_array)
    return int_array; 

}

// converts a numeric array: [ 143, 63, 32, 51, 84, 68 ]
// to a string: "8f:3f:20:33:54:44"=
// for comparison
var int_array_to_hex = function (int_array) {
    var hex = "";
    for (var i in int_array){
        var h = int_array[i].toString(16); // converting to hex
        if (h.length < 2) h = '0' + h; //adding a 0 for non 2 digit numbers
        if (i !== int_array.length) hex+=":"; //adding a : for all but the last group
        hex += h;
    }
    return hex.slice(1);//slice is to get rid of the leading :
}



var stream = require('stream');

//Function to register the node button
var register = function(mac_address) {
    var readStream = new stream.Readable({
        objectMode: true
    });
    pcap_session.on('packet', function(raw_packet) {
        var packet = pcap.decode.packet(raw_packet); //decodes the packet
        if(packet.payload.ethertype === 2054) { //ensures it is an arp packet
            if(_.isEqual(packet.payload.payload.sender_ha.addr, 
                         hex_to_int_array(mac_address))) {
                readStream.emit('detected');
            }	
        }
    });
    return readStream;
};

if (process.env.NODE_ENV === 'test') {
    module.exports = {  hex_to_int_array: hex_to_int_array, 
                        int_array_to_hex: int_array_to_hex,
                        register: register
                    };
} else {
    module.exports = register;
}
