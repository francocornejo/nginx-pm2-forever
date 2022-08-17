function postRegister(req, res) {

    let user = req.user

    res.sendFile(path.join(__dirname + '/views/index.html'))
} 

module.exports = {
    postRegister
}