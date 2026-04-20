const express = require("express") 
const mongoose = require("mongoose") 
const cors = require("cors") 
require("dotenv").config()

const app = express()

app.use(cors(
  {
  origin: "https://expense-splitter-d978.vercel.app",
    credentials: true,
}));
app.use(express.json())

app.use((req, res, next) => {
  console.log("Incoming request:", req.method, req.url);
  next();
});

mongoose.connect(process.env.MONGO_URI) .then(() => console.log("MongoDB Connected")) .catch(err => console.log(err))

const groupRoutes = require("./routes/groupRoutes") 
const expenseRoutes = require("./routes/expenseRoutes")

app.use("/api/groups", groupRoutes) 
app.use("/api/expenses", expenseRoutes)

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});