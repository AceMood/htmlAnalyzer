/**
 * @file 负责分析报告的打印
 * @author AceMood
 */

'use strict';

const node_fs   = require('fs');
const node_zlib = require('zlib');
const node_cp   = require('child_process');
const Reporter  = require('./Reporter').Reporter;

class JSONReporter extends Reporter {

  generate(ret) {
    this.data = ret;
    let json = {
      jsTotalByteSize: 0,
      cssTotalByteSize: 0,
      scripts: [],
      styles: [],
      images: []
    };

    ret.scripts.forEach(content => {
      let buf = node_zlib.gzipSync(content);
      let byteSize = Buffer.byteLength(content, 'utf8');
      json.scripts.push({
        byteSize: byteSize,
        gzip: buf.length,
        content: content.substr(0, this.contentMaxLength)
      });
      json.jsTotalByteSize += byteSize;
    });

    ret.styles.forEach(content => {
      let buf = node_zlib.gzipSync(content);
      let byteSize = Buffer.byteLength(content, 'utf8');
      json.styles.push({
        byteSize: byteSize,
        gzip: buf.length,
        content: content.substr(0, this.contentMaxLength)
      });
      json.cssTotalByteSize += byteSize;
    });

    json.jsTotalByteSize = (json.jsTotalByteSize / 1024).toFixed(3) + 'kb';
    json.cssTotalByteSize = (json.cssTotalByteSize / 1024).toFixed(3) + 'kb';

    this.postProcess(json);

    node_fs.writeFile(this.path, JSON.stringify(json, null, 4), err => {
      if (err) {
        throw err;
      }

      console.log('done!');
    });
  }

  postProcess() {
    let allStr = '';
    this.data.scripts.forEach(js => {
      allStr += js;
    });

    console.log('write source code to page.js......');
    node_fs.writeFileSync('./js/page.js', allStr);

    let buf = node_zlib.gzipSync(allStr);
    let size = Buffer.byteLength(allStr);
    console.log(`all js content:\nafter normal compress is ${size} bytes\nafter gzip approximately ${buf.length} bytes\n`);

    console.log('compiling source code......');
    node_cp.execSync('sh ' + process.cwd() + '/tools/build.sh');

    console.log('calculate file size......');
    let buf2 = node_zlib.gzipSync(node_fs.readFileSync('./dist/page-compiled.js'));
    console.log(`all js content:\n
                after gcc compress is ${size} bytes;\n
                after gzip approximately ${buf2.length} bytes.\n`);
  }

}

exports.JSONReporter = JSONReporter;