import { ErrorResponse, PasswordStrategy } from '../../utils/templates';
import { IUser } from './userInterface';
import { User } from './userModel';
import validateUserSchema from './userValidate';

const createUserIntoDB = async (userRequestData: IUser) => {
  const isUserExist = await User.isUserExist(userRequestData?.userId);
  const passwordHandler = new PasswordStrategy(
    userRequestData?.password,
    '',
    'HASH',
  );
  const finalPass = await passwordHandler.modifiedPassword();

  if (!isUserExist) {
    const newUser = await User.create({
      ...userRequestData,
      password: finalPass,
    });
    return newUser;
  } else {
    throw new ErrorResponse('User already exists.', 406);
  }
};

const getSingleUserByIdFromDB = async (userId: number) => {
  const isUserExist = await User.isUserExist(userId);

  if(isUserExist){
    const foundUser = await User.findOne({ userId });
    return foundUser;
  }else{
    throw new ErrorResponse('User is not found or registered yet.', 404);
  }
}

const getAllUsersFromDB = async () => {
  const foundUsers = await User.find();
  return foundUsers;
}

const deleteSingleUserByIdFromDB = async (userId: number) => {
  const isUserExist = await User.isUserExist(userId);

  if(isUserExist){
    const targetUser = await User.findOneAndDelete({ userId });
    return targetUser;
  }else{
    throw new ErrorResponse('User is not found or registered yet.', 404);
  }
    
}

export const userService = {
  createUserIntoDB,
  getSingleUserByIdFromDB,
  getAllUsersFromDB,
  deleteSingleUserByIdFromDB
};
