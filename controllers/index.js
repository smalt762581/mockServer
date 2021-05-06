/*
 * @Author: your name
 * @Date: 2021-04-29 18:14:54
 * @LastEditTime: 2021-05-06 14:15:57
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \mockServer\controllers\index.js
 */

const fs = require('fs');

const appId = 'LhGroupBuyApp';

const validAccount = [
  {
    tenant: 'lhtest',
    mobile: '18395870329',
    password: '123456',
    name: '鲸小采',
    company: '上海海鼎信息工程股份有限公司',
    uuid: '0af18233-a7f8-4cba-99bb-9e543c3ae4f3',
    Quota: 4000,
  },
  {
    tenant: 'lhtest',
    mobile: '18512345678',
    password: '123456',
    name: '测试',
    company: '上海海鼎信息工程股份有限公司',
    uuid: 'fd57a628-6037-4415-bbf6-bf7cad836b58',
    Quota: 6000,
  },
];

const enumMap = {
  NG_NOT_EXIST: '用户不存在',
  NG_PASSWORD: '密码错误',
  NG_NOT_REQ: '请求参数错误',
  NG_INVALID: '验证码无效或已过期',
  NG_IDENTITY: '用户身份校验失败',
  SUCCESS: '操作成功',
};

const isExistUser = (tenant, mobile) => {
  const currentData = validAccount.filter(
    (item) => item.tenant === tenant && item.mobile === mobile
  );
  const isExist = currentData.length > 0;
  return [isExist, currentData];
};

const generateCaptcha = () => {
  const str = '0123456789';
  let s = '';
  while (s.length < 4) {
    var n = Math.round(Math.random() * 9);
    s += str[n];
  }
  return s;
};

// 登录
const login = async (ctx, next) => {
  const { body } = ctx.request;
  const { mobile = '', password = '', appId, tenant = '' } = body;
  //appid
  if (!appId) {
    const code = 'NG_NOT_REQ';
    ctx.throw(400, enumMap[code]);
  } else {
    //判断用户是否存在
    const [isExist, currentData] = isExistUser(tenant, mobile);
    const [ userData ] = currentData;
    const resBody = {};
    let code = '';
    const innerData = {};
    if (!isExist) {
      code = 'NG_NOT_EXIST';
      innerData['success'] = false;
    } else {
      if (password !== userData.password) {
        code = 'NG_PASSWORD';
        innerData['success'] = false;
        innerData['data'] = null;
      } else {
        code = 'SUCCESS';
        innerData['success'] = true;
        innerData['data'] = userData;
      }
    }
    innerData['code'] = code;
    innerData['msg'] = enumMap[code];
    resBody['msg'] = null;
    resBody['success'] = true;
    resBody['data'] = innerData;
    ctx.status = 200;
    ctx.response.body = resBody;
  }
};

// 获取验证码
const captcha = async (ctx, next) => {
  const { body } = ctx.request;
  const { mobile = '', tenant = '' } = body;
  const innerData = {};
  let code = '';
  if (!mobile) {
    code = 'NG_NOT_REQ';
    ctx.throw(400, enumMap[code]);
  } else {
    const resBody = {};
    const [isExist] = isExistUser(tenant, mobile);
    if (!isExist) {
      code = 'NG_NOT_EXIST';
      innerData['success'] = false;
      innerData['data'] = null;
    } else {
      const verificationCode = generateCaptcha();
      validAccount.forEach((item) => {
        if (mobile === item.mobile) {
          item['verificationCode'] = verificationCode;
        } else {
          item['verificationCode'] = '';
        }
      });
      code = 'SUCCESS';
      innerData['success'] = true;
      innerData['data'] = { verificationCode };
    }
    innerData['code'] = code;
    innerData['msg'] = enumMap[code];
    resBody['success'] = true;
    resBody['msg'] = null;
    resBody['data'] = innerData;
    ctx.status = 200;
    ctx.response.body = resBody;
  }
};

// 校验验证码
const checkCaptcha = async (ctx, next) => {
  const { body } = ctx.request;
  const { appId, code, mobile = '', tenant = '' } = body;
  //appid
  if (!appId || !code || !mobile) {
    const code = 'NG_NOT_REQ';
    ctx.throw(400, enumMap[code]);
  } else {
    const resBody = {};
    const innerData = {};
    let rstCode = '';
    const [, currentData] = isExistUser(tenant, mobile);
    const [ userData ] = currentData;
    const {verificationCode} = userData;
    if (verificationCode !== code) {
      rstCode = 'NG_INVALID';
      innerData['success'] = false;
      innerData['data'] = null;
    } else {
      rstCode = 'SUCCESS';
      innerData['success'] = true;
      innerData['data'] = userData;
    }
    innerData['code'] = rstCode;
    innerData['msg'] = enumMap[rstCode];
    resBody['msg'] = null;
    resBody['success'] = true;
    resBody['data'] = innerData;
    ctx.status = 200;
    ctx.response.body = resBody;
  }
};

// 个人信息
const getUserInfo = async (ctx, next) => {
  const { body } = ctx.request;
  const { uuid = '', tenant = '' } = body;
  const findIndex = validAccount.findIndex(item => item.uuid === uuid && item.tenant === tenant);
  const isSuccess = findIndex > -1;
  const resBody = {};
  const innerData = {};
  let rstCode = '';
  if (isSuccess) {
    rstCode = 'SUCCESS';
    innerData['data'] = validAccount[findIndex];
    innerData['success'] = true;
  } else {
    rstCode = 'NG_IDENTITY';
    innerData['data'] = null;
    innerData['success'] = false;
  }
  innerData['code'] = rstCode;
  innerData['msg'] = enumMap[rstCode];
  resBody['msg'] = null;
  resBody['success'] = true;
  resBody['data'] = innerData;
  ctx.status = 200;
  ctx.response.body = resBody;
}

module.exports = {
  'POST /login': login,
  'POST /captcha': captcha,
  'POST /checkAndLogin': checkCaptcha,
  'POST /userInfo': getUserInfo
};
