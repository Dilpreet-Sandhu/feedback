import {z} from 'zod';


export const verifySchema = z.object({
    code : z.string().length(6,"verify code should be of 6 digits")
})