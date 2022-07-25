import { Router } from 'express';
import UserRoute from './user.router'
import teamRoute from './team.router'
import fixtureRoute from './fixture.router'
import searchRouter from './search.router'
import seedRouter from '../router/seed'

const router = Router();

router.get('/', (req, res)=>{
    res.send("Welcome to Football Fixtures API")
})
router.use('/identity', UserRoute);
router.use('/team', teamRoute)
router.use('/fixture', fixtureRoute)
router.use('/search', searchRouter)
router.use('/seed', seedRouter)

export default router;
