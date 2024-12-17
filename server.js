const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const errorHandler = require("./middleware/errorHandler");
const verifyJWT = require("./middleware/verifyJWT");
const cookieParser = require("cookie-parser");
const PORT = process.env.PORT || 3500;

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "/public")));

// Create DB connection
const sequelize  = require("./config/db"); 
sequelize.sync({ force: false }); // Use force: false to avoid dropping tables

sequelize.sync()
  .then(() => {
    console.log('Database synced');
  })
  .catch((error) => {
    console.error('Error syncing database:', error);
  });

//routes
app.get("/", (req, res) => {});
app.use("/auth", require("./routes/auth"));
app.use("/refresh", require("./routes/refresh"));
app.use("/users", require("./routes/users"));
app.use("/branches", require("./routes/branches"));

app.use(verifyJWT);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
