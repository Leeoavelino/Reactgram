const Photo = require("../models/Photo")
const User = require("../models/User")
const mongoose = require("mongoose")

//inserir uma foto e relacionar a um usuario
const insertPhoto = async(req, res) => {
    const {title} = req.body
    const image = req.file.filename

    const reqUser = req.user
    const user = await User.findById(reqUser._id)

    //Criar foto
    const newPhoto = await Photo.create({
        image,
        title,
        userId: user._id,
        userName: user.name,
    })

    //verificar se a foto foi criada com sucesso
    if(!newPhoto){
        res.status(422).json({
            errors: ["Houve um problema, por favor, tente novamente mais tarde."]
        })
        return
    }
    res.status(201).json(newPhoto)
}
// remover a foto do banco de dados

const deletePhoto = async(req, res) => {
    const { id } = req.params
    const reqUser = req.user
    try{
        const photo = await Photo.findById(new mongoose.Types.ObjectId(id))

        //checando se a foto existe
        if(!photo){
            res.status(404).json({errors: ["Foto não encontrada!"]})
            return
        }
        //verificar se a foto excluida pertence ao usuario
        if(!photo.userId.equals(reqUser._id)){
            res.status(422).json({errors: ["Ocorreu um erro, por favor tente novamente mais tarde."]})
        }
        await Photo.findByIdAndDelete(photo._id)
        res.status(200).json({id: photo._id, message: "Foto excluida com sucesso."})
    } catch(error){
        res.status(404).json({errors: ["Foto não encontrada!"]})
        return
    }
}
//pegar todas as fotos (get all photos)
const getAllPhotos = async(req, res) => {
    const photos = await Photo.find({}).sort([["createdAt", -1]]).exec()
    return res.status(200).json(photos) //troquei photos por photo e o erro sumiu
}
//funçao de pegar as fotos do usuario
const getUserPhotos = async(req, res) => {
    const {id} = req.params

    const photos = await Photo.find({userId: id}).sort([['createdAt', -1]]).exec()
    return res.status(200).json(photos)
}
//Pegar a foto pelo id dela
const getPhotoById = async (req, res) => {
    const {id} = req.params
    const photo = await Photo.findById(new mongoose.Types.ObjectId(id))
    //verificar se a foto existe
    if(!photo){
        res.status(404).json({errors: ["Foto não encontrada."]})
        return
    }
    res.status(200).json(photo)
}
//atualizar foto
const updatePhoto = async (req, res) => {
    const {id} = req.params
    const {title} = req.body

    const reqUser = req.user
    const photo = await Photo.findById(id)

    //verificar se a foto existe
    if(!photo){
        res.status(404).json({errors: ["Foto nao encontrada"]})
        return
    }
    //checarndo se a foto pertence ao usuario
    if(!photo.userId.equals(reqUser._id)){
        res.status(422).json({errors: ["Ocorreu um erro, por favor tente novamente mais tarde."]})
        return
    }
    if(title) {
        photo.title = title
    }
    await photo.save()
    res.status(200).json({ photo, message: "Foto atualizada com sucesso!" })
}
//funcionalidade de like das fotos
const likePhoto = async(req, res) => {
    const {id} = req.params
    const reqUser = req.user
    const photo = await Photo.findById(id)

    if(!photo) {
        res.status(404).json({errors: ["Foto não encontrada"]})
        return
    }

    //verificar se o usuario ja deu like na foto
    if(photo.likes.includes(reqUser._id)){
        res.status(422).json({errors: ["Você já curtiu a foto."]})
        return
    }
    //colocando o id do usuario em no array de likes
    photo.likes.push(reqUser._id)

    photo.save()
    res.status(200).json({photoId: id, userId: reqUser._id, message: "A foto foi curtida!"})
}
//funçao de comentarios
const commentPhoto = async(req, res) => {
    const {id} = req.params
    const {comment} = req.body

    const reqUser = req.user
    const user = await User.findById(reqUser._id)
    const photo = await Photo.findById(id)

    //verificando se a foto existe
    if(!photo) {
        res.status(404).json({errors: ["Foto não encontrada"]})
        return
    }
    //adiconando o comentario a foto
    const userComment = {
        comment: comment,
        userName: user.name,
        userImage: user.profileImage,
        userId: user._id
    }
    photo.comments.push(userComment)

    await photo.save()
    
    res.status(200).json({
        comment: userComment, 
        message: "O comentario foi adicionado com sucesso!" 
    })
}
//busca imagens
const searchPhotos = async(req, res) => {

    const {q} = req.query
    const photos = await Photo.find({title: new RegExp(q, "i")}).exec()

    res.status(200).json(photos)

}

module.exports = {
    insertPhoto,
    deletePhoto,
    getAllPhotos,
    getUserPhotos,
    getPhotoById,
    updatePhoto,
    likePhoto,
    commentPhoto,
    searchPhotos,
}