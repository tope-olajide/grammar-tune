import { ChangeEvent, MutableRefObject } from "react";

const countWords = (text: string) => {
    const words = text.split(" ");
    const filteredWords = words.filter((word) => word.trim() !== "");
    return filteredWords.length;
};

const handlePaste = (e: any,
    editorRef: React.RefObject<HTMLDivElement>,
    setInputWordCount: React.Dispatch<React.SetStateAction<number>>) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text/plain");
    const selection = window.getSelection();
    const range = selection!.getRangeAt(0);
    range.deleteContents();
    const textNode = document.createTextNode(text);
    range.insertNode(textNode);
    range.setStartAfter(textNode);
    range.collapse(true);
    selection!.removeAllRanges();
    selection!.addRange(range);
    setInputWordCount(countWords(editorRef.current!.innerText));
};
  
const handleFileChange = async (e: ChangeEvent<HTMLInputElement>, editorRef: React.RefObject<HTMLDivElement>, setInputWordCount: React.Dispatch<React.SetStateAction<number>>, /* setIsExtractingPDF: React.Dispatch<React.SetStateAction<boolean>> */) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("/api/upload-pdf", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      if (result.success === false) {
        console.log(result.message);
        return alert(result.message);
      }
      editorRef.current!.innerHTML = "";
      editorRef.current!.innerHTML = result.data;
      setInputWordCount(countWords(editorRef.current!.innerText));
    } else {
      alert("Please select a PDF file.");
    }
};
  
const handlePasteClick = async (
    editorRef: React.RefObject<HTMLDivElement>,
    setInputWordCount: React.Dispatch<React.SetStateAction<number>>
  ) => {
    try {
      const text = await navigator.clipboard.readText();
        if (editorRef.current) {
            editorRef.current!.innerText = text
            
            setInputWordCount(countWords(editorRef.current!.innerText));
      }
    } catch (error) {
      console.error("Unable to read clipboard data: ", error);
    }
};
  
 const exportTextAsFile = (text:string, filename = "document.txt") => {
  const blob = new Blob([text], { type: "text/plain" }); 
  const url = URL.createObjectURL(blob); 
  const link = document.createElement("a"); 
  link.href = url; 
  link.download = filename; 
  link.click(); 
  URL.revokeObjectURL(url); 
};
 const copyToClipboard = async (text:string) => {
  try {
    await navigator.clipboard.writeText(text);
    console.log("Text copied to clipboard:", text);
  } catch (err) {
    console.error("Failed to copy text to clipboard:", err);
  }
};

 const countSentences = (text: string) => {
  if (!text || typeof text !== "string") return 0;

  // Match sentences using regular expressions
  const sentences = text.match(/[^.!?]+[.!?]+/g);

  return sentences ? sentences.length : 0;
};

const clearEditorContent = (editorRef: MutableRefObject<HTMLDivElement | null>) => {
  if (editorRef.current) {
    editorRef.current.innerHTML = ""
  }
  
}
export {countWords, handlePaste, handleFileChange, handlePasteClick, exportTextAsFile, copyToClipboard, countSentences, clearEditorContent};