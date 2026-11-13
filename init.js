require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
(async () => {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true
  });
  let sql = fs.readFileSync(path.join(__dirname, '../../database/schema.sql'), 'utf8');
  const dbName = process.env.DB_NAME || 'lsda';
  sql = sql.replace(/\blsda\b/g, dbName);
  await conn.query(sql);
  console.log('Database ready:', dbName);
  await conn.end();
})().catch(e => { console.error(e.message); process.exit(1); });
