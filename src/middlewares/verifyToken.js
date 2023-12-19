import jwt from 'jsonwebtoken';
const { verify } = jwt;

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).send({
            auth: false,
            token: null,
            message: "missing token"
        })
    }
    verify(token, process.env.SECRET_JWT, (err, decoded) => {
        if (err) {
            return res.status(401).send({
                auth: false,
                token: null,
                message: "no authorized"
            })
        }
        req.user = decoded;
        req.token = token;
        next();
    })
}

export default verifyToken;