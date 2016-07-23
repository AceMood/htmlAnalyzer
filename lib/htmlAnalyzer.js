/**
 * @file 抓取网页并分析打印网页中的资源 体积占比
 * @author AceMood
 */

'use strict';

const request    = require('request');
const htmlparser = require('htmlparser2');
const Reporter   = require('./reporter/JSONReporter').JSONReporter;
const haConf     = require('./ha-conf');

// 打印分析结果
function print(ret) {
  let reportConf = haConf.report;
  let reporter = new Reporter(reportConf);
  if (reportConf) {
    reporter.generate(ret);
  } else {
    console.log(
        'No report needed. \n' +
        'If you want the report output please config the `ha-conf.json` file.'
    );
  }
}

// 分析网页
function analyze(content) {
  let scripts = [];
  let styles = [];
  let images = [];

  function walk(ele) {
    if (ele.name === 'script' &&
        ele.type === 'script' &&
        !ele.attribs.src) {
      scripts.push(ele.children[0].data);
    }

    if (ele.name === 'style') {
      styles.push(ele.children[0].data);
    }

    if (ele.children) {
      ele.children.forEach(child => {
        walk(child);
      });
    }
  }

  var handler = new htmlparser.DomHandler((error, dom) => {
    if (error) {
      console.error(error);
    } else {
      dom.forEach(ele => {
        if (ele.name === 'html') {
          walk(ele);
        }
      });
    }
  });

  let parser = new htmlparser.Parser(handler);
  parser.write(content);
  parser.end();

  return {
    images: images,
    scripts: scripts,
    styles: styles
  }
}

// 抓取网页
function run() {
  request(haConf.url, (error, response, body) => {
    if (!error && response.statusCode == 200) {
      let ret = analyze(body);
      print(ret);
    }
  });
}

// 程序可以做一些配置
function config(conf) {
  Object.assign(haConf, conf);
  return haConf;
}

run();
