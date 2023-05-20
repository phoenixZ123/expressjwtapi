import express from "express";
import AuthRouter from "./route/AuthRouter.js";
import cookieParser from "cookie-parser";

const app = express();
const port = 8000;
//read to req.body this from json middleware.
app.use(express.json());

app.use(cookieParser());

app.get('/', (req, res) => {
    res.json({
        success: true,
        data: {},
    })
})

app.listen(port, () => {
    console.log(`runnning on port ${port}`);
})
app.use('/api', AuthRouter)
