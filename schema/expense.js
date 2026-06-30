import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  amount: { type: Number, required: true },     
  description: { type: String, required: true },
  category: { type: String, required: true },
  TransactionType: { type: String, required: true },
  date: { type: Date, required: true },
});

const Expense = mongoose.model("Expense", expenseSchema);

export default Expense;


