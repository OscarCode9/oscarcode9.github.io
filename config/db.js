const db_config = {
    host: process.env.HOST_DB,
    user: process.env.USER_DB,
    password: process.env.PASSWORD_DB,
    database: process.env.NAME_DB
}
module.exports = db_config;