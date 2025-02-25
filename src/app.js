import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';

import logger from './utils/logger.js';
import { errorHandler } from './middlewares/error.middlewares.js';
import healthCheckRouter from './routes/healthCheck.routes.js';

import registrationLoginRouter from './routes/registrationLogin.routes.js';
import usersRouter from './routes/users.routes.js';
import notificationsRouter from './routes/notifications.routes.js';
import ratingRouter from './routes/rating.routes.js';
import paymentRouter from './routes/payment.routes.js';
import studentRouter from './routes/student.routes.js';
import teacherRouter from './routes/teacher.routes.js';
import adminRouter from './routes/admin.routes.js';
import postRouter from './routes/post.routes.js';


const app = express();
app.use(cors(
  {
    origin: process.env.CORS_ORIGIN,
    credentials: true
  }
));
app.use(express.json({limit: '16kb'}));
app.use(express.urlencoded({extended: true, limit: '16kb'}));
app.use(express.static('public'));
app.use(cookieParser());
const morganFormat = ':method :url :status :response-time ms';
app.use(morgan(morganFormat, {
  stream: {
    write: (message) => {
      const logObject = {
        method: message.split(' ')[0],
        url: message.split(' ')[1],
        status: message.split(' ')[2],
        responseTime: message.split(' ')[3]
      };
      logger.info(JSON.stringify(logObject));
    }
  }
}));

// routes
app.use("/api/v1/healthcheck", healthCheckRouter);
app.use("/api/v1",registrationLoginRouter);
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/notifications", notificationsRouter);
app.use("/api/v1/rating", ratingRouter);
app.use("/api/v1/payment", paymentRouter);
app.use("/api/v1/student", studentRouter);
app.use("/api/v1/teacher", teacherRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/post", postRouter);

app.use(errorHandler);
export { app };