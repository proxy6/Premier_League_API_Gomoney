import * as express from 'express'
import routes from './router/index'
import cors from 'cors'
import jwt, { Secret, JwtPayload } from 'jsonwebtoken';
export const SECRET_KEY: Secret = 'JWT_Secret';
import {Request} from 'express'

export interface CustomRequest extends Request {
    token?: 'some value'
   }

const app = express();
app.use(express.json({ limit: '1mb'}));
app.use(express.urlencoded({ extended: true, limit: '1mb'}));


app.use('/', routes)
export default app