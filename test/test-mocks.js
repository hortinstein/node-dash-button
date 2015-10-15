process.env.NODE_ENV = 'test';

require('buffer')
///http://bulkan-evcimen.com/using_mockery_to_mock_modules_nodejs.html
//this should be an effective way to mock functions

var should = require('should');
var assert = require('assert');
var mockery = require('mockery'); // https://github.com/nathanmacinnes/injectr
var events = require('events');
var arp = require('./arp_utils.js')

var hex = '8f:3f:20:33:54:44';
var hex2 = '8f:3f:20:33:54:43';
var hex3 = '8f:3f:20:33:54:42';
var int_array = [];
var packet1 = arp({
    'op': 'request',
    'src_ip': '10.105.50.100',
    'dst_ip': '10.105.50.1',
    'src_mac': hex,
    'dst_mac': 'ff:ff:ff:ff:ff:ff'
    });
var packet2 = arp({
    'op': 'request',
    'src_ip': '10.105.50.100',
    'dst_ip': '10.105.50.1',
    'src_mac': hex2,
    'dst_mac': 'ff:ff:ff:ff:ff:ff'
    });
var packet3 = arp({
    'op': 'request',
    'src_ip': '10.105.50.100',
    'dst_ip': '10.105.50.1',
    'src_mac': hex3,
    'dst_mac': 'ff:ff:ff:ff:ff:ff'
    });
fake_session = new events.EventEmitter();
var mock_pcap = {
    createSession: function () {
        console.log("sending refernce to fake event emitter")
        
        return fake_session;
    },
    test: function() {
        return 'inject works!';
    },
    decode: require("../node_modules/pcap/decode").decode
};

startTests = function() {
    before(function() {
        mockery.enable({
            warnOnReplace: false,
            warnOnUnregistered: false,
            useCleanCache: true
        });
        mockery.registerMock('pcap', mock_pcap);// replace the module `request` with a stub object
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
        dash_button.register(hex).on('detected', function(){
            done();
        });        
        fake_session.emit('packet',packet1)
    });
    it('should not fire with more than 2 arp requests in 2 seconds', function(done) {
        dash_button.register(hex).on('detected', function(){
            done();
        });        
    });
//     two_tester = dash_button.register([hex2,hex3]);
    
//     it('should recognize first of two arp requests', function(done) {
//         two_tester.on('detected', function(mac_address){
//             if (mac_address === hex2) done();
//         }); 
//     });
//     it('should recognize second of two arp requests', function(done) {
//         two_tester.on('detected', function(mac_address){
//             if (mac_address === hex3) done();
//         }); 
//     });
}




startTests();