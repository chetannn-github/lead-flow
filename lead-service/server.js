import express from 'express';
import cors from 'cors';
import config from './src/config/env.js';
import authMiddleware from './src/middleware/auth.js';
import connectDB from './src/config/db.js';

const app = express();

app.use(express.json());
app.use(cors());


app.get('/api/leads/health', authMiddleware, (req, res) => {
  res.json({
    message: "Node.js Service Auth success!",
    userFromGoToken: req.user
  });
});

app.listen(config.port, async() => {
    await connectDB();
    console.log(`Lead Service (Node.js) live on port ${config.port}`);
});