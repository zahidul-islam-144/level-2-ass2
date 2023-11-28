import { ZodError } from "zod";

export type TMongoDBOptions = {
    useNewUrlParser: boolean;
    useUnifiedTopology: boolean;
}


export type TSafeParse<T> =
{ success: boolean; data?: T | null, error?: ZodError }