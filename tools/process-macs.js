/* To use this script execute via node with the first param of the csv file and
   the second of where to put the data. */

(function ife_main(code) {
    process.exitCode = code;
})((function _main_scope(fs, csvs) {
      const EXIT_SUCCESS = 0;
      const EXIT_ERROR_HELP = 1;
      const EXIT_ERROR_IO_INPUT_MISSING = 2;

      const EXIT_ERROR_OTHER = -1;

      function __encoding_hack(x) {
        // https://github.com/lbdremy/node-csv-stream/issues/13
        x._encoding = 'utf8';
        return x;
      }

      function __help() {
        console.log(`${process.argv[1]} <input file> <output file>`);
        return EXIT_ERROR_HELP;
      }

      function __process(inputFile, outputFile) {
        if (!fs.existsSync(inputFile)) {
          return EXIT_ERROR_IO_INPUT_MISSING;
        }

        let write = null;
        let rowCnt = 0;

        function ___open_write() {
          const output = fs.createWriteStream(outputFile, { flags : 'w' });

          output.write(`// List of registered Mac addresses with IEEE as of ${(new Date()).toUTCString()}
// source : https://regauth.standards.ieee.org/standards-ra-web/pub/view.html#registries (MA-L)

var x = {`);

          return output;
        }

        function ___encode(value) {
          return JSON.stringify(value.replace(/^"/, ''));
        }

        function ___close_write() {
          write.end('};\nexports.manufacturer_directory = x;');
        }

        function ___write_pair(name, value) {
          if (rowCnt > 0) {
            write.write(",\n  ");
          }



          write.write(___encode(name)+ ': '+ ___encode(value));
          rowCnt++;
        }

        fs.createReadStream(inputFile)
          .pipe(__encoding_hack(csvs.createStream()))
          .on('data',function(data){
            if (write === null) {
              write = ___open_write();
            }

            ___write_pair(data['Assignment'], data['Organization Name']);
          })
          .on('end',function(){
            ___close_write(write);
          });
      }

      if (process.argv.length !== 4) {
        return __help();
      }

      try {
        __process(process.argv[2], process.argv[3]);
      } catch (ex) {
        console.error("***".bold + " Unknown Error".red);
        console.error(ex);
        return EXIT_ERROR_OTHER;
      }
  })(
    // named/instanced imports
    require('fs'),
    require('csv-stream'),
    // global imports
    require('colors')
  )
);