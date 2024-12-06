/* eslint-disable react-hooks/exhaustive-deps */





"use client"

import Editor from "@/components/editor/Editor";

import React, { FC, SyntheticEvent, useEffect, useRef, useState } from 'react';
import Quill from 'quill';
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
/* import Badge from "@mui/material/Badge";
import IconButton from "@mui/material/IconButton"; */
import Button from "@mui/material/Button";
/* import DeleteIcon from "@mui/icons-material/Delete"; */
import Divider from "@mui/material/Divider";
import SideBar from "@/components/SideNavigationBar";

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Paper from "@mui/material/Paper";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import  CircularProgress  from "@mui/material/CircularProgress";
import Footer from "@/components/Footer";
import { copyToClipboard, countWords, exportTextAsFile } from "../utils/commonFunctions";
import AiModelSelector from "@/components/AiModelSelector";
import CloseIcon from '@mui/icons-material/Close';
import IconButton from "@mui/material/IconButton";
type GrammarError = {
  sentence: string;
  error_type:  string; 
  original_text: string;
  correction: string;
  error_details: string;
};

const Delta = Quill.import('delta');
const Inline = Quill.import('blots/inline');

class SpanBlock extends Inline {
  static create(value) {
    const node = super.create();
    node.setAttribute('class', 'error-highlight');
    return node;
  }
}

SpanBlock.blotName = 'errorHighlight';
SpanBlock.tagName = 'div';

Quill.register(SpanBlock);



const GrammarChecker: FC = () => {
  const [range, setRange] = useState<unknown>(null);
  const [readOnly, setReadOnly] = useState<boolean>(false);
  const [errorArray, setErrorArray] = useState<GrammarError[]>([]);
  // Use a ref to access the quill instance directly
  const quillRef = useRef<Quill | null>(null);

  const [anchorEl, setAnchorEl] = useState<EventTarget | null>(null);
  const [errorType, setErrorType] = useState("")
  const [errorCorrection, setErrorCorrection] = useState("")
  const [errorDetails, setErrorDetails] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [originalStart, setOriginalStart] = useState(0);
  const [originalEnd, setOriginalEnd] = useState(0);
  const [targetCorrection, setTargetCorrection] = useState("");
  const [sentenceToFind, setSentenceToFind] = useState("");
  const [originalTextLength, setOriginalTextLength] = useState(0);
  const [targetError, setTargetError] = useState("");
  const [targetErrorIndex, setTargetErrorIndex] = useState(0);
  const [language, setLanguage] = useState("English (US)");
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const [aiModel, setAiModel] = useState("MetaLlama-31-405B-Instruct");
  const [ignoredErrors, setIgnoredErrors] = useState([""])
  const handleClose = () => {
    setAnchorEl(null);
  };


  const [isCheckingGrammar, setCheckingGrammar] = useState(false);

  const [previousText, setPreviousText] = useState("")
  const [previousLanguage, setPreviousLanguage] = useState("")
  const [previousAiModel, setPreviousAiModel] = useState("")

  let timer: NodeJS.Timeout | null = null;


  const checkGrammar = async () => {

    try {

      if (previousText === quillRef.current?.getText()
        && previousLanguage === language &&
        previousAiModel === aiModel) {
     
        return
      }
      if (quillRef.current?.getText().trim().length === 0) {
        return
      }
      setPreviousText(quillRef.current!.getText())
      setPreviousLanguage(language)
      setPreviousAiModel(aiModel)
      setCheckingGrammar(true);
      const response = await fetch("/grammar-check/api/check-grammar", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: quillRef.current?.getText(), language, aiModel }),
      });
      const data = await response.json();
      console.log(typeof data.result);
      const grammarError: GrammarError[] = JSON.parse(data.result)

      const filteredGrammarErrors = grammarError.filter(
        error => !ignoredErrors.includes(error.original_text)
      );  
      setErrorArray(filteredGrammarErrors)
      setCheckingGrammar(false);
    } catch (error) {
      setCheckingGrammar(false);
      console.error('Error:', error);
    }

  }

  const handleContentChange = () => {
    setWordCount(countWords(quillRef.current!.getText()))
    // Clear any existing timer
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }

    // Set a new timer
    timer = setTimeout(() => {
      checkGrammar()
    }, 2000);
  };
  const fixAllErrors = () => {
    const quill = quillRef.current;
    if (!quill) return;

    // Sort errors by start index in descending order to avoid index shifting
    const sortedErrors = [...errorArray].sort((a, b) => {
      const contentA = quill.getText();
      const contentB = quill.getText();
      const startA = contentA.indexOf(a.original_text);
      const startB = contentB.indexOf(b.original_text);
      return startB - startA;
    });

    // Apply corrections from end to start
    sortedErrors.forEach(error => {
      const content = quill.getText();
      const sentenceStart = content.indexOf(error.sentence);
      const originalStart = content.indexOf(error.original_text, sentenceStart);

      if (originalStart !== -1) {
        quill.updateContents(
          new Delta()
            .retain(originalStart, { errorHighlight: false })
            .delete(error.original_text.length)
            .insert(error.correction, { errorHighlight: false })
        );

        // Update error array
        updateErrorArray(error.sentence, error.original_text, error.correction);
      }
    });

    // Clear error array after fixing all errors
    setErrorArray([]);
  }

  const ignoreError = (error: string) => {
    const quill = quillRef.current;
    quill?.updateContents(new Delta()
      .retain(originalStart, { errorHighlight: false })
      .delete(originalTextLength)
      .insert(targetError, { errorHighlight: false })
    );

    /* updateErrorArray(sentenceToFind, targetError, targetError) */
    console.log({ targetError })
        if (!ignoredErrors.includes(targetError)) {
      setIgnoredErrors([...ignoredErrors, targetError])
    }
    removeErrorByIndex(targetErrorIndex)
    setAnchorEl(null);
  };
  

  const updateErrorArray = (sentenceToFind: string, targetError: string, targetCorrection: string) => {
    setErrorArray((prevSentences) =>
      prevSentences.map((error) =>
        error.sentence === sentenceToFind
          ? {
            ...error,
            sentence: error.sentence.replace(targetError, targetCorrection)
          }
          : error
      )
    );
  };

  const removeErrorByIndex = (index: number) => {
    setErrorArray((prevErrorArray) =>
      prevErrorArray.filter((_, i) => i !== index)
    );
  };



