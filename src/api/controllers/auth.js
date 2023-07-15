const loginFailed = async(req,res) => {
    res.status(401).json({
        success : false,
        message : "failure",
    })
}

const logout = async (req,res) => {
    req.logout(function(err) {
        if (err) {
          return res.status(500).send('Internal Server Error');
        }
        res.redirect(process.env.CLIENT_URL)
    })
}

module.exports = {
    loginFailed,
    logout
}