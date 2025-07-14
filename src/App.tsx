import { useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";
import { useDarkMode } from "./DarkModeProvider";

function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");
  const { darkMode, toggleDarkMode } = useDarkMode();

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
    setGreetMsg(await invoke("greet", { name }));
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <button
        className="absolute top-4 right-4 px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow hover:bg-gray-300 dark:hover:bg-gray-600 transition"
        onClick={toggleDarkMode}
        aria-label="Toggle dark mode"
      >
        {darkMode ? "🌙 Dark" : "☀️ Light"}
      </button>
      <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">
        Welcome to Tauri + React
      </h1>

      <div className="flex flex-row items-center justify-center gap-8 mb-4">
        <a href="https://vite.dev" target="_blank" rel="noopener noreferrer">
          <img
            src="/vite.svg"
            className="h-20 w-20 transition-transform hover:scale-110"
            alt="Vite logo"
          />
        </a>
        <a href="https://tauri.app" target="_blank" rel="noopener noreferrer">
          <img
            src="/tauri.svg"
            className="h-20 w-20 transition-transform hover:scale-110"
            alt="Tauri logo"
          />
        </a>
        <a href="https://react.dev" target="_blank" rel="noopener noreferrer">
          <img
            src={reactLogo}
            className="h-20 w-20 transition-transform hover:scale-110"
            alt="React logo"
          />
        </a>
      </div>
      <p className="mb-8 text-gray-600 dark:text-white">
        Click on the Tauri, Vite, and React logos to learn more.
      </p>

      <form
        className="flex flex-row items-center gap-4 mb-4"
        onSubmit={(e) => {
          e.preventDefault();
          greet();
        }}
      >
        <input
          id="greet-input"
          className="px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:text-white"
          onChange={(e) => setName(e.currentTarget.value)}
          placeholder="Enter a name..."
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Greet
        </button>
      </form>
      <p className="text-lg text-green-700 font-medium">{greetMsg}</p>
    </main>
  );
}

export default App;
