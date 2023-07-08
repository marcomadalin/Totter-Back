const jwt = require("jsonwebtoken")
const User = require("../models/userModel")

async function requireAuth(req, res, next) {

    const { authorization } = req.headers
    if (!authorization) return res.status(401).json({error: "Authorization token required"})

    try {
        const {_id} = jwt.verify(req.headers.authorization.split(" ")[1], process.env.SECRET)
        req.userId = _id
        next()
    }
    catch (error) {
        console.log(error)
        res.status(401).json({error: error.message})
    }

}

module.exports = requireAuth