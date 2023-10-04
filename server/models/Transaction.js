import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema(
  {
    userId: String,
    cost: String, // cost should be a number but we're using string for now
    products: {
        type: [mongoose.Types.ObjectId],
        of: Number
    }
  }, { timestamps: true}
);

const Transaction = mongoose.model("Transaction", TransactionSchema);
export default Transaction;
