process.env.NODE_ENV = 'test';
require('buffer')
///http://bulkan-evcimen.com/using_mockery_to_mock_modules_nodejs.html
//this should be an effective way to mock functions
var should = require('should');
var assert = require('assert');
var mockery = require('mockery'); // https://github.com/nathanmacinnes/injectr
var events = require('events');
var hex = '8f:3f:20:33:54:44';
var hex2 = '8f:3f:20:33:54:43';
var hex3 = '8f:3f:20:33:54:42';
var int_array = [];
//these are packets to pass into the mock pcap.decode 
var packet1 = {
    'packet_payload_ethertype': 2054,
    'packet_payload_payload_sender_ha_addr': hex,
};
var packet2 = {
    'packet_payload_ethertype': 2054,
    'packet_payload_payload_sender_ha_addr': hex2,
};
var packet3 = {
    'packet_payload_ethertype': 2054,
    'packet_payload_payload_sender_ha_addr': hex3,
};
fake_session = new events.EventEmitter();
var mock_pcap = {
    createSession: function() {
        //console.log("sending reference to fake event emitter")
        return fake_session;
    },
    test: function() {
        return 'inject works!';
    },
    decode: {
        packet: function(packet) {
            mock_packet = {
                "payload": {
                    "ethertype": packet.packet_payload_ethertype,
                    "payload": {
                        "sender_ha": {
                            "addr": dash_button.hex_to_int_array(packet.packet_payload_payload_sender_ha_addr)
                        }
                    }
                }
            }
            return mock_packet;
        }
    }
};
startTests = function() {
    before(function() {
        mockery.enable({
            warnOnReplace: false,
            warnOnUnregistered: false,
            useCleanCache: true
        });
        mockery.registerMock('pcap', mock_pcap); // replace the module `request` with a stub object
        pcap = require('pcap');
        dash_button = require('../index.js');
    });
    it('should correctly mock pcap functions for testing', function(done) {
        pcap.test().should.equal('inject works!');
        done();
    });
    it('should correctly convert string hex to decimal array', function(done) {
        int_array = dash_button.hex_to_int_array(hex)
        done();
    });
    it('should correctly convert a decimal array to string hex', function(done) {
        dash_button.int_array_to_hex(int_array).should.equal(hex);
        done();
    });
    it('should recognize an arp request', function(done) {
        dash_button.register(hex).on('detected', function() {
            done();
        });
        fake_session.emit('packet', packet1)
    });
    it('should not fire with more than 2 arp requests in 2 seconds', function(done) {
        dash_button.register(hex2).on('detected', function() {
            setTimeout(function() {
                done()
            }, 50);
            //console.log("should only see this once")        
        });
        for(count = 0; count < 10; count++) {
            //console.log("firing packet!")
            fake_session.emit('packet', packet2)
        }
    });
    it('should recognize first of two arp requests', function(done) {
        two_tester = dash_button.register([hex2, hex3]);
        two_tester.on('detected', function(mac_address) {
            if(mac_address === hex2) done();
        });
        fake_session.emit('packet', packet2)
    });
    it('should recognize second of two arp requests', function(done) {
        two_tester.on('detected', function(mac_address) {
            if(mac_address === hex3) done();
        });
        fake_session.emit('packet', packet3)
    });
}
startTests();