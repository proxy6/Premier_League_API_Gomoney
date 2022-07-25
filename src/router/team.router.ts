import {Router} from 'express'
import { addTeam, editTeam, viewAllTeams, viewSingleTeam, deleteTeam } from '../controller/team.controller'
import { isAuthorized } from '../middleware/auth'
// import Admin from './model/admin.model'

const router = Router()
router.post('/', isAuthorized('admin'), addTeam)
router.get('/', isAuthorized('admin', 'user'), viewAllTeams)
router.get('/:teamId', isAuthorized('admin', 'user'), viewSingleTeam)
router.patch('/edit/:teamId', isAuthorized('admin'), editTeam) 
router.delete('/delete/:teamId', isAuthorized('admin'), deleteTeam)

export default router
