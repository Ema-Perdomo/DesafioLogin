import jwt from 'jsonwebtoken'
//genero token
export const generateToken = (user) => {
    /*
        1er parametro. Objeto de asociacion del token(Usuario)
        2do.           Secret key. Clave privada del cifrado (coderhouse)
        3er.           Tiempo de expiracion del token
    */

    const token = jwt.sign({ user }, 'coderhouse', { expiresIn: '12h' }) //token firmado por mi backend, solo mi backend puede leerlo
    return token
}
console.log(generateToken({
    "_id": "66022a9a3e8fc698fbd3ae65",
    "first_name": "Jhon",
    "last_name": "Doe",
    "password": "$2b$15$qpMV.Cim6P8FajbHEORWu.5cvj5blvEv31rKS.4SPg1nEdpfqYfFe",
    "age": 35,
    "email": "JhonD.coder.com",
    "role": "Admin",
    "__v": 0
}))