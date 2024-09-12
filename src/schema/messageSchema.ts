import {z} from 'zod';


export const messageSchema = z.object({
    content : z.string().max(300,"content must not exceed 300 characters")
})