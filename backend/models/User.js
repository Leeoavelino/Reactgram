const mongoose = require('mongoose')
const {Schema} = mongoose //importamos o Schema la do mongoose para cria o esqueleto do model

//coloca o nome de todos os campos(elementos) que vao ter na collection e seus tipos
const userSchema = new Schema({
    name: String,
    email: String,
    password: String,
    profileImage: String,
    bio: String,
},
    {
        timestamps: true
    }
)

const User = mongoose.model("User", userSchema) //definimos o model e colocamos o nome dele de User e logo apos passamos um schema pro model que é o userSchema.

module.exports = User