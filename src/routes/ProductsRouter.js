import { Router } from 'express';
import productModel from '../models/products.js';

const productsRouter = Router()


productsRouter.get('/', async (req, res) => {

    try {
        let metFilter
        const { limit, page, filter, ord } = req.query
        const pag = page !== undefined ? page : 1
        const lim = limit !== undefined ? limit : 10

        if (filter == "true" || filter == "false") {
            metFilter = "status"
        } else {
            if (filter !== undefined) {
                metFilter = "category"
            }
        }
        const query = metFilter ? { [metFilter]: filter } : {}
        const ordQuery = ord !== undefined ? {price : ord} : {}

        const prods = await productModel.paginate(query , { limit: lim, page: pag, sort: ordQuery});
        //convierto prods a JSON
        const prodsJSON = prods.docs.map(prod => prod.toJSON())

        //     const limite = parseInt(limit)
        //NaN en If es false
        //if (limite && limite > 0) {//Si el string es no numerico devuelve NaN
        // const prodsLimit = prods.slice(0, limit) //Slice funciona con limit = undefined | "5" viene del query es = 5 en Js
        res.status(200).render('templates/home', {
            products: prodsJSON,
            mostrarProductos: true
        })
        // } else {
        // res.status(400).send("Error al consultar cliente, ingrese un número válido para las queries.")

    } catch (error) {
        res.status(500).render('templates/error', {
            error: error,
        })
    }
})

productsRouter.get('/:idProd', async (req, res) => {
    try {
        const idProducto = req.params.idProd
        const prod = await productModel.findById(idProducto)
        if (prod)
            res.status(200).send(prod)
        else
            res.status(404).send("Producto inexistente.")
    } catch (error) {
        res.status(500).send(`Error interno del servidor al consultar producto: ${error}`)
    }
})

productsRouter.post('/', async (req, res) => {
    try {
        const product = req.body
        const mensaje = await productModel.create(product)
            //Create 201
            res.status(201).send('Producto creado correctamente')

    } catch (error) {
        res.status(500).send(`Error interno del servidor al crear producto: ${error}`)
    }
})

productsRouter.put('/:idProd', async (req, res) => {
    try {
        const idProducto = req.params.idProd
        const updateProduct = req.body //Consulto body
        const mensaje = await productModel.findByIdAndUpdate(idProducto, updateProduct)
        res.status(200).send(mensaje)
    } catch (error) {
        res.status(500).send(`Error interno del servidor al actualizar producto: ${error}`)
    }
})

productsRouter.delete('/:idProd', async (req, res) => {
    try {
        const idProducto = req.params.idProd
        const mensaje = await productModel.findByIdAndDelete(idProducto)
        res.status(200).send(mensaje)
    } catch (error) {
        res.status(500).send(`Error interno del servidor al eliminar el producto: ${error}`)
    }
})

export default productsRouter