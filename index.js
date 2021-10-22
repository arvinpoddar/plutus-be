const express = require("express");
const app = express();
const cors = require('cors');

const PORT_NUMBER = process.env.PORT || 5000

const categoryRoutes = require('./routes/categoryRoutes');
// import routes using:
// const moduleName = require ('./routes/moduleName')

// Prevent CORS errors
app.use(cors())
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  next();
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json())


PREFIX_ROUTE = "/users"

app.use(PREFIX_ROUTE, categoryRoutes);
// USE NEW ROUTES WITH app.use(PREFIX_ROUTE, moduleName)

// SUCCESS MESSAGE FOR MAIN APPLICATION ROUTE
app.get("/", (req, res) => {
  res.status(200).send({
    code: 200,
    message: "SUCCESS"
  })
})

// Fall-through 404 error for all non-existent paths
app.use(function (req, res) {
  res.status(404).send({
    code: 404,
    message: "PATH_NOT_FOUND"
  });
});

app.listen(PORT_NUMBER, () => {
  console.log(`Server is running on port ${PORT_NUMBER}.`);
});