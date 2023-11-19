const dbConfig  = require("../config/db.config")
const mysql = require('mysql2/promise');

const config = {
  db: {
    user: dbConfig.user,
    host: dbConfig.host,
    database: dbConfig.database,
    password: dbConfig.password,
    connectionLimit: 20,
  },
  listPerPage: 10,
};


async function query(sql, params) {
  //const connection  =  await mysql.createConnection(config.db)   
  const [results, ] = await connection.execute(sql, params);

  return results;
}
 
const connection = mysql.createPool(config.db);

module.exports = {
  query, connection
}



