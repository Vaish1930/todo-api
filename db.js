import mongoose from "mongoose";

const connectDb = async () => {
  try {
    const dbURI = `mongodb+srv://root:XDjNzuDUHEg9cfxu@cluster0.elley.mongodb.net/toDoList?retryWrites=true&w=majority`;
    const conn = await mongoose.connect(dbURI, { autoIndex: false });
    console.log(`mongodb connected ${conn.connection.host}`);
  } catch (error) {
    console.log(`error connecting database ${error}`);
  }
};

export default connectDb;
