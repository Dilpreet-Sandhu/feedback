import {z} from 'zod';


export const acceptMessageScheam = z.object({
    acceptMessage : z.boolean(),
})