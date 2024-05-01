const {createPool} = require("mysql2/promise")
const dotenv = require("dotenv")
dotenv.config({path:"./env/.env"})


const pool = createPool({
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_DATABASE
});

module.exports = pool