const {z} = require("zod");

const registerSchema = z.object({
    firstName:z.string({required_error:"First name is required"}).trim(),
    middleName:z.string().trim(),
    lastName:z.string({required_error:"Last name is required"}).trim(),
    email:z.string({required_error:"Email is required"}).email("Invalid email!").trim(),
    phone:z.string({required_error:"Enter valid phone number!"}).trim(),
    password:z.string({required_error:"Enter valid password!"}).min(8,"Password must be at least 8 characters!").trim(),
    isAdmin:z.boolean()
})

const loginSchema = z.object({
    email:z.string({required_error:"Email is required"}).email("Invalid email!").trim(),
    password:z.string({required_error:"Enter valid password!"}).trim()
})

module.exports = {registerSchema,loginSchema};