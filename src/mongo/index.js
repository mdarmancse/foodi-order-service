import { connect } from "mongoose";
import { log } from "../helpers";

const connectMongoDB = async () => {
  const dbUrl = process.env.MONGO_URI || "";
  const con = await connect(dbUrl);

  // mongoose.set('debug', true);
  log({
    message: `Connected to MongoDB at ${con.connection.host}:${con.connection.port}`,
    caller: "connectMongoDB",
  });
};

export default connectMongoDB;
