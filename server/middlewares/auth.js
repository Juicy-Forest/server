const { validateToken } = require("../services/userService");

const authMiddleware = (req, res, next) => {
    const token = req.headers["x-authorization"];
    // const rawHeaders = req.rawHeaders
    // if(!token) {
    //     rawHeaders.forEach((h) => h.startsWith('auth-token') ? usertoken = h.split("=")[1] : null  )
    //     console.log('user token:', usertoken)
    // }
    // console.log("User token 1:", token)
    if(token){
        try {
            const user = validateToken(token);
            req.user = {
                'email': user.email,
                'username': user.username,
                '_id': user._id,
                token
            }
        } catch (error) {
            res.status(401).json(error)
            console.log(error);
            return;
        }
    }
    next();
}

module.exports = {
    authMiddleware,
}
