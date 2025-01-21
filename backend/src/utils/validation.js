import { z } from "zod";

const userRegisterSchema = z.object({
    fullname: z.string().min(1, { message: 'full name is required' }),
    username: z.string().min(1, { message: 'username is required' }),
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(8, { message: 'Password must be at least 8 characters' })
});

const userLoginSchema = z.object({
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(8, { message: 'Password must be at least 8 characters' })
});

const updateUserSchema = z.object({
    fullname: z.string().min(1, { message: 'full name is required' }),
    email: z.string().email({ message: 'Invalid email address' }),
});

const validateRegisterFileds = (userRegisterData) => userRegisterSchema.safeParse(userRegisterData);

const validateLoginFileds = (userLoginData) => userLoginSchema.safeParse(userLoginData);

const validateUpdateFileds = (userUpdateData) => updateUserSchema.safeParse(userUpdateData);

export { validateRegisterFileds, validateLoginFileds, validateUpdateFileds };