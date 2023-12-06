import { NextFunction, Request, Response } from 'express';
import { userService } from './userService';
import catchAsync from '../../utils/catchAsync';
import CustomResponse from '../../utils/CustomResponse';

const createUser = catchAsync(async (req, res) => {
  const reqBody = req.body;
  const newUser = await userService.createUserIntoDB(reqBody);

  const customResponse = new CustomResponse(res);
  customResponse.sendResponse({
    statusCode: 201,
    success: true,
    message: 'User created successfully.',
    data: newUser,
  });
});


const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const getAllUsers = await userService.getAllUsersFromDB();
    const haveUsers = getAllUsers?.length > 0 ? true : false;

    const customResponse = new CustomResponse(res);
    customResponse.sendResponse({
      statusCode: haveUsers ? 200 : 404,
      success: haveUsers ? true : false,
      message: haveUsers ? 'User fetched successfully!' : 'No user found.',
      data: haveUsers ? getAllUsers : [],
    });
  },
);


const getSingleUserById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    const foundUser = await userService.getSingleUserByIdFromDB(+userId);

    const customResponse = new CustomResponse(res);
    customResponse.sendResponse({
      statusCode: 200,
      success: true,
      message: 'User fetched successfully!',
      data: foundUser,
    });
  },
);

const deleteSingleUserById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    const foundUser = await userService.deleteSingleUserByIdFromDB(+userId);

    const customResponse = new CustomResponse(res);
    customResponse.sendResponse({
      statusCode: 200,
      success: true,
      message: 'User deleted successfully!',
      data: {},
    });
  },
);

const updateSingleUserById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    const reqBody = req.body;
    const targetUser = await userService.updateSingleUserByIdFromDB(
      +userId,
      reqBody,
    );
    
    if (targetUser) {
      const { _id, password, ...projectedData } = targetUser.toObject(); // excluding _id & password in response
      const customResponse = new CustomResponse(res);
      customResponse.sendResponse({
        statusCode: 201,
        success: true,
        message: 'User updated successfully!',
        data: projectedData,
      });
    }
  },
);

const getAllOrdersOfSingleUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    const foundAllOrders =
      await userService.getAllOrdersOfSingleUserFromDB(+userId);
    const hasAnyOrder: boolean =
      foundAllOrders?.orders && foundAllOrders?.orders?.length > 0
        ? true
        : false;

    const customResponse = new CustomResponse(res);
    customResponse.sendResponse({
      statusCode: hasAnyOrder ? 200 : 404,
      success: hasAnyOrder ? true : false,
      message: hasAnyOrder
        ? 'Order fetched successfully!'
        : 'No Orders found for this user. Kindly, add new order.',
      data: hasAnyOrder ? foundAllOrders : [],
    });
  },
);

const addOrderByUserId = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    const reqBody = req.body;
    const targetUser = await userService.addOrderByUserIdIntoDB(
      +userId,
      reqBody,
    );

    if (targetUser?.modifiedCount) {
      const customResponse = new CustomResponse(res);
      customResponse.sendResponse({
        statusCode: 201,
        success: true,
        message: 'Order created successfully!',
        data: null,
      });
    }
  },
);

const getTotalPriceOfSingleUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    const getTotalPrice =
      await userService.getTotalPriceOfSingleUserFromDB(+userId);
    const hasPrice = getTotalPrice?.length > 0 ? true : false;

    const customResponse = new CustomResponse(res);
    customResponse.sendResponse({
      statusCode: 200,
      success: true,
      message: hasPrice
        ? 'Total price calculated successfully!'
        : 'No Orders found for this user. Kindly, add new order.',
      data: hasPrice ? getTotalPrice[0] : [],
    });
  },
);

export const userController = {
  createUser,
  getSingleUserById,
  getAllUsers,
  deleteSingleUserById,
  updateSingleUserById,
  getAllOrdersOfSingleUser,
  addOrderByUserId,
  getTotalPriceOfSingleUser,
};
