function getLogin(req, res) {
  if (req.isAuthenticated()) {
    let user = req.user;
    console.log("user logueado");
    res.render("login-ok", {
      usuario: user.username,
      nombre: user.firstName,
      apellido: user.lastName,
      email: user.email,
    });
  } else {
      console.log("user NO logueado");
      res.sendFile("C:/Users/fedec/OneDrive/Escritorio/DesafioWebSocket/ProgramacionBackEnd/Passport/views/login.html");
  }
}

function getSignup(req, res) {
  res.sendFile("C:/Users/fedec/OneDrive/Escritorio/DesafioWebSocket/ProgramacionBackEnd/Passport/views/register.html");
}

function postRegister(req, res) {

    let user = req.user

    res.sendFile("C:/Users/fedec/OneDrive/Escritorio/DesafioWebSocket/ProgramacionBackEnd/Passport/views/index.html")
}

function postLogin(req, res) {
    let user = req.user
    
    res.sendFile("C:/Users/fedec/OneDrive/Escritorio/DesafioWebSocket/ProgramacionBackEnd/Passport/views/index.html")
}

function getFailsignup(req, res) {

  console.log("error en signup");
  res.render("signup-error", {});

}

function getFaillogin(req, res) {

  console.log("error en login");
  res.render("login-error", {});

}

function getLogout(req, res) {
  req.logout((e)=>{console.log(e)});
  res.sendFile("C:/Users/fedec/OneDrive/Escritorio/DesafioWebSocket/ProgramacionBackEnd/Passport/views/index.html");
}

module.exports = {
    postRegister,
    postLogin,
    getLogin,
    getFailsignup,
    getFaillogin,
    getLogout,
    getSignup
}