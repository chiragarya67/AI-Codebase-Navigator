
const mongoose = require("mongoose");
const dns = require('dns')

dns.setServers([
  '1.1.1.1',
  '8.8.8.8'
])
// Function to connect to MongoDB
const connectDB = async () => {
  try {
    // Try to connect using the URI from our .env file
    const conn = await mongoose.connect(process.env.MONGO_URI);

    // If successful, log the host we connected to
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // If connection fails, log the error and stop the server
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1); // Exit with failure code
  }
};

// Export the function so we can use it in index.js
module.exports = connectDB;
