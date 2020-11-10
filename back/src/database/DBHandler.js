const pg = require('pg');

const dotenv = require('dotenv');
const env = dotenv.config();

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// const client = new Client ({
//     database: env.parsed.DB,
//     user: env.parsed.USER, //ユーザー名はデフォルト以外を利用している人は適宜変更してください。
//     password: env.parsed.PASSWORD, //PASSWORDにはPostgreSQLをインストールした際に設定したパスワードを記述。
//     host: env.parsed.HOST,
//     port: 5432,
//     ssl: true
// });

const pool = new pg.Pool({
    user: env.parsed.USER,
    host: env.parsed.HOST,
    database: env.parsed.DB,
    password: env.parsed.PASSWORD,
    port: 5432,
    ssl: true
  })

module.exports={pool:pool,connection:null}