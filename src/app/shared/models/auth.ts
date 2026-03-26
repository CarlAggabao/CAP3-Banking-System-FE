import { User } from './user';

export interface LoginRequest {
    username: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    user: User;
}

export interface RegisterRequest {
    firstName: string;
    middleName: string;
    lastName: string;
    username: string;
    password: string;
}