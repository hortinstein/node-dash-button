var hexes = require('./hex');
module.exports = {
    "first": {
        'packet_payload_ethertype': 2054,
        'packet_payload_payload_sender_ha_addr': hexes.first,
    },
    "second": {
        'packet_payload_ethertype': 2054,
        'packet_payload_payload_sender_ha_addr': hexes.second,
    },
    "third": {
        'packet_payload_ethertype': 2054,
        'packet_payload_payload_sender_ha_addr': hexes.third,
    },
    "bad": {
        'packet_payload_ethertype': 666,
        'packet_payload_payload_sender_ha_addr': hexes.first,
    }
};