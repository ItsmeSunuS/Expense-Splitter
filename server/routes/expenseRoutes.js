const express = require("express");
const router = express.Router();

router.get("/ping", (req, res) => {
  res.send("Expense route is working");
});

const {
  addExpense,
  getExpenses,
  getBalances
} = require("../controllers/expenseController");

// POST /api/expenses
router.post("/", addExpense);

// GET /api/expenses/balances/:groupId
router.get("/balances/:groupId", getBalances);

// GET /api/expenses/:groupId
router.get("/:groupId", getExpenses);

module.exports = router;