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

setTimeout(sendarp, 10000); 
var pcap = require('pcap'),
    pcap_session = pcap.createSession('eth0', filter);

pcap_session.on('packet', function (raw_packet) {
    print(raw_packet);
});