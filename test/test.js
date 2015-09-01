//var arp = require('arpjs');
var should = require('should');
var assert = require('assert');
var dash_button = require('../index.js');

// var sendarp = function(){
//   arp.send({
//   'op': 'request',
//   'src_ip': '10.105.50.100',
//   'dst_ip': '10.105.50.1',
//   'src_mac': '8f:3f:20:33:54:44',
//   'dst_mac': 'ff:ff:ff:ff:ff:ff'
//   });  
// };

startTests = function() {
    before(function(done) {
//         setInterval(sendarp, 1000); 
        done();
    });
//     it('should recognize an arp request', function(done) {
       
//         dash_button.register("8f:3f:20:33:54:44", function(e,r){
//            console.log(r); 
//         });
//         done();
//     });
    it('should correctly convert string hex to decimal array', function(done) {
        console.log(dash_button.hex_to_int_array('8f:3f:20:33:54:44'));
        
       done(); 
    });

}
startTests();

