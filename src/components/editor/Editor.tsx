


import { forwardRef, useEffect, useLayoutEffect, useRef } from 'react';
import Quill from 'quill';
import toolbar from './toolbar';

interface EditorProps {
  readOnly: boolean;
  defaultValue: any; 
  onTextChange: (delta: any) => void;
  onSelectionChange: (range: any) => void;
}

const Editor = forwardRef<Quill | null, EditorProps>(
  ({ readOnly, defaultValue, onTextChange, onSelectionChange }, ref) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const defaultValueRef = useRef(defaultValue);
    const onTextChangeRef = useRef(onTextChange);
    const onSelectionChangeRef = useRef(onSelectionChange);

    useLayoutEffect(() => {
      onTextChangeRef.current = onTextChange;
      onSelectionChangeRef.current = onSelectionChange;
    }, [onTextChange, onSelectionChange]);

    useEffect(() => {
      if (ref && ref.current) {
        ref.current.enable(!readOnly);
      }
    }, [readOnly, ref]);

    useEffect(() => {
      const container = containerRef.current;
      if (container) {
        const editorContainer = container.appendChild(
          container.ownerDocument.createElement('div')
        );
        editorContainer.className = 'editor-container';
        const quill = new Quill(editorContainer, {
          theme: 'snow',
          modules: {
            toolbar:toolbar
          },
          placeholder: 'Enter or paste your text here...',
        });

        if (ref) {
          ref.current = quill;
        }

        if (defaultValueRef.current) {
          quill.setContents(defaultValueRef.current);
        }

        quill.on(Quill.events.TEXT_CHANGE, (...args) => {
          onTextChangeRef.current?.(...args);
        });

        quill.on(Quill.events.SELECTION_CHANGE, (...args) => {
          onSelectionChangeRef.current?.(...args);
        });

        return () => {
          if (ref) {
            ref.current = null;
          }
          container.innerHTML = '';
        };
      }
    }, [ref]);

    return <div ref={containerRef}></div>;
  }
);

Editor.displayName = 'Editor';

export default Editor;
