
exports.calculateBalances = (expenses) => {

const balances = {}

expenses.forEach(expense => {

const { paidBy, participants } = expense

participants.forEach(p => {

if (p.name !== paidBy) {

balances[p.name] = (balances[p.name] || 0) - p.share

balances[paidBy] = (balances[paidBy] || 0) + p.share

}

})

})

return balances

}

exports.settleDebts = (balances) => {

const creditors = [] 
const debtors = [] 
const settlements = []

for (let person in balances) {

if (balances[person] > 0) creditors.push({ name: person, amount: balances[person] })

if (balances[person] < 0) debtors.push({ name: person, amount: -balances[person] })

}

for (let debtor of debtors) {

for (let creditor of creditors) {

if (debtor.amount > 0 && creditor.amount > 0) {

const payment = Math.min( debtor.amount, creditor.amount )

settlements.push({ from: debtor.name, to: creditor.name, amount: payment })

debtor.amount -= payment 
creditor.amount -= payment

}

}

}

return settlements

}