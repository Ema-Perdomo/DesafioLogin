import local from 'passport-local';
import passport from 'passport';
import crypto from 'crypto';
import GithubStrategy from 'passport-github2';
import { userModel } from '../../models/user.js';
import { createHash, validatePassword } from '../../utils/bcrypt.js';

//Pasport trabaje con uno o mas middlewares
const localStrategy = local.Strategy;


const initializePassport = () => {
    //Definir en que rutas se aplican mis estrategias

    passport.use('register', new localStrategy({ passReqToCallback: true, usernameField: 'email' }, async (req, username, password, done) => {
        try {
            const { role, first_name, last_name, age, email, password } = req.body
            const findUser = await userModel.findOne({ email: email })
            if (findUser) {
                return done(null, false) //(error?, user registrado correctamente(se aplico la estrategia correctamente)?)
            } else {
                const user = await userModel.create({ role: role, first_name: first_name, last_name: last_name, age: age, email: email, password: createHash(password) })
                return done(null, true)
            }
        } catch (error) {
            return done(error)
        }
    }))

    //Iniciallizar la sesion del user
    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    //Eliminar la sesion del user
    passport.deserializeUser(async (id, done) => {
        const user = await userModel.findById(id)
        done(null, user)
    })

    passport.use('login', new localStrategy({ usernameField: 'email' }, async (username, password, done) => {

        try {
            const user = await userModel.findOne({ email: username }).lean()
            if (user && validatePassword(password, user.password)) {

                return done(null, user)
            } else {
                return done(null, false)
            }
    } catch (error) {
        return done(error)
    }
}))

passport.use('github', new GithubStrategy({
    clientID: 'Iv1.73490861f78cbe4d',
    clientSecret: 'b4e3a38392220ee395681c1e7d7afa0464fff4fa',
    callbackURL: 'https://localhost:8080/api/session/githubSession'
}, async (accesToken, refreshToken, profile, done) => {
    try {
        console.log(accesToken)
        console.log(refreshToken)
        const user = await userModel.findOne({email: profile._json.email}).lean()
        if(user){
            return done(null, user)
        }else{ //si no existe, lo creo
            const randomNumber = crypto.randomUUID()
            const userCreated = await userModel.create({ first_name: profile._json.email, 
                last_name: ' ', email: profile._json.email, age : 18, password: createHash(`${profile._json.email}${randomNumber}`) })
            console.log(randomNumber)
            return done(null, userCreated)
            }
        
    } catch (error) {
        return done(error)
    }
}
))


}

export default initializePassport