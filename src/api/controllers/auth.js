const loginFailed = async(req,res) => {
    res.status(401).json({
        success : false,
        message : "failure",
    })
}

const loginSuccess = async(req,res) => {
    // console.log("req.user in login Success : ",req.user);
    res.status(200).json({
        success : true,
        user : req.user
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
    loginSuccess,
    logout
}