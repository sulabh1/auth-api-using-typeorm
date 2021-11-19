import Jwt from "jsonwebtoken"

const signToken = ({ ...payload }) => {
    return Jwt.sign({ payload }, process.env.JWT_SIGNATURE, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}
export default signToken