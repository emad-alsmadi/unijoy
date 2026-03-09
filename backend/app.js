require('dotenv').config();

const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const multer = require('multer'); // Re-added for image upload to external services
const cron = require('node-cron');

const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');
const eventManagementRoutes = require('./routes/event-management');
const hallRoutes = require('./routes/hall');
const hostCategoriesRoutes = require('./routes/hostCategory');
const eventRoutes = require('./routes/event');
const userRoutes = require('./routes/user');
const profileRoutes = require('./routes/profile');
const reportRoutes = require('./routes/report');

const User = require('./models/user');

const MONGODB_URI =
  process.env.MONGODB_URI ||
  process.env.MONGO_URL ||
  'mongodb://127.0.0.1:27017';

const PORT = Number(process.env.PORT) || 8080;

const app = express();

// const store = new MongoDBStore({
//   uri: MONGODB_URI,
//   collection: 'sessions'
// });
// const csrfProtection = csrf();

// File upload configuration for memory storage (will be uploaded to external services)
const fileStorage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// CORS: place before any body parsers so headers are included even on parser errors
app.use((req, res, next) => {
  const frontendOrigin =
    process.env.FRONTEND_ORIGIN || process.env.FRONTEND_BASE_URL || '';

  if (frontendOrigin) {
    res.setHeader('Access-Control-Allow-Origin', frontendOrigin);
    res.setHeader('Vary', 'Origin');
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }

  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE, OPTIONS'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(bodyParser.json({ limit: '10mb' }));
// Multer configuration for memory storage (files will be uploaded to external services)
app.use(
  multer({
    storage: fileStorage,
    fileFilter: fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  }).single('image')
);
// app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/admin', adminRoutes);
app.use('/host', eventManagementRoutes);
app.use('/auth', authRoutes);
app.use('/halls', hallRoutes);
app.use('/host-categories', hostCategoriesRoutes);
app.use('/events', eventRoutes);
app.use('/users', userRoutes);
app.use('/profile', profileRoutes);
app.use('/reports', reportRoutes);

// app.use(
//   session({
//     secret: 'my secret ',
//     resave: false,
//     saveUninitialized: false,
//     store: store
//   })
// );
// app.use(csrfProtection);
// app.use(flash());

// app.use((req, res, next) => {
//   res.locals.isAuthenticated = req.session.isLoggedIn;
//   res.locals.csrfToken = req.csrfToken();
//   next();
// });

// app.use((req, res, next) => {
//   if (!req.session.user) {
//     return next();
//   }
//   User.findById(req.session.user._id)
//     .then(user => {
//       if(!user){
//         return next();
//       }
//       req.user = user;
//       next();
//     })
//     .catch(err => {
//       next(new Error(err));
//     });
// });

// app.use('/admin', adminRoutes.routes);
// app.use(shopRoutes);
// app.use(authRoutes);

// app.get('/500', errorController.get500);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    app.listen(PORT);

    require('./jobs/freeExpiredHalls');
  })
  .catch((err) => console.log(err));
