import React, { useState, useRef } from "react";
import { Box, Typography } from "@mui/material";

interface ContentEditableProps {
    editorRef,
    handleEditorChange: (text: string) => void;
    disabled?: boolean,
    text?,
    setText?,
    placeholder: string
    isEditorEmpty: boolean
}

const ContentEditable: React.FC<ContentEditableProps> = ({ editorRef, handleEditorChange, disabled = true, text, setText, placeholder, isEditorEmpty }) => {



    return (
        <Box sx={{ position: "relative" }}>
            <Box
                ref={editorRef}
                contentEditable={disabled}
                suppressContentEditableWarning
                onInput={(e: any) => handleEditorChange(e)}

                sx={{
                    padding: 2,
                    borderRadius: 0,
                    minHeight: 400,
                    outline: "none",
                    typography: "body1",
                    "&:focus": {
                        border: "1px solid",
                        borderColor: "primary.main",
                    },
                    paddingBottom: 8
                }}
            >


            </Box>
        </Box>
    );
};

export default ContentEditable;
