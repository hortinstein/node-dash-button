var should = require('should');
var assert = require('assert');
var mockery = require('mockery')
var events = require('events');

fake_session = new events.EventEmitter();
var mock_pcap = {
    createSession: function () {
        console.log("sending refernce to fake event emitter")
        
        return fake_session;
    },
    test: function(){
        return 'inject works!';
    }
};
startTests = function() {
    before(function() {
        mockery.enable({
            warnOnReplace: false,
            warnOnUnregistered: false,
            useCleanCache: true
        });
        mockery.registerMock('pcap', mock_pcap);
        pcap = require('pcap');
        pcap_emitter = require('./so_module.js')("test");//replace the module `request` with a stub object        
    });
    it('should correctly mock pcap functions for testing', function(done) {
        pcap.test().should.equal('inject works!');
        done(); 
    });
  
    it('should recognize an arp request', function(done) {
        pcap_emitter.on('detected', function(test){
            test.should.equal('test')
            done();
        });
        fake_session.emit('packet',"test")
        
    });
}
startTests();