const {validationResult} = require("express-validator")

const validate = (req, res, next) => {

    //pegamos os erros
    const errors = validationResult(req)

    //verificando se os erros estao vazios, estando vazios continua(next)
    if(errors.isEmpty()){
        return next()
    }

    //caso tenham erros vem pra essa variavel que é um array vazio para conter os erros
    const extractedErros = []

    //mapeia os erros e pega as mensagem de cada um desses erros e coloca na variavel que é um array vazio
    errors.array().map((err) => extractedErros.push(err.msg))

    return res.status(422).json({
        errors: extractedErros
    })

}

module.exports = validate