import mongoose from "mongoose";

export async function connect() {
  const MONGO_URI = process.env.MONGO_URI;
  if (!MONGO_URI) {
    console.error("MONGO_URI environment variable is not set!");
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGO_URI, {
      // Add options if needed, e.g., useNewUrlParser, useUnifiedTopology
    });

    const connection = mongoose.connection;

    connection.on("connected", () => {
      console.log("MongoDB connected successfully");
    });

    connection.on("error", (err) => {
      console.error(
        "MongoDB connection error. Please make sure MongoDB is running. " + err
      );
      process.exit(1);
    });
  } catch (error) {
    console.error("Something went wrong during MongoDB connection!");
    console.error(error);
    process.exit(1);
  }
}
