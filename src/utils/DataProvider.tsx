import React, { createContext, useContext, useEffect, useState } from "react";

type Entry = {
  title: string;
  difficulty: string;
  type: string;
  date: string;
  id: number;
};

type DataContextType = {
  entries: Entry[];
  addEntry: (title: string, difficulty: string, type: string, date: string) => Promise<void>;
  removeEntryById: (id: string) => Promise<void>;
  getEntryById: (id: string) => Entry | undefined;
};

const DataContext = createContext<DataContextType | null>(null);

export const useDocuments = () => {
  const context = useContext(DataContext);
  if (!context) {throw new Error("useDocuments called outside provider")}
  return context;
};

// swap api_url according to your usage
const API_URL = "http://10.0.2.2:8000"; // Android Emulator
//const API_URL = "http://localhost:8000"; // iOS Simulator
//const API_URL = "http://<< your-ip >>:8000"; // run on phone in same network 

export function DataProvider({children}: {children: React.ReactNode}) {
  
  const [entries, setEntries] = useState<Entry[]>([]);

  const fetchEntries = async () => {
    try {
      console.log("FETCH START");

      const response = await fetch(`${API_URL}/entries`);
      console.log("STATUS:", response.status);

      const data = await response.json();
      console.log("DATA:", data);

      setEntries(data);
    } catch (error) {
      console.error("Failed to fetch entries:", error);
    }
  };

  useEffect(() => {fetchEntries();}, []);

  const addEntry = async (title: string, difficulty: string, type: string, date: string) => {
    try {
      const response = await fetch(`${API_URL}/entries`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          difficulty,
          type,
          date,
        }),
      });

      const newEntry = await response.json();

      setEntries((previous) => [...previous, newEntry]);
    } catch (err) {
      console.error("Failed to add entry:", err);
    }
  };

  const removeEntryById = async (id: string) => {
    try {
      await fetch(`${API_URL}/entries/${id}`, {
        method: "DELETE",
      });

      setEntries((prev) =>
        prev.filter((entry) => entry.id.toString() !== id)
      );
    } catch (error) {
      console.error("Failed to delete entry:", error);
    }
  };

  const getEntryById = (id: string) => {
    return entries.find((entry) => entry.id.toString() === id);
  };

  return (
    <DataContext.Provider
      value={{
        entries,
        addEntry,
        removeEntryById,
        getEntryById,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}