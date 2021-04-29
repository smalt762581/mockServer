/*
 * @Author: your name
 * @Date: 2021-04-29 18:14:54
 * @LastEditTime: 2021-04-29 19:48:30
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \mockServer\controllers\index.js
 */
const sign = async (ctx, next) => {
  console.log('ctx', ctx.request)
  console.log('body', ctx.request.body)
  //ctx.set("Access-Control-Allow-Origin", "http://127.0.0.1:9000")
  // ctx.res.setHeader("Access-Control-Allow-Origin", "*");
  ctx.set("Access-Control-Allow-Origin", "http://127.0.0.1:9000")
  const name = ctx.request.body.name || "";
  const password = ctx.request.body.password || "";
  console.log(`signin with name: ${name}, password: ${password}`);
  if (name === "koa" && password === "12345") {
    await next();
    ctx.response.body = `<h1>Welcome, ${name}!测试</h1>`;
  } else {
    ctx.response.body = `<h1>Login failed!</h1>
        <p><a href="/">Try again</a></p>`;
  }
};

const basic = async (ctx, next) => {
  // await next()
  ctx.response.body = `<h1>Index</h1>
        <form action="/sign" method="post">
            <p>Name: <input name="name" value="koa"></p>
            <p>Password: <input name="password" type="password"></p>
            <p><input type="submit" value="Submit"></p>
        </form>`;
};

module.exports = {
  "GET /": basic,
  "POST /sign": sign,
};
