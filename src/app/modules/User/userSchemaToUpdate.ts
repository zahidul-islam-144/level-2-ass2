import { ZodError, z } from 'zod';

const PasswordSchema = z
  .string()
  .refine((password) => {
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
  })
  .optional();

const FullNameSchema = z.object({
  firstName: z
    .string()
    .max(20, 'Maximum character limit exceeds.')
    .min(1, "First Name field can't be empty.")
    .optional(),
  lastName: z
    .string()
    .max(20, 'Maximum character limit exceeds.')
    .min(1, "Last Name field can't be empty.")
    .optional(),
});

const AddressSchema = z.object({
  street: z.string().min(1, 'Street cannot be empty').optional(),
  city: z.string().min(1, 'City cannot be empty').optional(),
  country: z.string().min(1, 'Country cannot be empty').optional(),
});

const OrdersSchema = z.object({
  productName: z.string().min(1, 'Product name cannot be empty').optional(),
  price: z
    .number()
    .min(1, 'Product price is needed.')
    .positive('Price must be a positive number')
    .optional(),
  quantity: z
    .number()
    .min(1, 'Minimum single amount of product is expected.')
    .positive('Quantity must be a positive number')
    .optional(),
});

const userSchemaToUpdate = z.object({
  body: z.object({
    userId: z
      .number()
      .int()
      .positive('User Id must be positive digit.')
      .optional(),
    userName: z.string().min(1, 'User name cannot be empty').optional(),
    password: PasswordSchema.optional(),
    fullName: FullNameSchema.optional(),
    age: z
      .number()
      .int("Fractional digit isn't allowed.")
      .positive("Age can't be negative.")
      .min(1, 'Age is required.')
      .optional(),
    email: z
      .string()
      .min(1, { message: 'Email field has to be filled.' })
      .email('This is not a valid email.')
      .optional(),

    isActive: z.boolean().optional(),
    hobbies: z.array(z.string()).nullable().optional(),
    address: AddressSchema.optional(),
    orders: z.array(OrdersSchema).nullable().optional(),
  }),
});

export default userSchemaToUpdate;
