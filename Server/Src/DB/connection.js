import mongoose from "mongoose";

const connectionDB = async () => {
  const baseUrl = process.env.MONGODB_URL
    ? process.env.MONGODB_URL
    : "mongodb://127.0.0.1:27017/bookingSystem";
  return mongoose
    .connect(baseUrl)
    .then(() => {
      console.log("Mongo Database Connected");
    })
    .catch((err) => console.log(err));
};
export default connectionDB;
