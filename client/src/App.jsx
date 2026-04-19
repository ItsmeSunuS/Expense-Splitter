// import { useState } from "react"
// import CreateGroup from "./components/CreateGroup"
// import AddExpense from "./components/AddExpense"
// import BalanceSummary from "./components/BalanceSummary"

// function App() {
//   const [groupId, setGroupId] = useState("")
//   const [members, setMembers] = useState([])

//   return (
//     <div style={{ padding: "20px" }}>
//       <h1>Smart Expense Splitter</h1>

//       {/* Create Group */}
//       <CreateGroup />

//       <hr />

//       {/* Temporary Test Data */}
//       <button
//         onClick={() => {
//           setGroupId("test-group")
//           setMembers(["Rahul", "Aman", "Riya"])
//         }}
//       >
//         Load Test Group
//       </button>

//       <hr />

//       {/* Add Expense */}
//       <AddExpense
//         groupId={groupId}
//         members={members}
//       />

//       <hr />

//       {/* Balance */}
//       <BalanceSummary
//         groupId={groupId}
//       />
//     </div>
//   )
// }

// export default App


import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./components/Dashboard";
import CreateGroup from "./components/CreateGroup";
import BalanceSummary from "./components/BalanceSummary";
import AddExpense from "./components/AddExpense";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/groups" element={<CreateGroup />} />
        <Route path="/expenses/new" element={<AddExpense />} />
        <Route path="/balances" element={<BalanceSummary />} />

        {/* IMPORTANT fallback */}
        <Route path="*" element={<div>Page Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;