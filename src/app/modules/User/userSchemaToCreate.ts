import { ZodError, z, ZodIssue } from 'zod';


const FullNameSchema = z.object({
  firstName: z
    .string()
    .max(20, { message: 'Maximum character limit exceeds.' })
    .min(1, { message: "First Name field can't be empty." }),
  lastName: z
    .string()
    .max(20, { message: 'Maximum character limit exceeds.' })
    .min(1, { message: "Last Name field can't be empty." }),
});

const AddressSchema = z.object({
  street: z.string().min(1, { message: 'Street cannot be empty' }),
  city: z.string().min(1, { message: 'City cannot be empty' }),
  country: z.string().min(1, { message: 'Country cannot be empty' }),
});

const OrdersSchema = z.object({
  productName: z.string().min(1, { message: 'Product name cannot be empty' }),
  price: z
    .number()
    .min(1, { message: 'Product price is needed.' })
    .positive({ message: 'Price must be a positive number' }),
  quantity: z
    .number()
    .min(1, { message: 'Minimum single amount of product is expected.' })
    .positive({ message: 'Quantity must be a positive number' }),
});

console.log('---> z.object', z.object);

const userSchemaToCreate = z.object({
  body: z.object({
    userId: z
      .number()
      .int()
      .positive({ message: 'User Id must be positive digit.' }),
    userName: z.string().min(1, { message: 'User name cannot be empty' }),
    password: z
      .string()
      .min(5, { message: 'Password length can not be less than 5 characters.' })
      .max(10, { message: 'password can not exceed 10 characters or more.' }),
    fullName: FullNameSchema,
    age: z
      .number()
      .int({ message: "Fractional digit isn't allowed." })
      .positive({ message: "Age can't be negative." })
      .min(1, { message: 'Age is required.' }),
    email: z
      .string()
      .min(1, { message: 'Email field has to be filled.' })
      .email({ message: 'This is not a valid email.' }),

    isActive: z.boolean(),
    hobbies: z.array(z.string()).nullable(),
    address: AddressSchema,
    orders: z.array(OrdersSchema).nullable().optional(),
  }),
});

export default userSchemaToCreate;

/*
The method .trim() you used in the code snippet will remove the whitespaces from both ends of the string.
If for some reason you want to filter all whitespaces use .transform()

z.string().transform(value => value.replaceAll(" ", ""))

*/
