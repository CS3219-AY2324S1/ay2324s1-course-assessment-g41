import * as mongoose from "mongoose";

export default await mongoose.connect(`${process.env.MONGO_HISTORY}`);
