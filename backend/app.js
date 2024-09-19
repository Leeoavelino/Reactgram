require('dotenv').config()

const express = require('express')
const path = require('path')
const cors = require('cors')

const port = process.env.PORT //para acessar a porta(PORT) que esta no .env

const app = express() //iniciando a aplicaçao

//config para receber as respostas em JSON e em form data(form data para receber as imagens)
app.use(express.json())
app.use(express.urlencoded({extended: false}))

//salve CORS
app.use(cors({credentials: true, origin: "http://localhost:3000"}))

//diretorio de upload de imagens
app.use("/uploads", express.static(path.join(__dirname, "/uploads")))

//DB connection
require("./config/db.js")

//routes
const router = require('./routes/Router.js')

app.use(router)

app.listen(port, () => {
    console.log(`App rodando na porta ${port}`)
})