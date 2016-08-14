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
    });
  }

  postProcess(json) {
    // 拼接所有js代码
    let allStr = '';
    this.data.scripts.forEach(js => {
      allStr += js;
    });

    node_fs.writeFileSync('./js/page.js', allStr);

    // 打印原始代码大小和gzip后的大小
    let buf = node_zlib.gzipSync(allStr);
    let size = Buffer.byteLength(allStr);
    console.log(`all js content:
                 after normal compress is ${size} bytes
                 after gzip approximately ${buf.length} bytes\n`);

    json.afterGzip = (buf.length / 1024).toFixed(3) + 'kb';

    // gcc ad 编译
    node_cp.execSync('sh ' + process.cwd() + '/tools/build.sh');

    // 打印gcc压缩后代码大小和gzip后的大小
    allStr = node_fs.readFileSync('./dist/page-compiled.js');
    let size2 = Buffer.byteLength(allStr);
    let buf2 = node_zlib.gzipSync(allStr);
    console.log(`all js content:
                after gcc compress is ${size2} bytes;
                after gzip approximately ${buf2.length} bytes.\n`);
  }

}

exports.JSONReporter = JSONReporter;