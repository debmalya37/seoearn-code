import mongoose from 'mongoose';

const MONGODB_URI: string = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // This ensures the global.mongoose cache persists across hot reloads in development.
  var mongoose: MongooseCache;
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;








// import mongoose from "mongoose";


// type ConnectionObject = {
//     isConnected?: number
// }


// const connection: ConnectionObject = {}

// async function dbConnect(): Promise<void> {
//     if (connection.isConnected) {
//         console.log("already connected to database")
//         return
//     }
//     if(!connection.isConnected) {
//         console.log("db is not connected")
//     }
//     try {
//         const db = await mongoose.connect(process.env.MONGODB_URI || '', {})

//         connection.isConnected = db.connections[0].readyState

//         console.log("DB connected successfully");
//     } catch (error) {
//         console.log("database connection failed", error);
//         process.exit(1);
//     }
// }

// export default dbConnect;