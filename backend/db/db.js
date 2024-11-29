import mongoose from "mongoose";

const connectDB = async()=>{
    try {
        const mongooseConnect = await mongoose.connect(process.env.MONGO_DB_URI)
        console.log('Connected to MongoDB:', mongooseConnect.connection.host)
    } catch (error) {
        console.log('Error Connecting To MongoDB:', error)
    }
}

export default connectDB