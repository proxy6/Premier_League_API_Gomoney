import {Router} from 'express'
import { BulkAddFixures, BulkAddTeam } from '../controller/seedDB'

const router = Router()

router.post('/teams', BulkAddTeam)
router.post('/fixtures', BulkAddFixures)

export default router
