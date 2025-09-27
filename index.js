import express from "express";
import connectDb from "./db/db.js";
import Expense from "./schema/expense.js";
import Lend from "./schema/lend.js"
import Wallet from "./schema/wallet.js";
import User from "./schema/newUser.js"
import cors from "cors";


const app = express();
const PORT = 8080;


app.use(cors({
  credentials: true,
}));

app.use(express.json());


app.get("/", (req, res) => {
  res.send("✅ Backend API is working!");
  console.log(req.session)
  console.log(req.sessionID)
});



app.get("/api/test", async (req, res) => {
  try {
    const definition = await Expense.find({
      $expr: {
        $and: [
          { $eq: [{ $month: "$date" }, 3] },
          { $eq: [{ $year: "$date" }, 2025] }
        ]
      }
    }); 
    res.json({definition});
  }
  catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});


// Endpoint to get all expenses for a specific user
app.get("/totalExpense", async (req, res) => {
  const { month, year } = req.query;

  let matchStage = {};
  if (month && year) {
    matchStage = {
      $expr: {
        $and: [
          { $eq: [{ $month: "$date" }, Number(month)] },
          { $eq: [{ $year: "$date" }, Number(year)] }
        ]
      }
    };
  }

  try {
    const total = await Expense.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" },
        }
      }
    ]);
    res.json({ totalExpense: total[0]?.totalAmount || 0 });
  } catch (err) {
    console.error("Aggregation error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


app.post("/authenticateLogin", async (req, res) => {

  if(!req.body.UserName || !req.body.password) {
    return res.status(401).json({error : "Missing Fields" })
  }

  const { UserName , password } = req.body;
  console.log("Received Body: ", req.body);

  try {
    const NewUser = await User.find({"UserName" : UserName , "Password" : password})
     
    return res.status(200).json({newUser : NewUser})
  } 
  
  catch (error) {
    console.error("Authentication error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }

});



app.post("/newUser" , async (req , res) => {

  const {Username , Email , Password , date} = req.body 
  console.log("Request Body: " , req.body)

  if ( !Username || !Email || !Password|| !date) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const NewUsers = await NewUser.create({ Username, Email, Password, date});
    return res.status(201).json({ UserTable: NewUsers });
  } catch (err) {
    console.error("Server Error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }

})


// Endpoint to get all expenses for a specific user
app.get("/totalLend", async (req, res) => {
  const { month, year } = req.query;

  let matchStage = {};
  if (month && year) {
    matchStage = {
      $expr: {
        $and: [
          { $eq: [{ $month: "$date" }, Number(month)] },
          { $eq: [{ $year: "$date" }, Number(year)] }
        ]
      }
    };
  }

  try {
    const total = await Lend.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" },
        }
      }
    ]);
    res.json({ totalLent: total[0]?.totalAmount || 0 });
  } catch (err) {
    console.error("Aggregation error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


// Endpoint to get all expenses for a specific user
app.get("/walletamt", async (req, res) => {
  const { month, year } = req.query;
  let matchStage = {};
  if (month && year) {
    matchStage = {
      $expr: {
        $and: [
          { $eq: [{ $month: "$date" }, Number(month)] },
          { $eq: [{ $year: "$date" }, Number(year)] }
        ]
      }
    };
  }

  try {
    const total = await Wallet.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$Amount" },
        }
      }
    ]);
    res.json({ totalWalletAmt: total[0]?.totalAmount || 0 });
  } catch (err) {
    console.error("Aggregation error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


// index.js or your server file
app.post("/expenses", async (req, res) => {
  const { userId, amount, description, category, date, TransactionType} = req.body;
  console.log("Request Body:", req.body);  // Log the incoming body to check if it's correct

  if (!userId || !amount || !description || !category || !date) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const newExpense = await Expense.create({ userId, amount, description, category , date , TransactionType});
    return res.status(201).json({ expense: newExpense });
  } catch (err) {
    console.error("Server Error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});


// index.js or your server file
app.post("/lend", async (req, res) => {
  const { From, amount, description, To, date }  = req.body;
  console.log("Request Body:", req.body);  // Log the incoming body to check if it's correct

  if (!From || !amount || !description || !To|| !date) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const newBorrow = await Lend.create({ From, amount, description, date , To});
    return res.status(201).json({ Borrow: newBorrow });
  } catch (err) {
    console.error("Server Error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/wallet" , async(req , res) => {
  const { Amount, Bearer_Name ,Vendor_Catagory , Vendor_Name, date , Income_As}  = req.body;
  console.log("Request Body:", req.body);  // Log the incoming body to check if it's correct

  if (!Amount|| !Bearer_Name || !Vendor_Catagory || !Vendor_Name|| !date || !Income_As) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const newWallet = await Wallet.create({ Amount, Bearer_Name , Vendor_Name, Vendor_Catagory , date , Income_As});
    return res.status(201).json({ Wallet_details: newWallet });
  } catch (err) {
    console.error("Server Error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
})  


// Get expenses by month and year
app.get("/expensesByMonth", async (req, res) => {
  const { month, year } = req.query; // month: 1-12, year: 2024, etc.

  if (!month || !year) {
    return res.status(400).json({ error: "Month and year are required" });
  }

  // Calculate start and end of the month
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 1);

  console.log(start , end);

  try {
    const expenses = await Expense.find({
      date: { $gte: start, $lt: end }
    });
    res.json({ expenses });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});




// Get expenses by month and year
app.get("/IncomeByMonth", async (req, res) => {
  const { month, year } = req.query; // month: 1-12, year: 2024, etc.

  if (!month || !year) {
    return res.status(400).json({ error: "Month and year are required" });
  }

  // Calculate start and end of the month
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 1);

  try {
    const wallet = await Wallet.find({
      date: { $gte: start, $lt: end }
    });
    res.json({ wallet });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});



app.listen(PORT, () => {
  connectDb(); // ✅ connect MongoDB here
  console.log(`🚀 Backend running at http://localhost:${PORT}`);
});
