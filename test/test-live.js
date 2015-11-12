process.env.NODE_ENV = 'test';

var should = require('should');
var dash_button = require('../index.js');
var pcap = require('pcap');
var hex = '8f:3f:20:33:54:44';
var hex2 = '8f:3f:20:33:54:43';
var hex3 = '8f:3f:20:33:54:42';
var int_array = [];

var arp = require('arpjs');
var sendarp = function(){
    arp.send({
    'op': 'request',
    'src_ip': '10.105.50.100',
    'dst_ip': '10.105.50.1',
    'src_mac': hex,
    'dst_mac': 'ff:ff:ff:ff:ff:ff'
    });  
};
var sendarp2 = function(){
    arp.send({
    'op': 'request',
    'src_ip': '10.105.50.100',
    'dst_ip': '10.105.50.1',
    'src_mac': hex2,
    'dst_mac': 'ff:ff:ff:ff:ff:ff'
    });  
};
var sendarp3 = function(){
    arp.send({
    'op': 'request',
    'src_ip': '10.105.50.100',
    'dst_ip': '10.105.50.1',
    'src_mac': hex3,
    'dst_mac': 'ff:ff:ff:ff:ff:ff'
    });  
};

startTests = function() {
    before(function(done) {
        done(); 
    });
    it('should correctly convert string hex to decimal array', function(done) {
        int_array = dash_button.hex_to_int_array(hex);
        done(); 
    });
    it('should correctly convert a decimal array to string hex', function(done) {
        dash_button.int_array_to_hex(int_array).should.equal(hex);
        done(); 
    });
    it('should recognize an arp request', function(done) {
        this.timeout(30000);//sometimes the detection takes a while
    	  setTimeout(sendarp, 2500); //giving pcap time to set up a listener   
        dash_button.register(hex).on('detected', function(){
            done();
        });        
    });
    it('should not fire with more than 2 arp requests in 2 seconds', function(done) {
        this.timeout(30000);//sometimes the detection takes a while
          setInterval(sendarp, 250); //giving pcap time to set up a listener   
        dash_button.register(hex).on('detected', function(){
            done();
        });        
    });
    two_tester = dash_button.register([hex2,hex3]);
    
    it('should recognize first of two arp requests', function(done) {
        this.timeout(30000);//sometimes the detection takes a while
        setInterval(sendarp2, 250); //giving pcap time to set up a listener          
        two_tester.on('detected', function(mac_address){
            if (mac_address === hex2) done();
        }); 
    });
    it('should recognize second of two arp requests', function(done) {
        this.timeout(30000);//sometimes the detection takes a while
        setInterval(sendarp3, 250); //giving pcap time to set up a listener          
        two_tester.on('detected', function(mac_address){
            if (mac_address === hex3) done();
        }); 
    });
};
startTests();

