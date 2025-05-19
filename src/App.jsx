// src/App.jsx
import { useState } from "react";
import { FAQForm, FAQList } from "./pages/index.js";

function App() {
  const [faqData, setFaqData] = useState([]);
  const handleGeneratedFAQs = (output) => {
    setFaqData(output);
  
    setTimeout(() => {
      const target = document.getElementById("answers");
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }, 100); // slight delay ensures component renders first
  };

  const handleClear = () => {
    setFaqData([]);
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <FAQForm  onGenerate={handleGeneratedFAQs} onClear={handleClear}/>
      <FAQList  data={faqData} />
    </main>
  );
}

export default App;
