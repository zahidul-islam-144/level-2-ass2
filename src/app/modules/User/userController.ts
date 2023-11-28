import { NextFunction, Request, Response } from "express";
import asyncMiddleWare from "../../middlewares/asyncMiddleWare";
import { userService } from "./userService";
import validateUserSchema from "./userValidate";
import { ErrorResponse, ResponseTemplate, handleSafeParse } from "../../utils/templates";
import { IUser } from "./userInterface";
import { SafeParseReturnType, ZodError, ZodParsedType, ZodType } from "zod";

// type TSafeParse<T> =
// | { success: true; data: T }
// | { success: false; error: ZodError };


const createUser = asyncMiddleWare( async (req:Request, res:Response, next:NextFunction) => { 

    const reqBody = req.body;
    const zodParsedData = handleSafeParse<IUser>(reqBody, validateUserSchema);
    const errorObjects = {...zodParsedData.error?.errors}
    console.log('zodparse::',zodParsedData)
  //  if(errorObjects) throw new ErrorResponse(errorObjects, 406)
   return
    const newUser = await userService.createUserIntoDB(reqBody);
    
    if(newUser){
      const sendResponse = new ResponseTemplate(true, 201, 'User created successfully.', newUser);
      res.send(sendResponse).end();
    }
})

const getSingleUserById = asyncMiddleWare( async (req:Request, res:Response, next:NextFunction)=>{
  const { userId } = req.params;
  const foundUser = await userService.getSingleUserByIdFromDB(+userId);

  if(foundUser){
    const sendResponse = new ResponseTemplate(true, 201, 'User fetched successfully!', foundUser);
    res.send(sendResponse).end();
  }

})

const getAllUsers = asyncMiddleWare( async (req:Request, res:Response, next:NextFunction)=>{
  const foundUsers = await userService.getAllUsersFromDB();

  if(foundUsers){
    const sendResponse = new ResponseTemplate(true, 201, 'User fetched successfully!', foundUsers);
    res.send(sendResponse).end();
  }

})

const deleteSingleUserById = asyncMiddleWare( async (req:Request, res:Response, next:NextFunction) => {
  const { userId } = req.params;
  const foundUser = await userService.deleteSingleUserByIdFromDB(+userId);
  
  if(foundUser){
    const sendResponse = new ResponseTemplate(true, 201, 'User deleted successfully!', foundUser);
    res.send(sendResponse).end();
  }

})



export const userController = {
    createUser,
    getSingleUserById,
    getAllUsers,
    deleteSingleUserById
}