process.env.NODE_ENV = 'test';
require('buffer');
///http://bulkan-evcimen.com/using_mockery_to_mock_modules_nodejs.html
//this should be an effective way to mock functions
var should = require('should');
var mockery = require('mockery'); // https://github.com/nathanmacinnes/injectr

var pcap_mock = require('./lib/pcap');
var hexes = require('./lib/hex');
var packets = require('./lib/packets');

startTests = function() {
    var pcap = ""; //for linting purps
    var dash_button = ""; //for linting purps
    beforeEach(function() {
        mockery.enable({
            warnOnReplace: false,
            warnOnUnregistered: false,
            useCleanCache: true
        });
        pcap = new pcap_mock();
        mockery.registerMock('pcap', pcap); // replace the module `pcap` with a stub object
        dash_button = require('../index.js');
    });
    afterEach(function() {
        mockery.disable();
    });
    it('should correctly mock pcap functions for testing', function(done) {
        pcap.test().should.equal('inject works!');
        done();
    });
    it('should correctly convert string hex to decimal array', function(done) {
        var int_array = dash_button.hex_to_int_array(hexes.first);
        done();
    });
    it('should correctly convert a decimal array to string hex', function(done) {
        var int_array = dash_button.hex_to_int_array(hexes.first);
        dash_button.int_array_to_hex(int_array).should.equal(hexes.first);
        done();
    });
    it('should recognize an arp request', function(done) {
        dash_button.register(hexes.first).on('detected', function() {
            done();
        });
        pcap.getSession().emit('packet', packets.first);
    });
    it('should not fire with more than 2 arp requests in 2 seconds', function(done) {
        dash_button.register(hexes.second).on('detected', function() {
            setTimeout(function() {
                done();
            }, 50);
            //console.log("should only see this once")        
        });
        for(count = 0; count < 10; count++) {
            //console.log("firing packet!");
            pcap.getSession().emit('packet', packets.second);
        }
    });
    it('should recognize first of two arp requests', function(done) {
        var two_tester = dash_button.register([hexes.second, hexes.third]);
        two_tester.on('detected', function(mac_address) {
            if(mac_address === hexes.second) done();
        });
        pcap.getSession().emit('packet', packets.second);
    });
    it('should recognize second of two arp requests', function(done) {
        var two_tester = dash_button.register([hexes.second, hexes.third]);
        two_tester.on('detected', function(mac_address) {
            if(mac_address === hexes.third) done();
        });
        pcap.getSession().emit('packet', packets.third);
    });
    it('should throw an error if no interfaces are available', function(done) {
        pcap.enableBadMode();
        var dash_button_bad = require('../index.js');
        try {
            dash_button_bad.register(hexes.first).on('detected', function() {
                console.log('Should never get here');
                done();
            });
            pcap.getSession().emit('packet', packets.first);
        } catch(err) {
            done();
        }
    });
    it('should not throw an error when pcap encounters a bad packet', function(done) {
        try {
            dash_button.register(hexes.first);
            pcap.getSession().emit('packet', packets.bad);
        } catch(err) {
            throw new Error("Did not catch the error");
        }
        done();
    });
    it('should adjust the timeout', function(done) {
        try {
            dash_button.register(hexes.first, null, 5000);
            pcap.getSession().emit('packet', packets.bad);
        } catch(err) {
            throw new Error("Did not catch the error");
        }
        done();
    });
};
startTests();
