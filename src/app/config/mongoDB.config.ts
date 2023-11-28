import mongoose from "mongoose";
import config from ".";
import { TMongoDBOptions } from "../utils/types";

const uri = config.database_url;

const dbOptions:TMongoDBOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

export const databaseConnection = () => {
  mongoose
    .connect(uri as string)
    .then(() => {
      console.log("Connected to MongoDB Successfully.");
    })
    .catch((error) => {
      console.log("Error connecting with mongoDB.", error);
    });
};

// export default databaseConnection;