import local from 'passport-local';
import passport from 'passport';
import crypto from 'crypto';
import GitHubStrategy from 'passport-github2';
import { userModel } from '../../models/user.js';
import { createHash, validatePassword } from '../../utils/bcrypt.js';
import { strategyJWT } from './strategies/jwtStrategy.js';

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

    passport.use('github', new GitHubStrategy({
        clientID: 'Iv1.73490861f78cbe4d',
        clientSecret: '23c38fd5f7eef9225cf9dcb3b762369a4595e459',
        callbackURL: "http://localhost:8080/api/session/githubSession"
    }, async (accesToken, refreshToken, profile, done) => {
        try {
            // console.log(accesToken)
            // console.log(refreshToken)

            const user = await userModel.findOne({ email: profile._json.email }).lean()
            if (user) {
                return done(null, user)
            } else { //si no existe, lo creo
                const randomNumber = crypto.randomUUID()
                console.log(profile._json)
                const userCreated = await userModel.create({
                    first_name: profile._json.name, last_name: ' ', email: profile._json.email,
                    age: 18, password: createHash(`${profile._json.name}${randomNumber}`)
                })
                console.log(randomNumber) // name + random
                return done(null, userCreated)
            }

        } catch (error) {
            return done(error)
        }
    }
    ))

    passport.use('jwt',strategyJWT) //La definicion esta en jwtStrategy.js


        //Auth con Google
    // var GoogleStrategy = require('passport-google-oauth20').Strategy;

    // passport.use(new GoogleStrategy({
    //     clientID: GOOGLE_CLIENT_ID,
    //     clientSecret: GOOGLE_CLIENT_SECRET,
    //     callbackURL: "http://www.example.com/auth/google/callback"
    // },
    //     function (accessToken, refreshToken, profile, cb) {
    //         User.findOrCreate({ googleId: profile.id }, function (err, user) {
    //             return cb(err, user);
    //         });
    //     }
    // ));


}

export default initializePassport