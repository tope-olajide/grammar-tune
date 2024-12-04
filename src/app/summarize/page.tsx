
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
import { clearEditorContent, copyToClipboard, countWords, exportTextAsFile, handleFileChange, handlePasteClick } from "../utils/commonFunctions";
import PublishIcon from "@mui/icons-material/Publish";
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ProcessingAnimation from "@/components/ProcessingAnimation";
import SideBar from "@/components/SideNavigationBar";
import Footer from "@/components/Footer";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import IconButton from "@mui/material/IconButton";
const SummarizePage = () => {
    const [tabValue, setTabValue] = useState('Paragraph');
    const inputEditorRef = useRef<HTMLDivElement | null>(null);
    const outputEditorRef = useRef<HTMLDivElement | null>(null);
    const [isSummarizing, setIsSummarizing] = useState(false);
    const [inputWordCount, setInputWordCount] = useState(0);
    const placeholder = "Enter or paste your text and press Summarize"
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [isExtractingPDF, setIsExtractingPDF] = useState(false);
    const [sliderValue, setSliderValue] = useState(30);
    /*  const [summarizedText, setSummarizedText] = useState(""); */

    const handleChange = (event: SyntheticEvent, newValue: string) => {
        setTabValue(newValue);
    };
    function valuetext(value: number) {
        console.log(value)
        setSliderValue(value)
        return `${value}`;
    }

    const handleEditorChange = () => {

        setInputWordCount(countWords(inputEditorRef.current!.innerText));
    };
    const handlePDFUpload = async (e) => {
        setIsExtractingPDF(true)
        await handleFileChange(e, inputEditorRef, setInputWordCount)
        setIsExtractingPDF(false)
    }
    function formatToArray(input: string) {
        try {
            // Remove surrounding square brackets and trim extra spaces or newlines
            const trimmedInput = input.trim().slice(1, -1).trim();

            // Split the string into an array by newline and remove extra quotation marks and whitespace
            const formattedArray = trimmedInput
                .split('\n')
                .map(line => line.trim()) // Remove leading/trailing spaces
                .filter(line => line) // Remove empty lines
                .map(line => line.replace(/^"|"$/g, '')); // Remove surrounding quotes

            return formattedArray;
        } catch (error) {
            console.error('Error formatting the input:', error);
            return [];
        }
    }
    const summarizeText = async () => {
        setIsSummarizing(true);
        const summaryLength = sliderValue === 10 ? "Brief" : sliderValue === 20 ? "Concise" : sliderValue === 30 ? "Detailed" : "Comprehensive";
        const mode = tabValue;
        const text = inputEditorRef.current?.textContent
        console.log({ mode, summaryLength, text })
        try {
            const response = await fetch("/summarize/api/summarize-text", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: inputEditorRef.current?.textContent, mode, summaryLength }),
            });
            const data = await response.json();
            console.log({ result: data.result });
            console.log({ type: Array.isArray(formatToArray(data.result)) });
            // setSummarizedText(data.result)

            // Check if result is array and create HTML list
            if (Array.isArray(formatToArray(data.result)) && formatToArray(data.result).length > 1) {
                const formattedArray = formatToArray(data.result);
                const listItems = formattedArray.map(item => `<li>${item}</li>`).join('');
                const list = `<ul>${listItems}</ul>`;
                outputEditorRef.current!.innerHTML = list;
            } else {
                outputEditorRef.current!.innerHTML = data.result;
            } setIsSummarizing(false);
        } catch (error) {
            setIsSummarizing(false);
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
            <SideBar pageTitle="Summarize">
                {isExtractingPDF || isSummarizing ? <ProcessingAnimation /> : null}
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
                    <Box sx={{ minHight: 58, width: "100%", borderBottom: "1px solid rgba(0,0,0,0.1)", px: 1, overflowX: "auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>

                        <Box sx={{ display: "flex", alignItems: "center", pt: 1, minWidth: 1000, }}>
                            <Typography variant="body1" sx={{ mx: 2 }}>
                                Mode:
                            </Typography>
                            <Tabs
                                value={tabValue}
                                onChange={handleChange}
                                textColor="secondary"
                                indicatorColor="secondary"
                                aria-label="secondary tabs"
                            >
                                <Tab value="Paragraph" label="Paragraph" />
                                <Tab value="Bullet Points" label="Bullet Points" />
                            </Tabs>
                            {tabValue === "Paragraph" ?
                                <Box sx={{ display: "flex", mb: 0, alignItems: "center" }}>
                                    <Typography variant="body1" sx={{ ml: 5, mr: 1, fontWeight: 600, color: "rgba(0,0,0,0.6)", fontSize: 14, textTransform: "uppercase" }}>
                                        Summary Length:
                                    </Typography>  <Box sx={{ width: 280, display: "flex", alignItems: "center", }}>
                                        <Typography variant="body1" sx={{ mx: 2, fontWeight: 400 }}>
                                            Short
                                        </Typography>
                                        <Slider
                                            aria-label="Summary length"
                                            defaultValue={sliderValue}
                                            getAriaValueText={valuetext}
                                            valueLabelDisplay="off"
                                            shiftStep={30}
                                            step={10}
                                            marks
                                            min={10}
                                            max={40}
                                        />
                                        <Typography variant="body1" sx={{ mx: 2, fontWeight: 400 }}>
                                            Long
                                        </Typography>
                                    </Box>
                                </Box> : null}
                        </Box>
                        <IconButton aria-label="delete" size="large" onClick={handleClearEditor}>
                            <DeleteForeverIcon />
                        </IconButton>


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
                                        flexDirection: "column"
                                    }}
                                        onClick={() => handlePasteClick(inputEditorRef, setInputWordCount)}
                                    >
                                        <ContentPasteIcon />
                                        <Typography variant="body1" sx={{ fontWeight: 600, color: "rgba(0,0,0,0.8)" }}>
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
                                boxShadow: "0px 1px 7px rgba(0, 0, 0, 0.2)"
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
                                <Button variant="contained" onClick={summarizeText}> Summarize</Button>
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
                                boxShadow: "0px 1px 7px rgba(0, 0, 0, 0.2)"
                            }}>
                                <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
                                    <Typography variant="body1" sx={{ fontWeight: 500, color: "rgba(0,0,0,0.8)", }}>
                                        2 Sentences
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 500, color: "rgba(0,0,0,0.8)", mx: 1 }}>
                                        ●
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 500, color: "rgba(0,0,0,0.8)" }}>
                                        69 Words
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

export default SummarizePage;