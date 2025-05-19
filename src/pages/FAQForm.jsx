import { useState } from "react";
import { pdfjs } from 'react-pdf'
import pdfWorkerURL from 'pdfjs-dist/build/pdf.worker.min?url'
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
  });

const FAQForm = ({ onGenerate, onClear }) => {
    const [input, setInput] = useState("");
    const [isLoading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!input){return}

        const trimmedInput = input.trim();
        const sentenceCount = trimmedInput.match(/[.?!]\s|[.?!]$/g)?.length || 0;

        if (trimmedInput.length < 100 || sentenceCount < 3) {
            setErrorMsg("⚠️ Please paste a full document (at least 100 characters and 3 sentences).");
            return;
        }


        setErrorMsg("");
        setLoading(true);


        const prompt = `Generate the most important question-and-answer minimum 5 pairs based on the following content:\n\n${input}`;
        try {
            const res = await openai.chat.completions.create({
              model: "gpt-3.5-turbo", // or "gpt-4"
              messages: [{ role: "user", content: prompt }],
            });
        
            const output = res.choices[0].message.content;
            setLoading(false);
            onGenerate(output);
          } catch (err) {
            console.error("OpenAI API error:", err);
            setErrorMsg("Something went wrong. Please try again.");
          }

    }

    const handleFile = async (file) => {
        document.querySelector("#dropzone").innerText = file.name;
        onClear();
       
        const reader = new FileReader();

        if (file.type === "application/pdf") {
            pdfjs.GlobalWorkerOptions.workerSrc = new URL(pdfWorkerURL, import.meta.url).toString()
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            let fullText = "";
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const content = await page.getTextContent();
                const pageText = content.items.map((item) => item.str).join(" ");
                fullText += pageText + "\n";
            }
            setInput(fullText);
        } else if (file.type === "text/plain") {
            reader.onload = (e) => setInput(e.target.result);
            reader.readAsText(file);
        } else {
            alert("Unsupported file type. Please upload a .txt, .pdf, or .docx file.");
        }

    };



    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-black text-white">
            <h1 className="text-3xl font-bold mb-6 text-center">AI-Powered FAQ Generator</h1>

            <form onSubmit={handleSubmit} className="flex justify-items-center w-full flex-col items-center gap-4 ">
                <div
                    className="w-full max-w-2xl p-6 border-2 border-dashed border-gray-500 rounded text-center mb-4 cursor-pointer"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                        e.preventDefault();
                        const file = e.dataTransfer.files[0];
                        if (file) handleFile(file);
                    }}
                    
                    onClick={() => document.getElementById("fileUpload").click()}
                >
                
                    <span id="dropzone">📄 Drag & drop a .txt or .pdf file here or click to upload</span>
                    <input
                        type="file"
                        id="fileUpload"
                        accept=".txt,.md,.pdf"
                        className="hidden"
                        onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) handleFile(file);
                        }}
                    />
                </div>
                <textarea
                    onChange={(e) => setInput(e.target.value)}
                    className="p-2 border border-gray-300 w-1/2 rounded"
                    placeholder="Enter your document here..."
                    rows="6"
                ></textarea>
                {errorMsg && (
                <p className="text-red-400 text-sm text-center">{errorMsg}</p>
                )}
                <button
                    type="submit"
                    
                    className={`bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 cursor-pointer`}
                >
                    Generate FAQs
                </button>
                {isLoading && (
                <p className="text-blue-400 text-sm text-center animate-pulse">
                    Generating FAQs...
                </p>
                )}
            </form>
        </div>
    );
};

export default FAQForm;