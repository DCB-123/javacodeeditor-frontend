import React, { useState } from "react";
import axios from "axios";

const codeTemplates = {
  "Hello World": `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, world!");
    }
}`,
  "Add Two Numbers": `import java.util.*;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt();
        int b = sc.nextInt();
        System.out.println(a + b);
    }
}`,
  "Factorial": `import java.util.*;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int fact = 1;
        for(int i=1; i<=n; i++) {
            fact *= i;
        }
        System.out.println(fact);
    }
}`
};

function App() {
  const [code, setCode] = useState(codeTemplates["Hello World"]);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const runCode = async () => {
    setLoading(true);
    setOutput("");
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/code/run`,
        { code, input }
      );

      console.log("Backend response:", response.data);

      if (response.data.output) {
        setOutput(response.data.output);
      } else if (typeof response.data === "string") {
        setOutput(response.data);
      } else {
        setOutput(JSON.stringify(response.data, null, 2));
      }
    } catch (error) {
      setOutput("Error running code: " + (error.response?.data || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleTemplateChange = (e) => {
    setCode(codeTemplates[e.target.value]);
    setOutput("");
    setInput("");
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div
      style={{
        backgroundColor: darkMode ? "#121212" : "#f5f5f5",
        color: darkMode ? "#f5f5f5" : "#121212",
        minHeight: "100vh",
        padding: "20px",
        fontFamily: "monospace",
      }}
    >
      <h1>Mini Java Coding Editor</h1>

      <button
        onClick={toggleDarkMode}
        style={{ marginBottom: "50px", cursor: "pointer" }}
      >
        {darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
      </button>

      <div>
        <label htmlFor="template-select">Select Template: </label>
        <select
          id="template-select"
          onChange={handleTemplateChange}
          defaultValue="Hello World"
          style={{ cursor: "pointer" }}
        >
          {Object.keys(codeTemplates).map((key) => (
            <option key={key} value={key}>
              {key}
            </option>
          ))}
        </select>
      </div>

      <textarea
        style={{
          width: "100%",
          height: "250px",
          marginTop: "15px",
          backgroundColor: darkMode ? "#1e1e1e" : "white",
          color: darkMode ? "#f5f5f5" : "#121212",
          fontFamily: "monospace",
          fontSize: "14px",
          padding: "10px",
          borderRadius: "4px",
          border: "1px solid #ccc",
          resize: "vertical",
        }}
        value={code}
        onChange={(e) => setCode(e.target.value)}
        spellCheck="false"
      />

      <div style={{ marginTop: "15px" }}>
        <label htmlFor="input-area">Input (stdin):</label>
        <textarea
          id="input-area"
          style={{
            width: "100%",
            height: "80px",
            marginTop: "5px",
            backgroundColor: darkMode ? "#1e1e1e" : "white",
            color: darkMode ? "#f5f5f5" : "#121212",
            fontFamily: "monospace",
            fontSize: "14px",
            padding: "10px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            resize: "vertical",
          }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter input here, each input on a new line"
          spellCheck="false"
        />
      </div>

      <button
        onClick={runCode}
        disabled={loading}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          fontSize: "16px",
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Running..." : "Run Code"}
      </button>

      <div
        style={{
          marginTop: "20px",
          whiteSpace: "pre-wrap",
          backgroundColor: darkMode ? "#222" : "#eee",
          padding: "15px",
          borderRadius: "4px",
          minHeight: "100px",
          fontFamily: "monospace",
          fontSize: "14px",
        }}
      >
        <strong>Output:</strong>
        <pre>{output}</pre>
      </div>
    </div>
  );
}

export default App;
