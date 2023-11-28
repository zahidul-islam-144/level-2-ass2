import argon2 from 'argon2';
import { ZodError, ZodType } from 'zod';
import { TSafeParse } from './types';

// response template
export class ResponseTemplate {
  success: boolean;
  status: number;
  messages: string;
  data: any;

  constructor(
    success: boolean,
    status: number,
    messages: string,
    data: any = null,
  ) {
    this.success = success;
    this.status = status;
    this.messages = messages;
    this.data = data;
  }
}

//custom error response template
export class ErrorResponse extends Error {
  statusCode: number;

  constructor(message: any, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

// PasswordMechanism template
// resource: https://cryptobook.nakov.com/mac-and-key-derivation/argon2
export class PasswordStrategy {
  private _userPass: string;
  private _storedHashPass: string;
  private _mode: string;

  constructor(userPass: string, storedHashPass: string = '', mode: string) {
    this._userPass = userPass;
    this._storedHashPass = storedHashPass;
    this._mode = mode;
  }

  public async modifiedPassword(): Promise<string | boolean | void> {
    switch (this._mode) {
      case 'HASH':
        const hashed = await this.encryptPassword();
        return hashed;
        break;
      case 'VERIFY':
        const isVerified = await this.decryptPassword();
        return isVerified;
      default:
        break;
    }
  }

  private async encryptPassword(): Promise<string | void> {
    const options = {
      type: argon2.argon2id,
      hashLength: 128,
      timeCost: 5,
      memoryCost: 4096,
      parallelism: 5,
      saltLength: 32,
    };
    try {
      const hash = await argon2.hash(this._userPass, options);
      return hash;
    } catch (error) {
      console.log('---> Argon2 hashing error:', error);
      return;
    }
  }

  private async decryptPassword(): Promise<boolean | void> {
    try {
      const passwordMatch = await argon2.verify(
        this._storedHashPass,
        this._userPass,
      );
      return passwordMatch;
    } catch (error) {
      console.error('---> Password verification failed:', error);
      return;
    }
  }
}


// handle safeParse type issue: cause ts can't infer proper type for safeParseReturn type
export const handleSafeParse = <T>(
  _reqBody: any,
  schema: ZodType<T>,
): TSafeParse<T> => {
  try {
    const parsedData = schema.parse(_reqBody);
    return { success: true, data: parsedData };
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, error };
    } else {
      throw error;
    }
  }
};
