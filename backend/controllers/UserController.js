const User = require('../models/User')
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const mongoose = require("mongoose")

const jwtSecret = process.env.JWT_SECRET

//gerador de user Token
//recebe o id do usuario para que possamos fazer qualquer manipulaçao futuramente. passa no secret para criar o token. e expira em 7 dias(faz logout automatico quando chega nesse tempo)
const generateToken = (id) => {
    return jwt.sign({id}, jwtSecret, {
        expiresIn: '7d',
    })
}

//funçao para registro e para logar
const register = async(req, res) => {
    
    const {name, email, password} = req.body

    //checando se o usuario existe
    const user = await User.findOne({email})

    //vendo se o usuario existe no sistema
    if(user){
        res.status(422).json({errors: ["Por favor, utilize outro e-mail"]})
        return
    }

    //generate password hash
    const salt = await bcrypt.genSalt()
    const passWordHash = await bcrypt.hash(password, salt)

    //Criando usuario
    const newUser = await User.create({
        name,
        email,
        password: passWordHash //criando uma senha baseada na biblioteca do bcrypt
    })

    //verificar se o usuario foi criado com sucesso, retornar um token
    if(!newUser){
        res.status(422).json({errors: ["Houve um erro, por favor tente mais tarde."]})
    }

    //caso criado com sucesso  envio o token do usuario para fazer o login
    res.status(201).json({
        _id: newUser._id,
        token: generateToken(newUser._id),
    })
}
//fazendo login do usuario
const login = async (req, res) => {
    const {email, password} =  req.body

    const user = await User.findOne({email})

    //checando se o usuario existe
    if(!user){
        res.status(404).json({errors: ["Usuario nao encontrado"]})
        return
    }
    //checar se a senha é exatamente a mesma
    if(!(await bcrypt.compare(password, user.password))){
        res.status(422).json({errors: ["Senha invalida."]})
        return
    }
    //apos dar tudo certo vou retornar o usuario com token
    res.status(201).json({
        _id: user._id,
        profileImage: user.profileImage,
        token: generateToken(user._id),
    })
}
//obter o usuario logado
const getCurrentUser = async(req, res) => {
    const user = req.user

    res.status(200).json(user)
}

//uppdate an user

const update = async(req, res) => {
    const {name, password, bio} = req.body

    let profileImage = null

    if(req.file){
        profileImage = req.file.filename
    }

    const reqUser = req.user

    const user = await User.findById(new mongoose.Types.ObjectId(reqUser._id)).select("-password")

    //verificar se o nome chegou
    if(name) {
        user.name = name
    }
    //verificar se chegou um password
    if(password){
        const salt = await bcrypt.genSalt()
        const passWordHash = await bcrypt.hash(password, salt)
        user.password = passWordHash
    }
    //checando se veio profileImage
    if(profileImage){
        user.profileImage = profileImage
    }
    //checando se o usuario mandou algo na bio
    if(bio){
        user.bio = bio
    }
    //salvando no banco
    await user.save()
    res.status(200).json(user)
}
// Get user by id
const getUserById = async (req, res) => {
    const { id } = req.params; // get the id from the URL
 
    let user;
    try {
        // Without new before mongoose did not work because we need to create a new instance of ObjectId
        user = await User.findById(new mongoose.Types.ObjectId(id)).select('-password');
 
        res.status(202).json(user); // sending the user
    } catch (error) {
        //Usuario nao encontrado
        res.status(404).json({ errors: ['Usuario nao encontrado'] });
        return;
    }
 
    // Id no formato certo mas sem o usuario encontrado
    if (!user) {
        res.status(404).json({ errors: ['Usuario nao encontrado'] });
        return;
    }
};

module.exports = {
    register,
    login,
    getCurrentUser,
    update,
    getUserById,
}