/*
 * @Author: your name
 * @Date: 2021-04-29 18:25:36
 * @LastEditTime: 2021-05-06 14:20:32
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \mockServer\controller.js
 */
const Router = require('koa-router');
const router = new Router();
const fs = require('fs');

const addMapping = (router, mapping) => {
  for (let url in mapping) {
    if (url.startsWith('GET ')) {
      const path = url.substring(4);
      router.get(path, mapping[url]);
      console.log(`register URL mapping: GET ${path}`);
    } else if (url.startsWith('POST ')) {
      const path = url.substring(5);
      router.post(path, mapping[url]);
      console.log(`register URL mapping: POST ${path}`);
    } else {
      console.log(`invalid URL: ${url}`);
    }
  }
}

const addControllers = (router) => {
  const files = fs.readdirSync(`${__dirname}/controllers`);
  const js_files = files.filter((f) => {
    return f.endsWith('.js');
  });

  for (let f of js_files) {
    console.log(`process controller: ${f}...`);
    const mapping = require(`${__dirname}/controllers/${f}`);
    addMapping(router, mapping);
  }
}

module.exports = function (dir) {
  const controllers_dir = dir || 'controllers'; // 如果不传参数，扫描目录默认为'controllers'
  addControllers(router, controllers_dir);
  return router.routes();
};

addControllers(router);
