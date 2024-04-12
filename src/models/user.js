import { Schema, model } from 'mongoose';
import cartModel from './cart.js';

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
    },
    cartId: {
        type: Schema.Types.ObjectId,
        ref: 'carts'
    }
})
//Previo a guardar en database el user creado, voy a ejecutar un async
userSchema.pre('save', async function (next) {
    try {
        const newCart = await cartModel.create({ products: [] })
        this.cartId = newCart._id
    } catch (error) {
        next(error) //continua(sin el cart porque tuvo error al crearlo)
    }
})

userSchema.pre('find', async function (next) { 
    try {
        this.populate('cartId')
    } catch (error) {
        next(error)
    }
})

export const userModel = model("users", userSchema);