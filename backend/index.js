import express from "express";
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import postRoutes from './routes/post.js';
import profileRoutes from './routes/profile.js'
import { fileURLToPath } from 'url';
import {register} from './controllers/auth.js'
import { verify } from "crypto";
import { verifyToken } from "./middleware/auth.js";

/* CONFIGURATION */
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config()
const app = express()

app.use(express.json())
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }))
app.use(morgan('common'))
app.use(bodyParser.json({ limit: '30mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }))
app.use(cors())
app.use('/assets', express.static(path.join(__dirname, 'public/assets')))

/* FILE STORAGE */

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/assets')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

const upload = multer({ storage });

/* ROUTES WITH FILES */
app.post('/auth/register', upload.single('picture'), register)

app.use('/auth', authRoutes)
app.use('/users', userRoutes)
app.use('/posts', postRoutes)
app.use('/profile', profileRoutes)

/* MONGOOSE SETUP */

const PORT = process.env.PORT || 6000
mongoose.connect(process.env.MONGO_URL).then(() => {
    app.listen(PORT, () => {
        console.log(`Server PORT: ${PORT}`)
    })
}).catch((error) => console.log('DID NOT CONNECT'))
