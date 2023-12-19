import "dotenv/config.js";
import express from 'express';
import cors from 'cors';
import apiRouter from './routes/index.js';
import bodyParser from 'body-parser';
import { connectDb } from './services/mongoose.service.js';


const app = express();
const { json } = bodyParser;
const port = process.env.PORT;

app.use('*', cors())
app.use(json());
app.use('/api/v1', apiRouter);

export const start = () => {
    app.listen(port, (err) => {
        if (err) {

            process.exit();
        }
        console.log(`app is running on port ${port}`);
    });
}

start();
connectDb();