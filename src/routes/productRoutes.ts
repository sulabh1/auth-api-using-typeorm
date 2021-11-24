import { Router } from "express";
import { getAllProduct } from "../controllers/productController";


const router = Router()
router.get("/", getAllProduct)

export default router