import { IOrders, IUser } from './userInterface';
import { User } from './userModel';
import CustomError from '../../utils/CustomError';
import { PasswordStrategy } from '../../utils/PasswordStrategy';

const createUserIntoDB = async (userRequestData: IUser) => {
  const isUserExist = await User.isUserExist(userRequestData?.userId);
  const passwordHandler = new PasswordStrategy(
    userRequestData?.password,
    '',
    'HASH',
  );
  const finalPass = await passwordHandler.modifiedPassword();

  const filteredDuplicateHobbies = userRequestData?.hobbies
    ? [...new Set(userRequestData?.hobbies)]
    : [];

  const filteredDuplicateOrders = userRequestData?.orders?.filter(
    (order, index, selfArray) =>
      index ===
      selfArray.findIndex((item) => item.productName === order.productName),
  );

  if (!isUserExist) {
    const { password, hobbies, orders, ...projectedData } = userRequestData;
    const newUser = await User.create({
      ...projectedData,
      password: finalPass,
      hobbies: filteredDuplicateHobbies,
      orders: filteredDuplicateOrders,
    });
    return newUser;
  } else {
    throw new CustomError('User already exists.', 406, []);
  }
};

const getSingleUserByIdFromDB = async (userId: number) => {
  const isUserExist = await User.isUserExist(userId);

  if (isUserExist) {
    const foundUser = await User.findOne({ userId }, { _id: 0 });
    return foundUser;
  } else {
    throw new CustomError('User is not found or registered yet.', 404);
  }
};

const getAllUsersFromDB = async () => {
  const foundUsers = await User.find();
  return foundUsers;
};

const deleteSingleUserByIdFromDB = async (userId: number) => {
  const isUserExist = await User.isUserExist(userId);

  if (isUserExist) {
    const targetUser = await User.deleteOne({ userId });
    return targetUser;
  } else {
    throw new CustomError('User is not found or registered yet.', 404);
  }
};

const updateSingleUserByIdFromDB = async (
  userId: number,
  reqInputData: IUser,
) => {
  const isUserExist = await User.isUserExist(userId);
  const user = await User.findOne({ userId });
  const isVerified = await User.isVerified(userId, reqInputData?.password);
  let updatedPass;

  if (reqInputData?.password && reqInputData?.password?.length > 0) {
    const passwordHandler = new PasswordStrategy(
      reqInputData?.password,
      '',
      'HASH',
    );
    updatedPass = isVerified
      ? user?.password
      : await passwordHandler.modifiedPassword();
    // handle hashing whether password is updated or not. If not updated, then isVerified will be true.
  }

  const duplicateHobbies = (reqInputData?.hobbies || []).filter(
    (newHobby, index) =>
      (reqInputData?.hobbies || []).indexOf(newHobby) !== index,
  );

  const duplicateOrders = reqInputData?.orders?.filter(
    (order, index) =>
      index !==
      (reqInputData?.orders || []).findIndex(
        (item) => item.productName === order.productName,
      ),
  );

  if (
    duplicateHobbies &&
    duplicateHobbies.length > 0 &&
    duplicateOrders &&
    duplicateOrders.length > 0
  ) {
    throw new CustomError(
      'Multiple duplicate items such as hobbies or orders insrted. Please, insert unique item.',
      406,
      [...duplicateHobbies, ...duplicateOrders],
    );
  } else if (duplicateHobbies && duplicateHobbies.length > 0) {
    throw new CustomError('Duplicate hobby added.', 406, duplicateHobbies);
  } else if (duplicateOrders && duplicateOrders.length > 0) {
    throw new CustomError('Duplicate order added.', 406, duplicateOrders);
  } else {
  }

  const addToSetQuery = { hobbies: {} };

  if (duplicateHobbies?.length > 0 || typeof duplicateHobbies === 'undefined') {
    addToSetQuery.hobbies = { $each: [] };
  } else {
    addToSetQuery.hobbies = { $each: reqInputData?.hobbies };
  }

  if (isUserExist) {
    const targetUser = await User.findOneAndUpdate(
      { userId },
      {
        $set: {
          userId: reqInputData?.userId,
          userName: reqInputData?.userName,
          password: updatedPass,
          fullName: {
            firstName: reqInputData?.fullName?.firstName,
            lastName: reqInputData?.fullName?.lastName,
          },
          age: reqInputData?.age,
          email: reqInputData?.email,
          isActive: reqInputData?.isActive,
          address: {
            street: reqInputData?.address?.street,
            city: reqInputData?.address?.city,
            country: reqInputData?.address?.country,
          },
        },
        $addToSet: {
          hobbies: addToSetQuery.hobbies,
          orders: reqInputData?.orders,
        },
      },
      { new: true },
    );
    return targetUser;
  } else {
    throw new CustomError('User is not found or registered yet.', 404);
  }
};

const getAllOrdersOfSingleUserFromDB = async (userId: number) => {
  const isUserExist = await User.isUserExist(userId);

  if (isUserExist) {
    const foundAllOrders = await User.findOne(
      { userId },
      { _id: 0, orders: 1 },
    );
    return foundAllOrders;
  } else {
    throw new CustomError('User is not found or registered yet.', 404);
  }
};

const addOrderByUserIdIntoDB = async (
  userId: number,
  reqInputData: IOrders,
) => {
  const isUserExist = await User.isUserExist(userId);
  const getExistingorders = await User.findOne(
    { userId },
    { orders: { $elemMatch: { productName: reqInputData?.productName } } },
    { orders: { productName: 1 } },
  );
  const isExistOrder =
    getExistingorders?.orders && getExistingorders?.orders?.length > 0
      ? true
      : false;

  if (isUserExist) {
    if (!isExistOrder) {
      const targetUserOrder = await User.updateOne(
        { userId },
        {
          $addToSet: { orders: reqInputData },
        },
      );
      return targetUserOrder;
    } else {
      throw new CustomError(
        'Order has already been created. Try again with different one',
        404,
      );
    }
  } else {
    throw new CustomError(
      'Failed to create order. User is not found or registered yet.',
      404,
    );
  }
};

const getTotalPriceOfSingleUserFromDB = async (userId: number) => {
  const isUserExist = await User.isUserExist(userId);
  if (isUserExist) {
    const getTotalPrice = User.aggregate([
      //stage-1 : find
      { $match: { userId } },
      //stage-2: unwind
      { $unwind: '$orders' },
      //stage-3 : grouping with price
      {
        $group: {
          _id: null,
          totalPrice: {
            $sum: { $multiply: ['$orders.price', '$orders.quantity'] },
          },
        },
      },
      //stage-4 : projects
      { $project: { totalPrice: 1, _id: 0 } },
    ]);
    return getTotalPrice;
  } else {
    throw new CustomError('User is not found or registered yet.', 404);
  }
};

export const userService = {
  createUserIntoDB,
  getSingleUserByIdFromDB,
  getAllUsersFromDB,
  deleteSingleUserByIdFromDB,
  updateSingleUserByIdFromDB,
  getAllOrdersOfSingleUserFromDB,
  addOrderByUserIdIntoDB,
  getTotalPriceOfSingleUserFromDB,
};
