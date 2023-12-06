import { ZodError, z, ZodIssue } from 'zod';

const PasswordSchema = z.string().refine((password) => {
  const regexPatterns = [
    // {
    //   pattern: /^$|\s+/,
    //   message: 'No white space character is allowed.',
    //   path: ['password']
    // },
    {
      pattern: /[a-z]/,
      message: 'Password must contain at least one lowercase letter',
      path: ['password'],
    },
    {
      pattern: /[A-Z]/,
      message: 'Password must contain at least one uppercase letter',
      path: ['password'],
    },
    {
      pattern: /[0-9]/,
      message: 'Password must contain at least one digit',
      path: ['password'],
    },
    {
      pattern: /[^a-zA-Z0-9]/,
      message: 'Password must contain at least one special character',
      path: ['password'],
    },
    {
      pattern: /^.{6,8}$/,
      message: 'Password must be 6-8 characters long.',
      path: ['password'],
    },
  ];

  const failedAttempts = regexPatterns.reduce((errors: any, pattern) => {
    if (!pattern.pattern.test(password)) {
      errors.push({ message: pattern.message, path: pattern.path });
    }
    return errors;
  }, []);

  if (failedAttempts.length > 0) {
    throw new ZodError(failedAttempts);
  } else {
    return true;
  }
});

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
    password: PasswordSchema,
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
    orders: z.array(OrdersSchema).nullable(),
  }),
});

export default userSchemaToCreate;
