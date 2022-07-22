import {Router} from 'express'
import { addTeam, editTeam, viewAllTeams, viewSingleTeam, deleteTeam } from '../controller/team.controller'
import { isAuthorized } from '../middleware/auth'
// import Admin from './model/admin.model'

const router = Router()
router.post('/', isAuthorized('admin'), addTeam)
router.get('/', viewAllTeams)
router.get('/:teamId', viewSingleTeam)
router.patch('/edit/:teamId', editTeam) 
router.delete('/delete/:teamId', deleteTeam)

export default router
