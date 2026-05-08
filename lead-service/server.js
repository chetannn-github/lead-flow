import express from 'express';
import cors from 'cors';
import config from './src/config/env.js';
import authMiddleware from './src/middleware/auth.js';
import leadRoutes from './src/routes/lead.route.js'
import connectDB from './src/config/db.js';

const app = express();

app.use(express.json());
app.use(cors());


app.get('/api/leads/health', authMiddleware, (req, res) => {
  res.json({
    message: "Node.js Service Auth success!",
    user: req.user
  });
});

app.use('/api/leads',authMiddleware, leadRoutes);

app.listen(config.port, async() => {
    await connectDB();
    console.log(`Lead Service (Node.js) live on port ${config.port}`);
});