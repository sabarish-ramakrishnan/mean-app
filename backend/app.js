const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require("path");

const postRoutes = require('./routes/posts');
const userRoutes = require('./routes/users');

const app = express();

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use('/images', express.static(path.join('backend/images')));

mongoose
  .connect('mongodb://127.0.0.1:27017/testdb?gssapiServiceName=mongodb')
  .then(() => {
    console.log('Connected to database.......');
  })
  .catch(() => {
    console.log('Connection failed!!!!!');
  });

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT,PATCH, DELETE, OPTIONS'
  );
  next();
});

// app.use('/api/user/test', (req, res, next) => {
//   res.status(200).json({
//     'test': 'testse'
//   });
// });
app.use('/api/posts', postRoutes);
app.use('/api/user', userRoutes);
module.exports = app;
