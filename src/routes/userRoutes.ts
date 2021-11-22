import { Router } from "express"
import { register, login, forgetPassword, resetPassword } from "../controllers/authController"
import { protect } from "../middleware/protectRouter"
import { getAllUser } from "../controllers/userController"

const router = Router()

router.post("/register", register)
router.post("/login", login)
router.post("/forgetpassword", forgetPassword)
router.patch("/resetpassword/:token", resetPassword)
router.get("/", protect, getAllUser)

export default router