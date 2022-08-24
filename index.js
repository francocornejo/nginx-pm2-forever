require('dotenv').config();
const express = require('express')
const session = require('express-session')
const passport = require('passport')
const bcrypt = require('bcrypt')
const exphbs = require ('express-handlebars')
const LocalStrategy = require("passport-local").Strategy
const mongoose = require('mongoose')
const app = express()
const controller = require('./controller/script')
const Usuario = require('./models/models')
const util = require('util');

const yargs = require('yargs')(process.argv.slice(2))
const args = yargs
    .alias({
        p: "puerto",
    }).default({
        puerto: 3000
    }).argv

const port = args.puerto;

app.engine(".hbs", exphbs({ extname: ".hbs", defaultLayout: "main.hbs" }));
app.set("view engine", ".hbs");

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

function hashPassword(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
}
  
function isValidPassword(reqPassword, hashedPassword) {
    return bcrypt.compareSync(reqPassword, hashedPassword);
}

const registerStrategy = new LocalStrategy(
    {passReqToCallback: true},

    async (req, username, password, done) =>{
        try{
            const userExist = await Usuario.findOne({username})

            if(userExist){
                return done("Nombre de usuario ya creado", false)
            }else{
                const nuevoUsuario = {
                    username: username,
                    password: hashPassword(password),
                    email: req.body.email,
                    firstName: req.body.firstName,
                    lastName: req.body.lastName
                }

                const crearUsuario = await Usuario.create(nuevoUsuario)

                return done(null, crearUsuario)
            }

        }catch(err){
            console.log('Error', err)
            done(err)
        }
    }

)

const loginStrategy = new LocalStrategy(
    async(username, password, done) => {
        const user = await Usuario.findOne({username})

        if(!user || !isValidPassword(password, user.password)){
            return done("Credenciales invalidas", null)
        }

        return done(null, user)
    }
)

passport.use("register", registerStrategy)
passport.use("login", loginStrategy)

passport.serializeUser((user, done) => {
    done(null, user._id);
});
  
passport.deserializeUser((id, done) => {
    Usuario.findById(id, done);
});
  
app.get("/login", controller.getLogin)

app.post("/login", passport.authenticate("login", {failureRedirect: "/faillogin"}),
    controller.postLogin
)

app.get("/register", controller.getSignup)

app.post("/register", passport.authenticate("register", { failureRedirect: "/failsignup"}), 
    controller.postRegister
)

app.get('/faillogin', controller.getFaillogin)

app.get("/failsignup", controller.getFailsignup);

app.get('/logout', controller.getLogout)

function checkAuth(req, res, next) {
    if (req.isAuthenticated()) {
      next();
    } else {
      res.redirect("/login");
    }
}
  
app.get("/ruta-protegida", checkAuth, (req, res) => {
const { user } = req;
console.log(user);
res.send("<h1>Ruta protegida!</h1>");
});

//
app.get("/info", (req, res) => {
    res.send(`
    <h1>Informacion relevante: </h1>
    <ul>
        <li>Argumentos de entrada: ${port}</li>
        <li>Nombre de la plataforma: ${process.platform}</li>
        <li>Version de Node: ${process.version}</li>
        <li>Memoria total reservada: ${util.inspect(process.memoryUsage(),{
            showHidden: false,
            depth: null,
            colors: true
        })}</li>
        <li>Path de ejecucion: ${process.execPath}</li>
        <li>Process ID: ${process.pid}</li>
        <li>Carpeta del proyecto: ${process.cwd()}</li>
    </ul>`)
})


const yargRoute = require('./router/route')
app.use('/', yargRoute)

function Main() {
    const URL = process.env.URL_MONGO;

    mongoose.connect( URL,{ useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
        if(err){
            console.log("Error al conectar base de datos")
        }else {
            console.log('BASE DE DATOS CONECTADA')

            app.listen(port, (err) => {
                if(!err){
                    console.log(`Servidor escuchando puerto ${port}`)
                }else {
                    console.log('Error al escuchar el puerto')
                }
            })
            
        }
    } )
}
Main()