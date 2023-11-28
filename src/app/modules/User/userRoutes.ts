import express from 'express';
import { userController } from './userController';
const userRouter = express.Router();

// authRouter.route("/register").get(register);
userRouter.post("/", userController.createUser);
userRouter.get("/:userId", userController.getSingleUserById);
userRouter.get("/", userController.getAllUsers);
userRouter.delete("/:userId", userController.deleteSingleUserById);



/* 
  user routes connection checking
*/
userRouter.get("/user-router", (req, res) => {
  res.send("Connected to userRouter successfully...200 Ok");
});
  
export default userRouter;