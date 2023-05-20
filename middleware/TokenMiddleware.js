import jwt from "jsonwebtoken";
//just check with middlware.
export const checkToken = (req, res, next) => {
    const { accessToken } = req.cookies;
    if (!accessToken) {
        return res.json({
            success: false,
            data: "wrong access token"
        })
    }

    jwt.verify(accessToken, "secret", (e, data) => {
        if (e) {
            console.log(e.message);
            return res.json({
                success: false,
                data: e.message,
            })

        }
        req.user = data;
        next();
    })

}