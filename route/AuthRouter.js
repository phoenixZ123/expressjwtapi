import express from "express"
import jwt from "jsonwebtoken";
import { checkToken } from "../middleware/TokenMiddleware.js";
const AuthRouter = express.Router();

const users = [
    { id: 1, email: 'admin123@gmail.com', password: 'password', isAdmin: true },
    { id: 2, email: 'user1@gmail.com', password: '1111', isAdmin: false },
    { id: 3, email: 'user2@gmail.com', password: '2222', isAdmin: false }
]
const refreshTokens = [];

AuthRouter.post('/login', (req, res) => {
    const { email, password } = req.body;
    console.log(email);
    const finduser = users.find(user => user.email === email && user.password == password)
    if (!finduser) {
        res.json({
            success: false,
            data: 'something was wrong'
        })
    } ``
    const UserDetail = {
        id: finduser.id,
        email: finduser.email,
        isAdmin: finduser.isAdmin
    }
    const accessToken = jwt.sign(UserDetail, 'secret', { expiresIn: "3s" })
    const refreshToken = jwt.sign(UserDetail, 'refresh_secret')

    refreshTokens.push(refreshToken)

    res.cookie('accessToken', accessToken, { httpOnly: true })
    res.cookie('refreshToken', refreshToken, { httpOnly: true })

    res.json({
        success: true,
        data: UserDetail
    })
})

AuthRouter.delete('/user/:id', checkToken, (req, res) => {
    const { id } = req.params;
    console.log(req.user);
    if (id == req.user.id || req.isAdmin == true) {
        return res.json({
            success: true,
            data: "deleted account"
        })
    }
    return res.json({
        success: false,
        data: "wrong something"
    })
})
AuthRouter.post('/logout', checkToken, (req, res) => {
    res.clearCookie('accessToken')
    res.clearCookie('refreshToken')
    res.json({
        success: true,
        data: "Log Out"
    })

})

AuthRouter.post('/refresh', (req, res) => {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
        return res.json({
            success: false,
            data: "refresh token Not Found"
        })
    }
    const findRefreshToken = refreshTokens.find(t => t == refreshToken)
    if (!findRefreshToken) {
        return res.json({
            success: false,
            data: "refresh token Not Found in our database"
        })
    }
    jwt.verify(refreshToken, "refresh_secret", (e, data) => {
        if (e) {
            return res.json({
                success: false,
                data: "refresh token invalid"
            })

        }
        const newaccessToken = jwt.sign(data, 'secret', { expiresIn: "10m" })
        const newrefreshToken = jwt.sign(data, 'refresh_secret')

        const newrefreshTokens = refreshTokens.filter(t => t != refreshToken)
        refreshTokens.push(newrefreshTokens)

        res.cookie('accessToken', newaccessToken, { httpOnly: true })
        res.cookie('refreshToken', newrefreshToken, { httpOnly: true })

        res.json({
            success: true,
            data: "success"
        })
    })
})
export default AuthRouter;

