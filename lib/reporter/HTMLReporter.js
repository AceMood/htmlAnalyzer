/**
 * @file 负责分析报告的打印
 * @author AceMood
 */

'use strict';

const Reporter = require('./Reoporter');

class HTMLReporter extends Reporter {

  generate(ret) {
    let json = {
      scripts: [],
      styles: [],
      images: []
    };
    ret.scripts.forEach((content, index) => {
      let buf = node_zlib.gzipSync(content);
      let size = content.length * 2;
      json.scripts.push({
        size: size,
        gzip: buf.length,
        ratio: (buf.length / size ).toFixed(3),
        content: content.substr(0, 100)
      });
    });

    ret.styles.forEach((content, index) => {
      let buf = node_zlib.gzipSync(content);
      let size = content.length * 2;
      json.styles.push({
        size: size,
        gzip: buf.length,
        ratio: (buf.length / size ).toFixed(3),
        content: content.substr(0, 100)
      });
    });

    node_fs.writeFile(this.path, JSON.stringify(json, null, 4), err => {
      if (err) {

      }

      this.postProcess();
    });
  }

  postProcess() {
    console.info('post process!');
  }

}


exports.HTMLReporter = HTMLReporter;