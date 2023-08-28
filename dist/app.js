"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const http_errors_1 = __importDefault(require("http-errors"));
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const mongoose_1 = __importDefault(require("mongoose"));
const notes_1 = __importDefault(require("./routes/notes"));
const users_1 = __importDefault(require("./routes/users"));
const app = (0, express_1.default)();
// const server = new ApolloServer({typeDefs, resolvers})
// server.applyMiddleware({ app });
const PASSWORD = process?.env?.DATABASE_PASSWORD;
const MONGO_URL = process.env.DATABASE_URL;
const DB = MONGO_URL.replace("<PASSWORD>", PASSWORD);
// const DB = MONGO_URL.replace("<PASSWORD>", PASSWORD);
mongoose_1.default
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
app.set('views', path_1.default.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
app.use('/notes', notes_1.default);
app.use('/users', users_1.default);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next((0, http_errors_1.default)(404));
});
// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});
exports.default = app;
