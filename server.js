/*
 * @Author: your name
 * @Date: 2021-04-29 17:17:57
 * @LastEditTime: 2021-04-29 19:55:44
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \mockServer\server.js
 */
// /*
//  * @Author: your name
//  * @Date: 2021-04-29 16:51:33
//  * @LastEditTime: 2021-04-29 18:28:15
//  * @LastEditors: Please set LastEditors
//  * @Description: In User Settings Edit
//  * @FilePath: \mockServer\server.js
//  */
// // import Koa, { ParameterizedContext } from 'koa'
// // import logger from 'koa-logger'

const Koa = require('koa')
const bodyParser = require('koa-bodyparser');
const cors = require('koa-cors')
// const sslify = require('koa-sslify')
const https = require('https');
const controller = require('./controller');
const app = new Koa()

// // 使用middleware:
app.use(bodyParser());
app.use(controller());
app.use(cors())
// app.use(sslify())

app.listen(3005);
https.createServer(options, app.callback()).listen(9527, () => {
  console.log(`server running success at 9527`)
});
console.log('app started at port 3005...')