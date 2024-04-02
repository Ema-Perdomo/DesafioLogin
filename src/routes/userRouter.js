import { Router }   from 'express';
import { userModel } from '../models/user.js';

const userRouter = Router()

userRouter.get('/', async (req, res) => {
    try {
        //Consulto usuarios
        const users = await userModel.find()
        res.status(200).send(users)
    } catch (error) {
        res.status(500).send("Error al consultar usuarios:" , error)
    }
})


export default userRouter