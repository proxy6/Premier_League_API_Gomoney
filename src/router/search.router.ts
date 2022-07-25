import {Router} from 'express'
import { FixtureSearch, TeamSearch } from '../controller/search.controller'
const router = Router();

router.post('/teams', TeamSearch )
router.post('/fixture', FixtureSearch)
export default router
