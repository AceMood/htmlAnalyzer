/**
 * @file 负责分析报告的打印
 * @author AceMood
 */

'use strict';

const node_path = require('path');
const node_fs   = require('fs');
const node_zlib = require('zlib');

class Reporter {

  constructor(conf) {
    this.format = conf.format || 'json';
    this.path = node_path.resolve(conf.dir);
    this.data = null;
  }

  generate(ret) {
    throw 'Reporter.generate method should be implemented by subclasses.';
  }

}


exports.Reporter = Reporter;