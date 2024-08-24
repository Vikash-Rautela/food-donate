import zod from "zod";

export const signupSchema = zod.object({
    name: zod.string(),
    email: zod.string().email(),
    gender: zod.string(),
    contact: zod.string(),
    address: zod.string(),
    password: zod.string(),
});

export const signinSchema = zod.object({
    email: zod.string().email(),
    password: zod.string(),
});
