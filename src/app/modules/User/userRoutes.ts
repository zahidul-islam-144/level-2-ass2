import express from 'express';
import { userController } from './userController';
import userSchemaToUpdate from './userSchemaToUpdate';
import userSchemaToCreate from './userSchemaToCreate';
import requestValidationMiddleware from '../../middlewares/requestValidationMiddleware';
const userRouter = express.Router();
const {
  createUser,
  getSingleUserById,
  getAllUsers,
  deleteSingleUserById,
  updateSingleUserById,
  getAllOrdersOfSingleUser,
  addOrderByUserId,
  getTotalPriceOfSingleUser,
} = userController;

// authRouter.route("/register").get(register);
userRouter.post(
  '/',
  requestValidationMiddleware(userSchemaToCreate),
  createUser,
);
userRouter.get('/', getAllUsers);
userRouter.get('/:userId', getSingleUserById);
userRouter.delete('/:userId', deleteSingleUserById);
userRouter.put(
  '/:userId',
  requestValidationMiddleware(userSchemaToUpdate),
  updateSingleUserById,
);
userRouter.get('/:userId/orders', getAllOrdersOfSingleUser);
userRouter.put(
  '/:userId/orders',
  requestValidationMiddleware(userSchemaToUpdate),
  addOrderByUserId,
);
userRouter.get('/:userId/orders/total-price', getTotalPriceOfSingleUser);

export default userRouter;
