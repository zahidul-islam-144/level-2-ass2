import argon2 from 'argon2';

export class PasswordStrategy {
  private _userPass: string;
  private _storedHashPass: string;
  private _mode: string;

  constructor(userPass: string = '', storedHashPass: string = '', mode: string) {
    this._userPass = userPass;
    this._storedHashPass = storedHashPass;
    this._mode = mode;
  }

  public async modifiedPassword(): Promise<string | boolean | undefined> {
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

  private async encryptPassword(): Promise<string | undefined> {
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
      return hash ? hash : undefined;
    } catch (error) {
      console.log('---> Argon2 hashing error:', error);
    }
  }

  private async decryptPassword(): Promise<boolean | undefined> {
    try {
      const passwordMatch = await argon2.verify(
        this._storedHashPass,
        this._userPass,
      );
      return passwordMatch ? passwordMatch : false;
    } catch (error) {
      console.error('---> Password verification failed:', error);
    }
  }
}

// resource: https://cryptobook.nakov.com/mac-and-key-derivation/argon2