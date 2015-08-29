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

setInterval(sendarp, 100); 
var pcap = require('pcap'),
    pcap_session = pcap.createSession('eth0');

pcap_session.on('packet', function (raw_packet) {
    console.log(raw_packet);
    //if the packet is an arp request
});

// var dash_button = {};
// modules.exports = dash_button;

// var registered_dash_button = {};

// dash_button.register = function(mac_address, callback){
    
// }

