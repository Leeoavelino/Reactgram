const mongoose = require('mongoose')
const {Schema} = mongoose

//o objeto com tudo oq vai possuir na imagem
const photoSchema = new Schema({
    image: String,
    title: String,
    likes: Array,
    comments: Array,
    userId: mongoose.ObjectId,
    userName: String,
},
{
    timestamps: true
})

const Photo = mongoose.model("Photo", photoSchema)

module.exports = Photo