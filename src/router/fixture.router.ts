import {Router} from 'express'
import { pendingFixture, createFixture, deleteFixture, editFixture, getAllFixtures, getSingleFixture, viewFixtureByUniqueLink, completedFixture } from '../controller/fixture.controller'
import { isAuthorized } from '../middleware/auth';

const router = Router();
router.post('/', createFixture)
router.get('/', getAllFixtures)
router.get('/completed',isAuthorized('user'), completedFixture)
router.post('/pending', pendingFixture)
router.get('/:fixtureId', getSingleFixture)
router.patch('/edit/:fixtureId', editFixture)
router.delete('/delete/:fixtureId', deleteFixture)
router.get('/unique/:uniqueLink', viewFixtureByUniqueLink)


export default router
