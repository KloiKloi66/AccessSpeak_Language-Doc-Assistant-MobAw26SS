import React, { createContext, useContext, useEffect, useState } from "react";

type Entry = {
  title: string;
  difficulty: string;
  difficultySource: string;
  type: string;
  date: string;
  originalText: string;
  simplifiedText: string;
  translations: Record<string, string>;
  id: number;
};

type DataContextType = {
  entries: Entry[];
  addEntry: (title: string, type: string, date: string, originalText: string, difficulty?: string) => Promise<void>;
  removeEntryById: (id: string) => Promise<void>;
  getEntryById: (id: string) => Entry | undefined;
  cacheSimplifiedText: (id: number, text: string) => Promise<void>;
  cacheTranslation: (id: number, language: string, text: string) => Promise<void>;
  setDifficulty: (id: number, difficulty: string) => Promise<void>;
};

const DataContext = createContext<DataContextType | null>(null);

export const useDocuments = () => {
  const context = useContext(DataContext);
  if (!context) {throw new Error("useDocuments called outside provider")}
  return context;
};

// swap api_url according to your usage
// const API_URL = "http://10.0.2.2:8000"; // Android Emulator
const API_URL = "http://localhost:8000"; // iOS Simulator
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

  const addEntry = async (title: string, type: string, date: string, originalText: string, difficulty?: string) => {
    try {
      const response = await fetch(`${API_URL}/entries`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          type,
          date,
          originalText,
          ...(difficulty ? { difficulty } : {}),
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

  // Persist a generated result on the backend, then mirror it in local state.
  // Local state is updated even if the PATCH fails, so the user still sees
  // the result — it just won't survive an app restart.
  const patchEntry = async (id: number, body: object, localUpdate: (entry: Entry) => Entry) => {
    try {
      await fetch(`${API_URL}/entries/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
    } catch (error) {
      console.error("Failed to patch entry:", error);
    }

    setEntries((prev) =>
      prev.map((entry) => (entry.id === id ? localUpdate(entry) : entry))
    );
  };

  const cacheSimplifiedText = async (id: number, text: string) => {
    await patchEntry(
      id,
      { simplifiedText: text },
      (entry) => ({ ...entry, simplifiedText: text })
    );
  };

  const cacheTranslation = async (id: number, language: string, text: string) => {
    await patchEntry(
      id,
      { translations: { [language]: text } },
      (entry) => ({ ...entry, translations: { ...entry.translations, [language]: text } })
    );
  };

  const setDifficulty = async (id: number, difficulty: string) => {
    await patchEntry(
      id,
      { difficulty },
      (entry) => ({ ...entry, difficulty, difficultySource: "manual" })
    );
  };

  return (
    <DataContext.Provider
      value={{
        entries,
        addEntry,
        removeEntryById,
        getEntryById,
        cacheSimplifiedText,
        cacheTranslation,
        setDifficulty,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}