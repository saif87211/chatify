import { z } from "zod";

const userSignUpSchema = z.object({
    fullname: z.string().min(1, { message: 'full name is required' }),
    username: z.string().min(1, { message: 'username is required' }),
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(8, { message: 'Password must be at least 8 characters' })
});

const userSignInSchema = z.object({
    username: z.string().min(1, { message: 'username is required' }),
    password: z.string().min(8, { message: 'Password must be at least 8 characters' })
});

const updateUserSchema = z.object({
    fullname: z.string().min(1, { message: 'full name is required' }),
    email: z.string().email({ message: 'Invalid email address' }),
});

const validateSignUpFileds = (userSignUpData) => userSignUpSchema.safeParse(userSignUpData);

const validateSignInFileds = (userSignInData) => userSignInSchema.safeParse(userSignInData);

const validateUpdateFileds = (userUpdateData) => updateUserSchema.safeParse(userUpdateData);

export { validateSignUpFileds, validateSignInFileds, validateUpdateFileds };