import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';

const app = express();

const corsOptions = {
    origin: 'http://localhost:3000',
    methods: 'GET, POST, PUT, DELETE',
};

app.use(cors(corsOptions));
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/api', userRoutes);

export default app;