if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express'); // Need to require express.
const path = require('path'); // Use this to connect to our directories outside of the one we're in now.
const mongoose = require('mongoose'); // Need to require mongoose.
// const Joi = require('joi');
const ExpressError = require('./utils/ExpressError');
// const catchAsync = require('./utils/catchAsync');
const engine = require('ejs-mate');
// const gymlocations = require('./models/gymlocations'); // Need this to access GymLocation Model.
// const Review = require('./models/review');
// const gymlocationsRouter = require('./routes/gymlocationsRouter');
// const GymLocation = require('./models/gymlocations');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override') // Need this to send fake PUT requests.
const userRoutes = require('./routes/users')
const gymlocationsRoutes = require('./routes/gymlocations');
const reviewsRoutes = require('./routes/reviews');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require("helmet");
const MongoStore = require('connect-mongo');
const dbUrl = process.env.Db_URL || 'mongodb://localhost:27017/saca-gym'; 


mongoose.connect(dbUrl).
catch(error => handleError(error))
console.log('Database Connected.'); // Ripped this handling error code off the Mongoose website. Also, added a console.log to print out that the db is connected.

const app = express(); // Saved this to call the express function.
app.engine('ejs', engine );
app.set('view engine', 'ejs');  // Setting app.set()
app.set('views', path.join(__dirname, 'views')); // app.set method called to view the views directory

const secret = process.env.SECRET || 'thisshouldbeabettersecret!';

const store = MongoStore.create({
    mongoUrl: dbUrl,
    secret,
    touchAfter: 24 * 60 * 60
});

store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e)
})

const sessionConfig = {
    store,
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(
  helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
  })
);

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(express.urlencoded({ extended: true })); // Need this to parse the POST req.body, and will be used in every request.
app.use(methodOverride('_method')); // need to pass in the query string we want to use and in this case, it's _method.
app.use(express.static(path.join(__dirname, 'public')));

app.use(mongoSanitize());




// Middleware so we don't have to pass anything to our templates
app.use((req, res, next) => {
    if (!['/login', '/'].includes(req.originalUrl)) {
        req.session.returnto = req.originalUrl;
    }
    res.locals.success = req.flash('success'); // We'll have access through this in our templates. 
    res.locals.error = req.flash('error');
    res.locals.signedInUser = req.user;
    next();
})

app.use('/', userRoutes);
app.use('/gymlocations', gymlocationsRoutes);
app.use('/gymlocations/:id/reviews', reviewsRoutes);

app.get('/', (req, res) => {
    res.render('home');
})


app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found!', 404));
} )

//Catch all for any error right now. 
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if(!err.message) err.message = 'OH NO, SOMETHING WENT WRONG!!!!!'
    res.status(statusCode).render('error', { err })
})


const port = process.env.PORT || 90;
app.listen(port, () => {
    console.log(`Serving at http://locahost:${port}`)
})


