
const mongoose = require("mongoose")

const expenseSchema = new mongoose.Schema({

groupId: String, description: String, amount: Number, paidBy: String,

participants: [ { name: String, share: Number } ],

createdAt: { type: Date, default: Date.now }

})

module.exports = mongoose.model("Expense", expenseSchema)