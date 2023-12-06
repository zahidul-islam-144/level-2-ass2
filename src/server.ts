import mongoose from 'mongoose';
import app from './app';
import config from './app/config';
import { databaseConnection } from './app/config/mongoDB.config';
import CustomResponse from './app/utils/CustomResponse';
import { Request, Response } from 'express';

async function main() {
  try {
    databaseConnection();

    app.listen(config.port, () => {
      console.log(`App is listening on:  http://localhost/${config.port}`);
    });

  } catch (error) {
    console.log('---> Error connecting with server',error);
  }
}

main();
