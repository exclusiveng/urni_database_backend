import express, { Express, Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import hpp from 'hpp';
import xss from 'xss-clean';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import { errorHandler, AppError } from './middleware/error.middleware';
import { Logger } from './utils/logger';

const app: Express = express();

// Security Middleware
app.use(helmet()); // Set security HTTP headers
app.use(cors({
  origin: ['https://urni-database.netlify.app', 'http://localhost:3000', 'http://localhost:5173'],
  credentials: true
})); // Enable CORS
app.use(express.json({ limit: '10kb' })); // Body parser, reading data from body into req.body
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(hpp()); // Prevent parameter pollution
app.use(xss()); // Data sanitization against XSS

import userRoutes from './routes/user.routes';


// Rate Limiting
const limiter = rateLimit({
  max: 100, // Limit each IP to 100 requests per windowMs
  windowMs: 60 * 60 * 1000, // 1 hour
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);

// Routes
app.use('/api/users', userRoutes);
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'success', message: 'Server is healthy' });
});

// Test Error Route (Remove in production)
app.get('/error', (req: Request, res: Response, next: NextFunction) => {
  next(new AppError('Test error', 400));
});

// Handle Undefined Routes
app.all('*', (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global Error Handler
app.use(errorHandler);

export default app;
