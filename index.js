var arp = require('arpjs');

var sendarp = function(){
  arp.send({
  'op': 'request',
  'src_ip': '10.105.50.100',
  'dst_ip': '10.105.50.1',
  'src_mac': '8f:3f:20:33:54:44',
  'dst_mac': 'ff:ff:ff:ff:ff:ff'
  });  
};

setInterval(sendarp, 1000); 
var pcap = require('pcap'),
    pcap_session = pcap.createSession();

pcap_session.on('packet', function (raw_packet) {
    var packet = pcap.decode.packet(raw_packet);
    if (packet.payload.ethertype === 2054){
      console.log("arp detected");
      console.log(packet.payload.payload.sender_ha)
      console.log(packet.payload.payload.target_ha)
    }
    arp.table(function(err, table){
      console.log(table);
    });
});

// var dash_button = {};
// modules.exports = dash_button;

// var registered_dash_button = {};

// dash_button.register = function(mac_address, callback){
    
// }

