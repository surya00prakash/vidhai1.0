import mongoose from "mongoose";

interface MongooseCache {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
}

declare global {
    // eslint-disable-next-line no-var
    var _mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = globalThis._mongooseCache ?? {
    conn: null,
    promise: null,
};

if (!globalThis._mongooseCache) {
    globalThis._mongooseCache = cached;
}

export async function connectDB() {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
        throw new Error("MONGODB_URI not defined in environment variables");
    }

    if (cached.conn) return cached.conn;

    if (!cached.promise) {
        cached.promise = mongoose.connect(uri, {
            dbName: "agaram_foundation",
            bufferCommands: false,
        });
    }

    cached.conn = await cached.promise;
    return cached.conn;
}
