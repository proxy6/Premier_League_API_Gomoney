import { Router } from 'express';
import UserRoute from './user.router'
import teamRoute from './team.router'
import fixtureRoute from './fixture.router'
import searchRouter from './search.router'
import seedRouter from '../router/seed'
import rateLimiter from '../util/rate_limiter';

const router = Router();
router.use(rateLimiter)
router.get('/', (req, res)=>{
    res.send("Welcome to Football Fixtures API")
})

router.use('/identity', UserRoute);
router.use('/team', rateLimiter, teamRoute)
router.use('/fixture', rateLimiter, fixtureRoute)
router.use('/search', rateLimiter, searchRouter)
router.use('/seed', seedRouter)

export default router;
