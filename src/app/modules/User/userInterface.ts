import { Model } from "mongoose";

export interface IFullName {
    firstName: string;
    lastName: string;
}

export interface IAddress {
    street: string;
    city: string;
    country: string;
}

export interface IOrders {
    productName: string;
    price: number;
    quantity: number;
}

export interface IUser {
    userId: number;
    userName: string;
    password: string;
    fullName: IFullName;
    age: number;
    email: string;
    isActive: boolean;
    hobbies?: string[];
    address: IAddress;
    orders?: IOrders[]
}


export interface UserModel extends Model<IUser> {
    isUserExist(userId: number): Promise<IUser | null>;
    isVerified( userId: number, newPassword: string): Promise<boolean | undefined>;
  }
