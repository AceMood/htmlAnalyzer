'use strict';

const node_zlib = require('zlib');

let content = (() => {

  let mode = "0123456789abcdefghijklmnopqrstuvwxyz_-+=#!@$%^&*)(ABCDEFGHIJKLMNOPQRSTUVWXYZ,.?";
  let len = mode.length;
  function rd() {
    return mode[Math.floor(Math.random() * len)];
  }

  let str= '';
  for (let i = 0; i < 100000; ++i) {
    str += rd();
  }

  return str;

})();

let buf = node_zlib.gzipSync(content);
console.log('Random big string after gzip is:        ' + buf.length);

content = (() => {

  let str= '';
  for (let i = 0; i < 20000; ++i) {
    str += 'abcde';
  }

  return str;

})();

buf = node_zlib.gzipSync(content);
console.log('Highly repeat big string after gzip is: ' + buf.length);