import { Schema, model } from 'mongoose';
import {
  IAddress,
  IFullName,
  IOrders,
  IUser,
  UserModel,
} from './userInterface';
import { PasswordStrategy } from '../../utils/PasswordStrategy';

const FullNameSchema = new Schema<IFullName>({
  firstName: {
    type: String,
    required: [true, "First Name can't be empty."],
    maxLength: [20, 'Maximum character limit exceeds.'],
  },
  lastName: {
    type: String,
    required: [true, "Last Name can't be empty."],
    maxLength: [20, 'Maximum character limit exceeds.'],
  },
});

const AddressSchema = new Schema<IAddress>({
  street: {
    type: String,
    required: [true, 'Street name is important.'],
  },
  city: {
    type: String,
    required: [true, 'City name is important.'],
  },
  country: {
    type: String,
    required: [true, 'Country name is important.'],
  },
});

const OrdersSchema = new Schema<IOrders>({
  productName: {
    type: String,
    required: [true, "Product Name can't be empty."],
  },
  price: {
    type: Number,
    required: [true, 'Product price is needed.'],
  },
  quantity: {
    type: Number,
    required: [true, 'Minimum single amount of product is expected.'],
  },
});

const userSchema = new Schema<IUser, UserModel>({
  userId: {
    type: Number,
    unique: true,
    required: [true, 'User Id is expected.'],
  },
  username: {
    type: String,
    unique: true,
    required: [true, 'User Name is expected.'],
  },
  password: {
    type: String,
    minlength: [5, 'Password length can not be less than 5 characters.'],
    required: [true, 'Password is mandatory.'],
    // select: false,
  },
  fullName: {
    type: FullNameSchema,
    _id: false,
    required: [true, 'Full name is expected.'],
  },
  age: {
    type: Number,
    required: [true, 'Age is required.'],
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'Email is required.'],
  },
  isActive: {
    type: Boolean,
    required: [true, 'Active status is needed.'],
  },
  hobbies: {
    type: Array,
    default: [],
  },
  address: {
    type: AddressSchema,
    _id: false,
    required: [true, 'User address is expected.'],
  },
  orders: {
    type: [OrdersSchema],
    _id: false,
    default: [],
  },
});

//creating a custom static method
userSchema.statics.isUserExist = async function (userId: number) {
  const existingUser = await User.findOne({ userId });
  return existingUser;
};

// checking given password and database stored password are matching or not
userSchema.statics.isVerified = async (userId: number, newPassword: string = '') => {
  const user = await User.findOne({ userId });
  const passwordHandler = new PasswordStrategy(
    newPassword,
    user?.password,
    'VERIFY',
  );
  const finalPass = await passwordHandler.modifiedPassword();
  console.log('---> userModel:', newPassword, finalPass)
  return finalPass;
}

// Approach-1: To remove password
//set password field undefined (cause mongoose document is readonly) when user wil get response after saving data into database.
// userSchema.post<IUser>('save', function (doc, next) {
//     doc.password = '';
//     next();
// });


// Approach-2: To remove password
//To override mongoose object, first converted as JSON object using set() method and then run delete operand to exlcude password field from the response object
userSchema.set('toJSON', {
  transform: function (doc, returnObj) {
    // Removed 'password' field from the returned object
    delete returnObj.password;
    return returnObj;
  },
});


export const User = model<IUser, UserModel>('User', userSchema);
