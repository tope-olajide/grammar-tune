"use client"

import ContentEditable from "@/components/editor/ContentEditable";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { ChangeEvent, SyntheticEvent, useRef, useState } from "react";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Slider from '@mui/material/Slider';
import { countWords, handleFileChange, handlePasteClick } from "../utils/commonFunctions";
import PublishIcon from "@mui/icons-material/Publish";
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ProcessingAnimation from "@/components/ProcessingAnimation";
const SummarizePage = () => {
    const [tabValue, setTabValue] = useState('Paragraph');
    const editorRef = useRef<HTMLDivElement | null>(null);
    const [isSummarizing, setIsSummarizing] = useState(false);
    const [isEditorEmpty, setIsEditorEmpty] = useState(true);
    const [inputWordCount, setInputWordCount] = useState(0);
    const placeholder = "Enter or paste your text and press Summarize"
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [isExtractingPDF, setIsExtractingPDF] = useState(false);
    const [sliderValue, setSliderValue] = useState(30);
    const [summarizedText, setSummarizedText] = useState("");
    const handleChange = (event: SyntheticEvent, newValue: string) => {
        setTabValue(newValue);
    };
    function valuetext(value: number) {
        console.log(value)
        setSliderValue(value)
        return `${value}`;
    }

    const handleEditorChange = (event: ChangeEvent<HTMLDivElement>) => {
        if (editorRef.current?.innerHTML) {
            setIsEditorEmpty(false);
        } else {
            setIsEditorEmpty(true);
        }
        setInputWordCount(countWords(editorRef.current!.innerText));
    };
    const handlePDFUpload = async (e) => {
        setIsExtractingPDF(true)
        await handleFileChange(e, editorRef, setInputWordCount, setIsEditorEmpty)
        setIsExtractingPDF(false)
    }
    const summarizeText = async () => {
        const summaryLength = sliderValue === 10 ? "Brief" : sliderValue === 20 ? "Concise" : sliderValue === 30 ? "Detailed" : "Comprehensive";
        const mode = tabValue;
        const text = editorRef.current?.textContent
        console.log({ mode, summaryLength, text })
            try {
              const response = await fetch("/summarize/api/summarize-text", {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text:editorRef.current?.textContent, mode, summaryLength }),
              });
              const data = await response.json();
              console.log( {result: data.result});
              setSummarizedText(data.result)
            } catch (error) {
              console.error('Error:', error);
            }
          
          
    }
    return (
        <>
            {isExtractingPDF?<ProcessingAnimation />:null}
            <div>SummarizePage</div>
            <Paper elevation={2}
                sx={{
                    width: "90%",
                    minHeight: 450,
                    margin: "100px auto",
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
                            <Typography variant="body1" sx={{ ml: 5, mr: 1, fontWeight: 600, color:"rgba(0,0,0,0.6)", fontSize:14, textTransform:"uppercase" }}>
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
                        </Box>:null}
                        
                    </Box>
                    
                        <DeleteForeverIcon />
                   

                </Box>
                <Box sx={{
                    display: "flex", flexDirection: {
                        xs: "column",
                        sm: "row"
                    }, minHeight: 400
                }}>
                    <Box sx={{ width: "100%", height: "100%", position: "relative", borderBottom: { xs: "1px solid rgba(0,0,0,0.3)", sm: "none" } }}>
                        <ContentEditable editorRef={editorRef} handleEditorChange={handleEditorChange} placeholder={placeholder} isEditorEmpty={isEditorEmpty} />
                        {!inputWordCount || isEditorEmpty ?
                            <><Box sx={{ position: "absolute", top: 0, pl: 2, mt: 2.5 }}>
                                <span
                                    style={{
                                        color: "#aaa",
                                        pointerEvents: "none", // Prevent clicking on the placeholder
                                    }}
                                >
                                    {placeholder}
                                </span>
                            </Box><Box sx={{
                                border: "1px solid rgba(0,0,20,0.8)",
                                    width: 100, height: 80, borderRadius: 3,
                                    position: "absolute", top: "50%", left: "50%",
                                    transform: "translate(-50%, -50%)", display: "flex",
                                    alignItems: "center", justifyContent: "center",
                                    cursor: "pointer",
                                    flexDirection:"column"
                                }}
                                onClick={()=>handlePasteClick(editorRef, setIsEditorEmpty, setInputWordCount )}
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
                            px: 2
                        }}>
                            <Box>
                       {!inputWordCount?<Box>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e)=>handlePDFUpload(e)}
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
                  </Box>:<Typography variant="body1" sx={{ fontWeight: 500, color: "rgba(0,0,0,0.8)" }}>
                                Words: {inputWordCount}
                            </Typography>}     
                            
                             </Box> 
                            <Button variant="contained" onClick={summarizeText}> Summarize</Button>
                        </Box>
                    </Box>
                    <Divider orientation="vertical" variant="fullWidth" flexItem />
                    <Box sx={{ width: "100%", height: "100%" }}>
                        <ContentEditable />
                    </Box>
                </Box>
            </Paper>
        </>

    )
}

export default SummarizePage;