import { Schema, model } from 'mongoose';

const userSchema = new Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        unique: true, //No se puede tener 2 users con el mismo email
        index: true //Como email es lo mas comun que se va a buscar para encontrar un user ya que es unico, 
    },              //le pongo un indice
    role: {
        type: String,
        default: "User"
    }
})

export const userModel = model("users", userSchema);