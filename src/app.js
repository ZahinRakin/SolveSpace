import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';

import logger from './utils/logger.js';
import { errorHandler } from './middlewares/error.middlewares.js';
import healthCheckRouter from './routes/healthCheck.routes.js';
import usersRouter from './routes/users.routes.js';
import rootRouter from './routes/root.routes.js'; //under construction.


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
app.use("/api/v1", rootRouter);
app.use("/api/v1/healthcheck", healthCheckRouter);
app.use("/api/v1/users", usersRouter);

app.use(errorHandler);
export { app };