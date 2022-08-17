const express = require('express')
const session = require('express-session')
const passport = require('passport')
const path = require('path')
const localStrategy = require("passport-local").Strategy
const mongoose = require('mongoose')
const app = express()
const controller = require('./controller/script')
const Usuario = require('./models/models')
port = 8080

app.use(express.static(__dirname + "/views"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    session({
      secret: "coderhouse",
      cookie: {
        httpOnly: false,
        secure: false,
        maxAge: 20000,
      },
      rolling: true,
      resave: false,
      saveUninitialized: false,
    })
);
  
app.use(passport.initialize());
app.use(passport.session());

const registerStrategy = new localStrategy(
    {passReqToCallback: true},

    async (req, username, password, done) =>{
        try{
            const userExist = await Usuario.findOne({username})

            if(userExist){
                return done("Nombre de usuario ya creado", false)
            }else{
                const nuevoUsuario = {
                    username: username,
                    password: password,
                    email: req.body.email,
                    firstName: req.body.firstName,
                    lastName: req.body.lastName
                }

                const crearUsuario = await Usuario.create(nuevoUsuario)

                return done('Usuario creado con exito', crearUsuario)
            }

        }catch(err){
            console.log('Error', err)
            done(err)
        }
    }

)

passport.use('register', registerStrategy)

app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname + "/views/login.html"))
})

app.get("/register", (req, res) =>{
    res.sendFile(path.join(__dirname + "/views/register.html"))
})

app.post("/register", passport.authenticate('register', {failureRedirect: "/errorRegister"}), 
    controller.postRegister
)

app.get("/errorRegister", ( req, res ) => {
    res.render("Registro erroneo", {})
})



function Main() {
    const URL = "mongodb://localhost:27017/passport"

    mongoose.connect( URL,{ useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
        if(err){
            console.log("Error al conectar base de datos")
        }else {
            console.log('BASE DE DATOS CONECTADA')
        }
    } )
}

app.listen(port, (err) => {
    if(!err){
        console.log(`Servidor escuchando puerto ${port}`)
    }else {
        console.log('Error al escuchar el puerto')
    }
})

Main()