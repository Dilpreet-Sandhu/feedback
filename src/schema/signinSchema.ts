import {z} from 'zod';


export const signISchema = z.object({
    identifier : z.string(),
    password : z.string()
})