import {Router} from 'express'
import * as categoryController from './controller/category.js'
import { auth, roles } from "../../middlewares/auth.js";

const router = Router() ; 

router.post('/',auth([roles.Admin]),categoryController.createCategory)
router.get('/',categoryController.getCategories)
router.get('/getCategory/:_id',categoryController.getCategoryById)
router.get('/getEventsByCategory/:name',categoryController.getEventsByCategory)
router.patch('/:_id',auth([roles.Admin]),categoryController.updateCategory)
router.delete('/:_id',auth([roles.Admin]),categoryController.deleteCategory)





export default router 