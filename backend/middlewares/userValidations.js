const {body} = require("express-validator")

//validaçao da criaçao de usuarios.
const userCreateValidation = () => {
    return [
        //verifica se o campo nome  foi colocado uma string. caso nao seja retorna essa mensagem
        body("name").isString().withMessage('O nome é obrigatorio.').isLength({min: 3}).withMessage('O numero precisa ter no minimo 3 caracteres.'),
        body("email").isString().withMessage('O e-mail é obrigatorio.').isEmail().withMessage('Insira um e-mail valido'),
        body("password").isString().withMessage('A senha é obrigatoria').isLength({min: 5}).withMessage('O senha precisa ter no minimo 5 caracteres.'),
        body("confirmPassword").isString().withMessage('A confirmação de senha é obrigatoria').custom((value, {req}) => {
            if(value != req.body.password){
                throw new Error('As senhas não são iguais.')
            }
            return true
        }),
    ]
}
const loginValidation = () => {
    return [
        body("email")
            .isString()
            .withMessage("O e-mail é obrigatorio.")
            .isEmail()
            .withMessage("Insira um e-mail valido."),
        body("password").isString().withMessage("A senha é obrigatoria.")
    ]
}
const userUpdateValidation = () => {
    //nome opcional, nao pode ter menos de 3 letras / senha opcional e nao pode ter menos de 5 caracteres
    return [
        body("name")
        .optional()
        .isLength({min:3})
        .withMessage('O nome precisa de pelo menos 3 caracteres.'),
        body("password").optional().isLength({min:5}).withMessage("A senha precisa ter no minimo 5 caracteres.")
    ]
}

module.exports = {
    userCreateValidation,
    loginValidation,
    userUpdateValidation,
}