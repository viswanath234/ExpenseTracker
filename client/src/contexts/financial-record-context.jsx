import { useUser } from "@clerk/clerk-react";
import { createContext, useContext, useEffect, useState } from "react";

export const FinancialRecordContext = createContext(undefined);

export const FinancialRecordProvider = ({ children }) => {
  const [records, setRecords] = useState([]);
  const { user } = useUser();

  const fetchRecords = async () => {
    // if (!user) return;
    try {
      const response = await fetch(
        `http://localhost:3001/financial-records/getAllUsers`
      );

      console.log(response, "response");

      if (response.ok) {
        const records = await response.json();
        console.log(records, "allrecords");
        setRecords(records);
      }
    } catch (err) {
      console.log("no records", err);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [user]);

  const addRecord = async (record) => {
    console.log(record, "record");
    const response = await fetch("http://localhost:3001/financial-records", {
      method: "POST",
      body: JSON.stringify(record),
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log(response, "response");

    try {
      if (response.ok) {
        const newRecord = await response.json();
        setRecords((prev) => [...prev, newRecord]);
      }
    } catch (err) {
      console.error("Error adding record:", err);
    }
  };
  const updateRecord = async (id, newRecord) => {
    console.log(newRecord, "newrecord");
    const response = await fetch(
      `http://localhost:3001/financial-records/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(newRecord),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log(response, "response");

    try {
      if (response.ok) {
        const newRecord = await response.json();
        setRecords((prev) =>
          prev.map((record) => {
            if (record._id === id) {
              return newRecord;
            } else {
              return record;
            }
          })
        );
      }
    } catch (err) {
      console.error("Error adding record:", err);
    }
  };

  const deleteRecord = async (id) => {
    const response = await fetch(
      `http://localhost:3001/financial-records/${id}`,
      {
        method: "DELETE",
      }
    );
    try {
      console.log(response, "response");

      if (response.ok) {
        const deleteRecord = await response.json();
        setRecords((prev) =>
          prev.filter((record) => record._id !== deleteRecord._id)
        );
      }
    } catch (err) {
      console.error("Error adding record:", err);
    }
  };

  return (
    <FinancialRecordContext.Provider
      value={{ records, addRecord, updateRecord, deleteRecord }}
    >
      {children}
    </FinancialRecordContext.Provider>
  );
};

export const useFinancialRecords = () => {
  const context = useContext(FinancialRecordContext);

  if (!context) {
    throw new Error(
      "useFinancialRecords must be used within a FinancialRecordsProvider"
    );
  }

  return context;
};
