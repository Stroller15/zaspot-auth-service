import { Request } from "express";

export interface userData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: string;
}
export interface RegisterUserRequest extends Request {
    body: userData;
}
