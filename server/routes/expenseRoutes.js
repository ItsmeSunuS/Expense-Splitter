const express = require("express");
const router = express.Router();


const {
  addExpense,
  getExpenses,
  getBalances,
  getAllExpenses
} = require("../controllers/expenseController");

// POST /api/expenses
router.post("/", addExpense);

// GET /api/expenses/balances/:groupId
router.get("/balances/:groupId", getBalances);

// GET /api/expenses/:groupId
router.get("/:groupId", getExpenses);

router.get("/", getAllExpenses);

module.exports = router;