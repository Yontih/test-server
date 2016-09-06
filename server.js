'use strict';

const koa = require('koa');
const Router = require('koa-router');

let app = new koa();
let router = Router();

router.get('/', function *() {
    this.body = 'lalala';
});

app.use(router.routes())
    .listen(process.env.PORT || 8080);