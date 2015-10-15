var ip = require("ip");

function mac_to_arr(macAddr){
  var mac_arr = macAddr.split(':');
  var x;
  for(x in mac_arr){
    mac_arr[x] = '0x'+mac_arr[x];
  }
return mac_arr;
}


function ip_to_arr(ipAddr){
  var ip_arr = ipAddr.split('.');
  var x;
  for(x in ip_arr){
    ip_arr[x] = ip_arr[x];
  }
return ip_arr;
}

var arpMaker = function(pkt_o){
    macAddr = pkt_o.src_mac
    var my_ip = ip.address();
    var pkt = {};
    pkt.dst = mac_to_arr("ff:ff:ff:ff:ff:ff");
    pkt.src = mac_to_arr(macAddr);
    pkt.ether_type = [0x08, 0x06];

    pkt.hw_type = [0x00, 0x01];
    if(pkt_o.hasOwnProperty('hw_type'))
      pkt.hw_type = pkt_o.hw_type;
    pkt.proto_type = [0x08, 0x00];
    if(pkt_o.hasOwnProperty('proto_type'))
      pkt.proto_type = pkt_o.proto_type;
    pkt.hw_len = [0x06];
    if(pkt_o.hasOwnProperty('hw_len'))
      pkt.hw_len = pkt_o.hw_len;
    pkt.proto_len = [0x04];
    if(pkt_o.hasOwnProperty('proto_len'))
      pkt.proto_len = pkt_o.proto_len;

    // REQUEST-0x01, REPLY-0x02
    pkt.op = [0x00, 0x01];
    if(pkt_o.hasOwnProperty('op')){
      if(pkt_o.op.toLowerCase() === 'request')
        pkt.op = [0x00, 0x01];
      if(pkt_o.op.toLowerCase() === 'reply')
        pkt.op = [0x00, 0x02];
    }

    pkt.src_mac = mac_to_arr(macAddr);
    if(pkt_o.hasOwnProperty('src_mac')) pkt.src_mac = mac_to_arr(pkt_o.src_mac);
    pkt.src_ip = ip_to_arr(my_ip);
    if(pkt_o.hasOwnProperty('src_ip'))
      pkt.src_ip = ip_to_arr(pkt_o.src_ip);
    pkt.dst_mac = mac_to_arr('00:00:00:00:00:00');
    if(pkt_o.hasOwnProperty('dst_mac'))
      pkt.dst_mac = mac_to_arr(pkt_o.dst_mac);
    pkt.dst_ip = ip_to_arr("192.168.100.2");
    if(pkt_o.hasOwnProperty('dst_ip'))
      pkt.dst_ip = ip_to_arr(pkt_o.dst_ip);

    var x;
    var pkt_arr = [];
    for(x in pkt){
      pkt_arr = pkt_arr.concat(pkt[x]);
    }

    var arpRequest = new Buffer(pkt_arr);
    return arpRequest
};

module.exports = arpMaker;