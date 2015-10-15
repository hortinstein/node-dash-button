var pcap = require('pcap');
var stream = require('stream');

var register = function(ote) {
    var pcap_session = pcap.createSession();
    var readStream = new stream.Readable({
        objectMode: true
    });
    pcap_session.on('packet', function(raw_packet) {
        console.log('packet detected!')
        readStream.emit('detected', raw_packet);
    });
    return readStream;
};

module.exports = register;