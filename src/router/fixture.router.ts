import {Router} from 'express'
import { pendingFixture, createFixture, deleteFixture, editFixture, getAllFixtures, getSingleFixture, viewFixtureByUniqueLink, completedFixture } from '../controller/fixture.controller'
import { isAuthorized } from '../middleware/auth';

const router = Router();
router.post('/', isAuthorized('admin'), createFixture)
router.get('/', isAuthorized('admin', 'user'), getAllFixtures)
router.get('/completed',isAuthorized('user', 'admin'), completedFixture)
router.get('/pending', isAuthorized('admin', 'user'), pendingFixture)
router.get('/:fixtureId', isAuthorized('admin', 'user'), getSingleFixture)
router.patch('/edit/:fixtureId', isAuthorized('admin'), editFixture)
router.delete('/delete/:fixtureId', isAuthorized('admin'), deleteFixture)
router.get('/unique/:uniqueLink', isAuthorized('admin', 'user'), viewFixtureByUniqueLink)


export default router
