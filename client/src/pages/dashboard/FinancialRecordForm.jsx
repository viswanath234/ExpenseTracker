import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { useFinancialRecords } from "../../contexts/financial-record-context";

export const FinancialRecordForm = () => {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const { addRecord } = useFinancialRecords();

  const { user } = useUser();

  // Function to handle floating labels
  const handleLabel = (e) => {
    const element = e.target;
    const parent = element.closest(".form-field");

    if (element.tagName === "SELECT") {
      const isFirstOption = element.value === "";
      if (isFirstOption) {
        parent.classList.remove("focused");
      } else {
        parent.classList.add("focused");
      }
    } else {
      if (element.value.length > 0 || e.type === "focus") {
        parent.classList.add("focused");
      } else {
        parent.classList.remove("focused");
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newRecord = {
      userId: user?.id ?? new Date().toISOString(),
      date: new Date(),
      description: description,
      amount: parseFloat(amount),
      category: category,
      paymentMethod: paymentMethod,
    };

    addRecord(newRecord);

    console.log(addRecord);

    setDescription("");
    setAmount("");
    setCategory("");
    setPaymentMethod("");
  };

  useEffect(() => {
    // Add focus, blur, and change listeners
    const inputs = document.querySelectorAll(".form-control");
    inputs.forEach((input) => {
      input.addEventListener("focus", handleLabel);
      input.addEventListener("blur", handleLabel);
      input.addEventListener("change", handleLabel);
    });

    // Cleanup listeners on unmount
    return () => {
      inputs.forEach((input) => {
        input.removeEventListener("focus", handleLabel);
        input.removeEventListener("blur", handleLabel);
        input.removeEventListener("change", handleLabel);
      });
    };
  }, []);

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <div className="floating-label">
          <input
            type="text"
            id="description"
            placeholder=" "
            required
            className="floating-input"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <span className="highlight"></span>
          <label htmlFor="description">Description:</label>
        </div>

        <div className="floating-label">
          <input
            type="number"
            required
            className="floating-input"
            id="amount"
            placeholder=" "
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <span className="highlight"></span>
          <label htmlFor="amount">Amount:</label>
        </div>

        <div className="floating-label">
          <select
            required
            className="floating-select"
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value=""></option>
            <option value="Food">Food</option>
            <option value="Rent">Rent</option>
            <option value="Salary">Salary</option>
            <option value="Utilities">Utilities</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Other">Other</option>
          </select>
          <span className="highlight"></span>
          <label htmlFor="category">Category:</label>
        </div>

        <div className="floating-label">
          <select
            required
            className="floating-select"
            id="payment"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option value=""></option>
            <option value="Credit Card">Credit Card</option>
            <option value="Cash">Cash</option>
            <option value="Bank Transfer">Bank Transfer</option>
          </select>
          <span className="highlight"></span>
          <label htmlFor="payment">Payment Method:</label>
        </div>

        <button type="submit" className="button">
          Add Record
        </button>
      </form>
    </div>
  );
};
