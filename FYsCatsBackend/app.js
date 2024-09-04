require('dotenv').config();
require('express-async-errors');
const path = require('node:path');
const express = require('express');
const app = express();
const images = require('./router/image');
const admin = require('./router/admin');
const comments = require('./router/comments')
const user = require('./router/user')
const fileUpload = require('express-fileupload');
const cloudinary = require('cloudinary').v2;
const connectDB = require('./database/connect');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const notFound = require('./Middleware/notfound');
const errorHandler = require('./Middleware/error-handler');

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// Middleware
app.use(cors({
  origin: process.env.FRONTEND,
  credentials: true
}));
app.use(morgan('tiny'));
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload({ useTempFiles: true }));

// API Routes
app.use('/api/v1/images', images);
app.use('/api/v1/admin', admin);
app.use('/api/v1/comments', comments)
app.use('/api/v1/user', user)

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

// Start server
const port = process.env.PORT || 3000;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI).then(() => console.log("connected to database"));
    app.listen(port, () => console.log(`Server is listening on port ${port}...`));
  } catch (error) {
    console.log(error);
  }
};

start();