useEffect(() => {
  checkGrammar();
}, [language,aiModel]);

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setLanguage(newValue);
  };

  const correctText = () => {
    const quill = quillRef.current;
    quill?.updateContents(new Delta()
      .retain(originalStart, { errorHighlight: false })
      .delete(originalTextLength)
      .insert(targetCorrection, { errorHighlight: false })
    );

    updateErrorArray(sentenceToFind, targetError, targetCorrection)

    removeErrorByIndex(targetErrorIndex)
    setAnchorEl(null);
  }

  const clickHandler = (e: MouseEvent, original_text: string, originalStart: number, originalEnd: number, sentenceToFind: string, targetError: string, targetCorrection: string, index: number, error_type: string, error_details: string, correction: string) => {

    const target = e.target as HTMLElement;

    if (target.classList.contains('error-highlight')) {
      if (target.textContent === original_text) {

        setErrorType(error_type)
        setErrorDetails(error_details)
        setErrorCorrection(correction)
        setAnchorEl(e.target);

        setOriginalStart(originalStart)
        setOriginalEnd(originalEnd)
        setTargetCorrection(targetCorrection)
        setSentenceToFind(sentenceToFind)
        setTargetError(targetError)
        setOriginalTextLength(original_text.length)
        setTargetErrorIndex(index)

      }
    }
  };


  useEffect(() => {
    if (quillRef.current) {
      const quill = quillRef.current;
      const content = quill.getText();
      console.log({ errorArray })

      const handlers: Array<(e: MouseEvent) => void> = [];

      errorArray.forEach((error, index) => {
        const { sentence, original_text, correction, error_type, error_details } = error;
        const startIndex = content.indexOf(sentence);

        if (startIndex !== -1) {
          const originalStart = content.indexOf(original_text, startIndex);

          if (originalStart !== -1) {
            const originalEnd = originalStart + original_text.length;

            quill.formatText(originalStart, original_text.length, {
              errorHighlight: true,
            });
            const sentenceToFind = sentence;
            const targetCorrection = correction;
            const targetError = original_text;
            const handler = (e: MouseEvent) => clickHandler(e, original_text, originalStart, originalEnd, sentenceToFind, targetError, targetCorrection, index, error_type, error_details, correction);
            handlers.push(handler);
            quill.root.addEventListener('click', handler);
          }
        }
      });

      return () => {
        handlers.forEach(handler => {
          quill.root.removeEventListener('click', handler);
        });
        console.log("clean up")
      };
    }
    console.log({ errorArray })
  }, [errorArray]);
  const languages = [
    { label: "English (US)" },
    { label: "English (GB)" },
    { label: "English (IN)" },
    { label: "English (CA)" },
    { label: "English (AU)" },
    { label: "English (ZA)" },
    { label: "English (NZ)" },
    { label: "Spain (ES)" },
    { label: "France (FR)" },
    { label: "Germany (DE)" },
    { label: "Italy (IT)" },
    { label: "Portugal (PT)" },
    { label: "Netherlands (NL)" },
    { label: "Russia (RU)" },
  ];
  const handleCopy = async () => {
    const text = quillRef.current?.getText();
    if (text?.trim()) {
        await copyToClipboard(text);
        alert("Text copied to clipboard!");
    }
};

