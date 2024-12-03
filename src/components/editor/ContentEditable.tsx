
import { Box } from "@mui/material";
import { ChangeEvent, FC, RefObject } from "react";

interface ContentEditableProps {
    editorRef: RefObject<HTMLDivElement>;
    handleEditorChange?: (e: ChangeEvent<HTMLDivElement>) => void;
    disabled?: boolean;
}

const ContentEditable: FC<ContentEditableProps> = ({ editorRef, handleEditorChange, disabled = true, }) => {
    return (
        <Box sx={{ position: "relative" }}>
            <Box
                ref={editorRef}
                contentEditable={disabled}
                suppressContentEditableWarning
                onInput={(e: ChangeEvent<HTMLDivElement>) => handleEditorChange?.(e)}
                className="contenteditable-div"
                sx={{
                    padding: 5,
                    borderRadius: 0,
                    height: 400,
                    overflowY: "auto",
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
