/*
 * @Author: your name
 * @Date: 2021-04-29 17:17:57
 * @LastEditTime: 2021-05-07 13:22:57
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

const path = require('path');
const Koa = require('koa')
const bodyParser = require('koa-bodyparser');
const cors = require('koa-cors')
// const sslify = require('koa-sslify').default
const fs = require('fs')
const http = require('http')
const https = require('https');
const controller = require('./controller');
const app = new Koa()


// 使用middleware:
app.use(cors({
  allowMethods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS']
}))
// app.use(sslify())
app.use(bodyParser());
app.use(controller());

const options = {
  key: fs.readFileSync(path.join(__dirname, './ssl/ann.key')),
  cert: fs.readFileSync(path.join(__dirname, './ssl/ann.crt'))
}

const server = http.createServer(app.callback());
const httpsServer = https.createServer(options, app.callback())

server.listen(3005, () => console.log('listening 3005'));
httpsServer.listen(443, () => console.log('listening 443'));