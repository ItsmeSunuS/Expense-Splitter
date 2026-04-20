const Expense = require("../models/Expense") 
const mongoose = require("mongoose")

const { calculateBalances, settleDebts } = require("../utils/balanceUtils")

exports.addExpense = async (req, res) => {

try {
const expense = new Expense(req.body)

await expense.save()

res.json(expense)

} catch (error) {

res.status(500).json(error)

}

}

exports.getExpenses = async (req, res) => {
  try {
    console.log("Route hit");
    console.log("Group ID:", req.params.groupId);

    const expenses = await Expense.find({
      groupId: req.params.groupId
    });

    console.log("Expenses found:", expenses.length);

    res.json(expenses);

  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({
      message: "Failed to fetch expenses"
    });
  }
};

exports.getBalances = async (req, res) => {

const expenses = await Expense.find({ groupId: req.params.groupId })

const balances = calculateBalances(expenses)

const settlements = settleDebts(balances)

res.json(settlements)

}
exports.getAllExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find();
    res.json(expenses);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch expenses",
    });
  }
};

module.exports = {
  addExpense: exports.addExpense,
  getExpenses: exports.getExpenses,
  getBalances: exports.getBalances,
  getAllExpenses:exports.getAllExpenses   
};