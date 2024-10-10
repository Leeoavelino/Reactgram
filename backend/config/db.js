const mongoose = require("mongoose")

const dbUser = process.env.DB_USER //pegamos no .env
const dbPassword = process.env.DB_PASS //pegamos no .env
const conn = async() => {
    try{
        const dbConn = await mongoose.connect(`mongodb+srv://${dbUser}:${dbPassword}@leoave.jmcmu4k.mongodb.net/?retryWrites=true&w=majority&appName=LeoAve`)
        console.log('Conectou ao Banco!')
        
        return dbConn
    } catch (error) {
        console.log(error)
    }
}

conn()

module.exports = conn




