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


var pcap = require('pcap');
var stream = require('stream');
var _ = require('underscore');

var create_session = function () {
    try {
        var session = pcap.createSession();
    } catch (err) {
        console.error(err);
        if (err == "Error: pcap_findalldevs didn't find any devs") {
            console.log("Failed to create pcap session: couldn't find devices to listen on.\n" +
                "Try running with elevated privileges via 'sudo'");
        }
        process.exit(1);
    }
    return session;
}

//Function to register the node button
var register = function(mac_addresses) {
    if (Array.isArray(mac_addresses)){
        //console.log("array detected")
    } else {
        //console.log("single element detected")
        mac_addresses = [mac_addresses]//cast to array
    }
    var pcap_session = create_session();
    var readStream = new stream.Readable({
        objectMode: true
    });
    var just_emitted = {};
    mac_addresses.forEach(function(mac_address){
        just_emitted[mac_address] = false;
    });
    pcap_session.on('packet', function(raw_packet) {
        //console.log(raw_packet)
        var packet = pcap.decode.packet(raw_packet); //decodes the packet
        if(packet.payload.ethertype === 2054) { //ensures it is an arp packet
            //for element in the mac addresses array
            mac_addresses.forEach(function(mac_address){
                if(!just_emitted[mac_address] && 
                    _.isEqual(packet.payload.payload.sender_ha.addr, 
                             hex_to_int_array(mac_address))) {
                    readStream.emit('detected', mac_address);
                    just_emitted[mac_address] = true;
                    setTimeout(function () { just_emitted = false; }, 3000);
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
