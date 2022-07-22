import { Router } from 'express';
import UserRoute from './user.router'
import teamRoute from './team.router'
import fixtureRoute from './fixture.router'

const router = Router();

router.use('/identity', UserRoute);
router.use('/team', teamRoute)
router.use('/fixture', fixtureRoute)

export default router;
