require('dotenv').config();
require('express-async-errors');
require('dotenv');

// extra security packages
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimiter = require('express-rate-limit');

const express = require('express');
const app = express();

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

// DB connection
const connectDB = require('./db/connect.js');

// router middlewares
const authRouter = require('./routes/auth.js');
const jobsRouter = require('./routes/jobs.js');
const authUser = require('./middleware/authentication.js');

app.use(express.json());

// security middlewares
app.set('trust proxy', numberOfProxies)
app.use(rateLimiter({ windowMs: 15 * 60 * 1000, max: 100 }));
app.use(helmet());
app.use(cors());
app.use(xss());

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/jobs', authUser, jobsRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();