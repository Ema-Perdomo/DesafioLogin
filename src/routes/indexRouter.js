import cartRouter from './cartRouter.js';
import productsRouter from './ProductsRouter.js';
import userRouter from './userRouter.js';
import chatRouter from './chatRouter.js';
import upload from '../config/multer.js';
import sessionRouter from './sessionRouter.js';
import express from 'express';
import { __dirname } from '../path.js';

const indexRouter = express.Router();

// indexRouter.use('/')

//Routes
indexRouter.use('/public', express.static(__dirname + '/public'))
indexRouter.use('/api/products', productsRouter, express.static(__dirname + '/public'))
indexRouter.use('/api/cart', cartRouter)
indexRouter.use('/api/chat', chatRouter, express.static(__dirname + '/public'))
indexRouter.use('/api/users', userRouter)
indexRouter.use('/api/session', sessionRouter)


indexRouter.post('/upload', upload.single('product'), (req, res) => {   //Carga de imagenes

    try {
        console.log(req.file)
        console.log(req.body)//?
        res.status(200).send('Imagen subida correctamente')
    } catch (error) {
        res.status(500).send('Error al cargar la imagen.')
    }
})

export default indexRouter;