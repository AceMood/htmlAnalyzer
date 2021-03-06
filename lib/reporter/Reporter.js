/**
 * @file 负责分析报告的打印
 * @author AceMood
 */

'use strict';

const node_path = require('path');

class Reporter {

  constructor(conf) {
    this.format = conf.format || 'json';
    this.path = node_path.resolve(conf.dir);
    this.contentMaxLength = conf.contentMaxLength || 100;
    this.data = null;
  }

  generate(ret) {
    throw 'Reporter.generate method should be implemented by subclasses.';
  }

  postProcess() {
    throw 'Reporter.postProcess method should be implemented by subclasses.';
  }

}

exports.Reporter = Reporter;