'use strict';

const koa = require('koa');
const Router = require('koa-router');
const Promise = require('bluebird');

const pg = require('pg');
pg.defaults.ssl = true;

let dbErr = null;
let pgClient = null;

const dbHost = process.env.DATABASE_URL || 'postgres://dlnbmmakzxnyvv:3OKWoj6iqp2HuzYZ9kxvvZVix1@ec2-54-247-95-109.eu-west-1.compute.amazonaws.com:5432/d85u3uk507rflk';

pg.connect(dbHost, (err, client) => {
    if (err) {
        dbErr = err;
    } else {
        pgClient = client;
    }
});

function query(sql) {
    return new Promise((resolve, reject) => {
        return pgClient.query(sql, (err, result) => {
            if (err) {
                return reject(err);
            }

            return resolve(result.rows);
        });
    });
}

let app = new koa();
let router = Router();

router.get('/', function *() {
    this.body = 'lalala';
});

router.get('/data', function *() {
    if (pgClient || dbErr) {
        if (dbErr) {
            this.body = JSON.stringify(dbErr);
        } else {
            try {
                this.body = yield query('select * from test_table');
            } catch (err) {
                this.body = JSON.stringify(err);
            }
        }

    } else {
        this.body = 'Init db connection..';
    }

});

app.use(router.routes())
    .listen(process.env.PORT || 5485);