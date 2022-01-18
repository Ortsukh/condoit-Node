const express = require('express');
// const session = require('express-session')
const userRouter = require('./routers/user-router');
const errorMiddleware = require('./middlewares/error-middleware');
const articleRouter = require('./routers/article-router');
const tagsRouter = require('./routers/tags-router');
const profileRouter = require('./routers/profile-router.js');
 
// const taskRouter = require('./resources/tasks/tasks.router');
const cors = require('cors');
const cookieParser = require('cookie-parser');
// const { SESSION_KEY } = require('./common/config');
const app = express();

app.use(express.json());
app.use(cookieParser());

const feHost = 
app.use(cors({
  credentials:true,
  origin: process.env.CLIENT_URL,
}));

app.use('/', (req, res, next) => {
  if (req.originalUrl === '/') {
    res.send('Service is running!');
    return;
  }
  next();
});

app.use('/users', userRouter);
app.use('/articles', articleRouter);
app.use('/tags', tagsRouter);
app.use('/profiles',profileRouter);
app.use(errorMiddleware);

module.exports = app;