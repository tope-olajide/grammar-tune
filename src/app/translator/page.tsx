
"use client"

import ContentEditable from "@/components/editor/ContentEditable";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { SyntheticEvent, useRef, useState } from "react";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Slider from '@mui/material/Slider';
import { clearEditorContent, copyToClipboard, countSentences, countWords, exportTextAsFile, handleFileChange, handlePasteClick } from "../utils/commonFunctions";
import PublishIcon from "@mui/icons-material/Publish";
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ProcessingAnimation from "@/components/ProcessingAnimation";
import SideBar from "@/components/SideNavigationBar";
import Footer from "@/components/Footer";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import IconButton from "@mui/material/IconButton";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { llama3TranslationLanguages } from "../utils/llama3TranslationLanguages";
import AiModelSelector from "@/components/AiModelSelector";

const Translator = () => {
    const [tabValue, setTabValue] = useState('Normal');
    const inputEditorRef = useRef<HTMLDivElement | null>(null);
    const outputEditorRef = useRef<HTMLDivElement | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [inputWordCount, setInputWordCount] = useState(0);
    const placeholder = "Enter or paste your text and press Translate"
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [isExtractingPDF, setIsExtractingPDF] = useState(false);
    const [numberOfSentences, setNumberOfSentences] = useState(0);
    const [numberOfWords, setNumberOfWords] = useState(0);
    const [translateFromLanguage, setTranslateFromLanguage] = useState("Detect Language");
    const [translateToLanguage, setTranslateToLanguage] = useState("English");
    const [aiModel, setAiModel] = useState("MetaLlama-31-405B-Instruct");



    const handleEditorChange = () => {

        setInputWordCount(countWords(inputEditorRef.current!.innerText));
    };
    const handlePDFUpload = async (e) => {
        setIsExtractingPDF(true)
        await handleFileChange(e, inputEditorRef, setInputWordCount)
        setIsExtractingPDF(false)
    }

    const translateText = async () => {
        setIsProcessing(true);
        try {
            const response = await fetch("/translator/api/", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: inputEditorRef.current?.textContent, translateFromLanguage, translateToLanguage, aiModel }),
            });
            const data = await response.json();
            console.log({ result: data.result });
            outputEditorRef.current!.innerHTML = data.result;
            setNumberOfSentences(countSentences(data.result));
            setNumberOfWords(countWords(data.result));
            setIsProcessing(false);
        } catch (error) {
            setIsProcessing(false);
            console.error('Error:', error);
        }


    }
    const handleCopy = async () => {
        const text = outputEditorRef.current?.textContent;
        if (text?.trim()) {
            await copyToClipboard(text);
            alert("Text copied to clipboard!");
        }
    };

    const handleExport = () => {
        const text = outputEditorRef.current?.textContent;
        if (text) {
            exportTextAsFile(text, "MyTextFile.txt");
        }
    };
    const handleClearEditor = () => {
        clearEditorContent(inputEditorRef)
        clearEditorContent(outputEditorRef)
    }

    return (
        <>
            <SideBar pageTitle="Translator">
                {isExtractingPDF || isProcessing ? <ProcessingAnimation /> : null}
                <Paper elevation={2}
                    sx={{
                        width: "90%",
                        minHeight: 450,
                        margin: "50px auto",
                        borderTopLeftRadius: 10,
                        borderTopRightRadius: 10,
                        borderBottomLeftRadius: 0,
                        borderBottomRightRadius: 0,
                    }}
                >
                    <Box sx={{  width: "100%", borderBottom: "1px solid rgba(0,0,0,0.1)", px: 1, overflowX: "auto", display: "flex", justifyContent: "space-around", alignItems: "center", flexWrap:"wrap"}}>
                    
                        <Box sx={{ minWidth: 250 }}>
                      <FormControl fullWidth margin="normal" size="small">
                            <InputLabel id="translate-from-label">Translate From</InputLabel>
                            <Select
                                labelId="translate-from-label"
                                value={translateFromLanguage}
                                onChange={(e) => setTranslateFromLanguage(e.target.value)}
                                label="Translate From"
                            >
                                {llama3TranslationLanguages.map((language) => (
                                    <MenuItem key={language} value={language}>
                                        {language}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>       
                        </Box>
                        <Box sx={{minWidth:250}}> <AiModelSelector aiModel={aiModel} setAiModel={setAiModel} /> </Box>
                        <Box sx={{minWidth:250}}>
                      <FormControl fullWidth margin="normal" size="small">
                            <InputLabel id="translate-from-label">Translate To</InputLabel>
                            <Select
                                labelId="translate-from-label"
                                value={translateToLanguage}
                                onChange={(e) => setTranslateToLanguage(e.target.value)}
                                label="Translate From"
                            >
                                {llama3TranslationLanguages.map((language) => (
                                    <MenuItem key={language} value={language}>
                                        {language}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>       
                        </Box>
                       

                       {/*  <IconButton aria-label="delete" size="large" onClick={handleClearEditor}>
                            <DeleteForeverIcon />
                        </IconButton> */}


                    </Box>
                    <Box sx={{
                        display: "flex", flexDirection: {
                            xs: "column",
                            sm: "row"
                        }, minHeight: 400
                    }}>
                        <Box sx={{ width: "100%", height: "100%", position: "relative", borderBottom: { xs: "1px solid rgba(0,0,0,0.3)", sm: "none" } }}>
                            <ContentEditable editorRef={inputEditorRef}
                                handleEditorChange={handleEditorChange} />
                            {!inputWordCount ?
                                <><Box sx={{ position: "absolute", top: 0, pl: 5, mt: 5 }}>
                                    <span
                                        style={{
                                            color: "#aaa",
                                            pointerEvents: "none", // Prevent clicking on the placeholder
                                        }}
                                    >
                                        {placeholder}
                                    </span>
                                </Box>
                                    <Box sx={{
                                        border: "1px solid rgba(0,0,20,0.8)",
                                        width: 100, height: 80, borderRadius: 3,
                                        position: "absolute", top: "50%", left: "50%",
                                        transform: "translate(-50%, -50%)", display: "flex",
                                        alignItems: "center", justifyContent: "center",
                                        cursor: "pointer",
                                        flexDirection: "column",
                                        borderColor: "primary.main"
                                    }}
                                        onClick={() => handlePasteClick(inputEditorRef, setInputWordCount)}
                                    >
                                        <ContentPasteIcon sx={{ color: "primary.main" }} />
                                        <Typography variant="body1" sx={{ fontWeight: 600, color: "primary.main" }}>
                                            Paste Text
                                        </Typography>
                                    </Box></> : null}
                            <Box sx={{
                                width: "100%", height: 60,
                                position: "absolute", bottom: 0,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                px: 2,
                                boxShadow: "0px 1px 7px rgba(0, 0, 0, 0.2)",
                                background: "#fff"
                            }}>
                                <Box>
                                    {!inputWordCount ? <Box>
                                        <input
                                            type="file"
                                            accept=".pdf"
                                            onChange={(e) => handlePDFUpload(e)}
                                            style={{ display: "none" }}
                                            ref={fileInputRef}
                                        />
                                        <Button
                                            sx={{
                                                fontWeight: "bold",
                                                textTransform: "none",
                                                borderRadius: 5,
                                            }}
                                            size="small"
                                            variant="outlined"
                                            startIcon={<PublishIcon />}
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            Upload PDF
                                        </Button>
                                    </Box> :

                                        <Typography variant="body1" sx={{ fontWeight: 500, color: "rgba(0,0,0,0.8)" }}>
                                            Words: {inputWordCount}
                                        </Typography>

                                    }

                                </Box>
                                <Button variant="contained" onClick={translateText}> Translate</Button>
                            </Box>
                        </Box>
                        <Divider orientation="vertical" variant="fullWidth" flexItem />
                        <Box sx={{ width: "100%", height: "100%", position: "relative", borderBottom: { xs: "1px solid rgba(0,0,0,0.3)", sm: "none" } }}>
                            <ContentEditable editorRef={outputEditorRef} disabled={true} />
                            <Box sx={{
                                width: "100%", height: 60,
                                position: "absolute", bottom: 0,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                px: 2,
                                boxShadow: "0px 1px 7px rgba(0, 0, 0, 0.2)",
                                background: "#fff"
                            }}>
                                <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
                                    <Typography variant="body1" sx={{ fontWeight: 500, color: "rgba(0,0,0,0.8)", }}>
                                        {numberOfSentences} {numberOfSentences === 1 ? "Sentence" : "Sentences"}
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 500, color: "rgba(0,0,0,0.8)", mx: 1 }}>
                                        ●
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 500, color: "rgba(0,0,0,0.8)" }}>
                                        {numberOfWords} {numberOfSentences === 1 ? "Word" : "Words"}
                                    </Typography> </Box>
                                {/*   <Divider orientation="vertical" flexItem /> */}


                                <Box sx={{ display: "flex", alignItems: "center" }}>
                                    <Box sx={{ pr: 1 }} >

                                        <IconButton aria-label="delete" size="large" onClick={handleExport}>
                                            <FileDownloadIcon />
                                        </IconButton>
                                    </Box>

                                    <IconButton aria-label="copy" size="large" onClick={handleCopy}>
                                        <ContentCopyIcon />
                                    </IconButton>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Paper>
                <Footer />
            </SideBar>
        </>

    )
}

export default Translator;