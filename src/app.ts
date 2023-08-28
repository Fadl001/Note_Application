import dotenv from 'dotenv';
dotenv.config();
import createError from 'http-errors';
import express,{ Request, Response, NextFunction } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import mongoose from 'mongoose';
import { ApolloServer, gql } from 'apollo-server-express';


import noteRouter from './routes/notes';
import usersRouter from './routes/users';
import { typeDefs, resolvers } from './schema';

const app = express();

// const server = new ApolloServer({typeDefs, resolvers})
// server.applyMiddleware({ app });


const PASSWORD = process?.env?.DATABASE_PASSWORD as string;
const MONGO_URL = process.env.DATABASE_URL as string;
const DB = MONGO_URL.replace("<PASSWORD>", PASSWORD);
// const DB = MONGO_URL.replace("<PASSWORD>", PASSWORD);
mongoose
  .connect(DB)
  .then(() => {
    console.log("Server Connected to MongoDB");
    // startServer();
  })
  .catch((error) => {
    console.log(error);
  });
// mongoose.connect(process.env.DATABASE_URL!, {
//   useNewUrlParser: true })
//   const db = mongoose.connection
//   db.on('error', error => console.log(error))
//   db.once('open', () => console.log('Connected to Mongoose'))



// mongoose.connect(process.env.DATABASE_URL!, ()=>{
//   console.log("Database connected successfully");
// })
// const DATABASE_URL = process.env.DATABASE as string;
// const DATABASE_PASSWORD = process.env.PASSWORD as string;

// mongoose.connect(DATABASE_URL);

// const DB = DATABASE_URL.replace('<PASSWORD>', DATABASE_PASSWORD);

// mongoose
// .connect(DB)
// .then(()=>{
//   console.log("Database connected successfully");
// }).catch(()=>{
//   console.log("an error occured while connecting to database");
// });


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/notes', noteRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req:Request, res:Response, next:NextFunction) {
  next(createError(404));
});

// error handler
app.use(function(err:createError.HttpError, req:Request, res:Response, next:NextFunction) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app;
