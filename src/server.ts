import * as express from 'express'
import routes from './router/index'

const app = express();
app.use(express.json({ limit: '1mb'}));
app.use(express.urlencoded({ extended: true, limit: '1mb'}));


app.use('/', routes)
export default app