const handleExport = () => {
    const text = quillRef.current?.getText();
    if (text) {
        exportTextAsFile(text, "MyTextFile.txt");
    }
};

  return (
    <>
      <SideBar pageTitle="Grammar Checker">
        <Paper elevation={2} sx={{ width: { xs: "95%", sm: "90%", md: "60%" }, margin: "50px auto", borderTopRightRadius: 8, borderTopLeftRadius: 8, height: 500, overflowY: "auto", position: "relative" }}>
          
          <Box sx={{ maxWidth: "inherit", display: "flex", borderTopRightRadius: 8, borderTopLeftRadius: 8, alignItems:"center" }}>
            <AiModelSelector aiModel={aiModel} setAiModel={setAiModel} /> 
            <Tabs
              value={language}
              onChange={handleChange}
              variant="scrollable"
              scrollButtons={true}
              aria-label="scrollable auto tabs example"
              sx={{ width: "100%", background: "none" }}
            >
              {languages.map((lang, index) => (
                <Tab key={index} label={lang.label} value={lang.label} />
              ))}
            </Tabs>
          </Box>
          <Paper elevation={4} sx={{ width: "100%", height: 50, margin: "0 auto", position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 5, marginBottom: 0, display: "flex", alignItems: "center", justifyContent: "space-around" }}>
            {quillRef.current?.getText().trim() && (
              <>
                <Box >
                  {isCheckingGrammar ?
                    <CircularProgress size={25} /> :
                    <><Typography sx={{ p: 0, textTransform: "capitalize", fontWeight: 600, fontSize: 15 }}>
                      {errorArray.length} Errors
                    </Typography><Typography sx={{ p: 0, textTransform: "capitalize", fontWeight: 600, fontSize: 15 }}>
                        {wordCount} words
                      </Typography></>
                  }
                </Box>
                <Divider orientation="vertical" flexItem />
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Button variant="contained" disabled={isCheckingGrammar} sx={{ textTransform: "none", borderRadius: 5, ml: 2 }} onClick={fixAllErrors}>
                    Fix all Errors
                  </Button>
                </Box>
                <Divider orientation="vertical" flexItem />
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Box sx={{ px: 1 }} >
                  <IconButton aria-label="delete" size="large" onClick={handleExport}>
                                            <FileDownloadIcon />
                                        </IconButton>
                  </Box>

                  <Box sx={{ px: 1 }} >
                    <IconButton aria-label="copy" size="large" onClick={handleCopy}>
                       <ContentCopyIcon />
                      </IconButton>
                   
                  </Box>
                </Box>
              </>
            )}
          </Paper>
          <Editor
            ref={quillRef}
            readOnly={readOnly}
            onSelectionChange={setRange}
            onTextChange={handleContentChange} defaultValue={undefined} />
        </Paper>
        <Box sx={{}}>
          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography sx={{ p: 1, px: 2, textAlign: "center", width: 300, textTransform: "capitalize", fontWeight: 500, fontSize: 18 }}>

                {errorType}
              </Typography>
              <IconButton aria-label="copy" size="large" onClick={handleClose}>
                <CloseIcon />
                </IconButton>
            </Box>
            <Divider />
            <Typography sx={{ p: 1, px: 1, width: 300, textAlign: "center", }}>{errorDetails}</Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                pb: 2,

              }}
            >
              <Button
                variant="contained"
                sx={{ textTransform: "none", mx: 1 }}
                onClick={correctText}
              >
                {errorCorrection}
              </Button>
              <Button
                variant="outlined"
                sx={{ textTransform: "none", mx: 1 }}
              onClick={ignoreError}
              >
                Ignore
              </Button>
            </Box>

          </Popover> </Box>
        <Footer />
      </SideBar></>
  );
};

export default GrammarChecker;
