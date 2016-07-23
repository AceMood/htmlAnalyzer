/**
 * @file 负责分析报告的打印
 * @author AceMood
 */

'use strict';

const node_path = require('path');
const node_fs   = require('fs');
const node_zlib = require('zlib');
const Reporter  = require('./Reporter').Reporter;

class JSONReporter extends Reporter {

  generate(ret) {
    this.data = ret;
    let json = {
      jsSize: 0,
      cssSize: 0,
      scripts: [],
      styles: [],
      images: []
    };

    ret.scripts.forEach(content => {
      let buf = node_zlib.gzipSync(content);
      let size = (new Buffer(content)).length;
      json.scripts.push({
        size: size,
        gzip: buf.length,
        ratio: (buf.length * 100 / size ).toFixed(3) + '%',
        content: content.substr(0, 100)
      });
      json.jsSize += size;
    });

    ret.styles.forEach(content => {
      let buf = node_zlib.gzipSync(content);
      let size = (new Buffer(content)).length;
      json.styles.push({
        size: size,
        gzip: buf.length,
        ratio: (buf.length * 100 / size ).toFixed(3) + '%',
        content: content.substr(0, 100)
      });
      json.cssSize += size;
    });

    json.jsSize = (json.jsSize / 1024).toFixed(3) + 'kb';
    json.cssSize = (json.cssSize / 1024).toFixed(3) + 'kb';

    this.postProcess(json);

    node_fs.writeFile(this.path, JSON.stringify(json, null, 4), err => {
      if (err) {

      }


    });
  }

  postProcess(data) {
    console.info('post process!');
    let allStr = '';
    this.data.scripts.forEach(js => {
      allStr += js;
    });

    node_fs.writeFile('../js/page.js', allStr, err => {
      if (err) {

      }
      let buf = node_zlib.gzipSync(allStr);
      console.log(`all js content after gzip approximately ${buf.length} bytes.`);

      let buf2 = node_zlib.gzipSync(node_fs.readFileSync('../dist/page-compiled.js'));
      console.log(`all js content use xx after gzip approximately ${buf2.length} bytes.`);

    });
  }

}

exports.JSONReporter = JSONReporter;