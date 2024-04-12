import { Router } from 'express';
import passport from 'passport';

const sessionRouter = Router()

sessionRouter.post('/login', passport.authenticate('login'), async (req, res) => {
    try {
        if (!req.user) { //Si no existe el usuario
            res.status(401).send('Usuario o contraseña invalidos')
        }
        //req.session guarda en MongoDB
        req.session.user = {
            email: req.user.email,
            first_name: req.user.first_name,
        }

        res.status(200).send('Login exitoso')
    } catch (error) {
        res.status(500).send('Error al loguear usuario: ', error)

    }
})


sessionRouter.post('/register', passport.authenticate('register'), async (req, res) => {
    try {
        if (!req.user) { //Si no existe el usuario
            return res.status(400).send('Usuario ya existente en la aplicacion')
        }
        res.status(200).send('Usuario registrado correctamente')
    } catch (error) {
        res.status(500).send('Error al registrar usuario: ', error)
    }
})

sessionRouter.get('/github', passport.authenticate('github', { scope: ['user: email'] }), async (req, res) => { }) //scope: lo que voy a devolver

sessionRouter.get('/githubSession', passport.authenticate('github'), async (req, res) => {
    req.session.user = {
        email: req.user.email,
        first_name: req.user.name,
    }
    res.redirect('/')
})

    //GOOGLE AUTH
// app.get('/auth/google',
//     passport.authenticate('google', { scope: ['profile'] }));

// app.get('/auth/google/callback',
//     passport.authenticate('google', { failureRedirect: '/login' }),
//     function (req, res) {
//         // Successful authentication, redirect home.
//         res.redirect('/');
//     });

sessionRouter.get('/logout', async (req, res) => {
    req.session.destroy((e =>
        e ? res.status(500).send('Error al cerrar sesion') : res.status(200).redirect(/*"api/session/login" o: */ "/")
    ))
})

sessionRouter.get('/testJWT', passport.authenticate('jwt', { session: false }) , async (req, res) => {
    res.send(req.user)
})

export default sessionRouter