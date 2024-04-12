//Movemos la lógica de las rutas a un controlador
import productModel from "../models/products.js"
export const getProducts = async (limit, page, filter, ord) => { //ordQuery: orden del query

    let metFilter
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
    const ordQuery = ord !== undefined ? { price: ord } : {}
    const prods = await productModel.paginate(query, { limit: limit, page: pag, sort: ordQuery });
    return prods

}

export const getProduct = async (idProducto) => {

    const prod = await productModel.findById(idProducto)
}

export const createProduct = async (product) => {
    const mensaje = await productModel.create(product)
    return mensaje
}

export const updateProduct = async (idProducto, upProduct) => {
    const mensaje = await productModel.findByIdAndUpdate(idProducto, upProduct)
    return mensaje
}

export const deleteProduct = async (idProducto) => {
    const mensaje = await productModel.findByIdAndDelete(idProducto)
    return mensaje
}