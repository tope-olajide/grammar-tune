"use client"

import Editor from "@/components/editor/Editor";

import React, { useEffect, useRef, useState } from 'react';
import Quill from 'quill';
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Badge from "@mui/material/Badge";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import { Divider } from "@mui/material";


const Delta = Quill.import('delta');
const Inline = Quill.import('blots/inline');

class SpanBlock extends Inline{    
    
    static create(value){
        const node = super.create();
        node.setAttribute('class','error-highlight');
        return node;    
    } 

    
}

SpanBlock.blotName = 'errorHighlight';
SpanBlock.tagName = 'div';

Quill.register(SpanBlock);



const App: React.FC = () => {
  const [range, setRange] = useState<unknown>(null);
  const [lastChange, setLastChange] = useState<unknown>(null);
  const [readOnly, setReadOnly] = useState<boolean>(false);
  const [errorArray, setErrorArray] = useState<any[]>([]);
  // Use a ref to access the quill instance directly
  const quillRef = useRef<Quill | null>(null);

  const [anchorEl, setAnchorEl] = useState<HTMLSpanElement | null>(null);
  const [errorType, setErrorType] = useState("")
  const [errorCorrection, setErrorCorrection] = useState("")
  const [errorDetails, setErrorDetails] = useState("");


  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;


  const handleClose = () => {
    setAnchorEl(null);
  };


  const handleSubmit = async () => {

    try {
      const response = await fetch('http://127.0.0.1:8000/tokenize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text:quillRef.current!.getText() }),
      });
      const data = await response.json();
      //setTokens(data.tokens);
      console.log(data.response)
      setErrorArray(JSON.parse(data.response))

    } catch (error) {
      console.error('Error:', error);
    }
  };

  const checkGrammar = async () => {
    const response = await fetch("/grammar-check/api/check-grammar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body:JSON.stringify({ text:"quillRef.current!.getText()" })
    });
    const data = await response.json();
    console.log("Grammar check result:", data.result);
  };

  const getEditorText = async () => {
    try {
      const response = await fetch("/grammar-check/api/check-grammar", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text:quillRef.current!.getText() }),
      });
      const data = await response.json();
      //setTokens(data.tokens);
/*       console.log(data.response)
      setErrorArray(JSON.parse(data.response)) */
      console.log(typeof data.result);
      setErrorArray(JSON.parse(data.result))
    } catch (error) {
      console.error('Error:', error);
    }
  
  }



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

  const removeErrorByIndex = (index) => {
    setErrorArray((prevErrorArray) =>
      prevErrorArray.filter((_, i) => i !== index)
    );
  };
  const correctError = () => {

  }
  const [originalStart, setOriginalStart] = useState(0);
  const [originalEnd, setOriginalEnd] = useState(0);
  const [targetCorrection, setTargetCorrection] = useState("");
  const [sentenceToFind, setSentenceToFind] = useState("");
  const [originalTextLength, setOriginalTextLength] = useState(0);
  const [targetError, setTargetError] = useState("");
  const [targetErrorIndex, setTargetErrorIndex] = useState(0);

  const correctText = () => {
    const quill = quillRef.current;
    quill?.updateContents(new Delta()
    .retain(originalStart, {errorHighlight: false})
    .delete(originalTextLength)
    .insert(targetCorrection, {errorHighlight: false})
  );

  updateErrorArray(sentenceToFind, targetError, targetCorrection)

  removeErrorByIndex(targetErrorIndex)
    
  }
  const clickHandler = (e: MouseEvent, original_text: string, originalStart: number, originalEnd: number, sentenceToFind: string, targetError: string, targetCorrection: string, index: number, error_type: string, error_details: string, correction: string) => {
 
    const target = e.target as HTMLElement;
    
  if (target.classList.contains('error-highlight')) {
    if (target.textContent === original_text) {
/*       console.log(originalStart, originalEnd);
      console.log({ sentenceToFind })
      console.log({ targetCorrection })
      console.log({ targetError })
 */
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
      
/*       */

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
      const { sentence, original_text, correction, error_type,error_details } = error;
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

/*           const handler = (event) => {
            setErrorType(error_type)
            setErrorDetails(error_details)
            setErrorCorrection(correction)
            setAnchorEl(event.target);
} */
         const handler = (e: MouseEvent) => clickHandler(e, original_text, originalStart, originalEnd, sentenceToFind, targetError, targetCorrection, index, error_type, error_details, correction );
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
  console.log({errorArray})
}, [errorArray]);  return (
    <><div className='quill-editor'>
    <Editor
      ref={quillRef}
      readOnly={readOnly}

      onSelectionChange={setRange}
      onTextChange={setLastChange} defaultValue={undefined} />
    <button
      className="controls-right"
      type="button"
      onClick={getEditorText}
    >
      Tokenize
    </button>




  </div>
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
          <Typography sx={{ p: 1, minWidth: "200px", textTransform:"capitalize", fontWeight:500, fontSize:20 }}>
           
            {errorType}
          </Typography>
        
      </Box>
       <Divider />
      <Typography sx={{ p: 1,px:3 }}>{errorDetails}</Typography>
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
            sx={{ textTransform: "none", mx:1  }}
            onClick={correctText} 
          >
           {errorCorrection}
        </Button>
        <Button
            variant="outlined"
            sx={{ textTransform: "none", mx:1 }}
            /* onClick={correctWord} */
          >
           Ignore
          </Button>
        </Box>

    </Popover></>
  );
};

export default App;
