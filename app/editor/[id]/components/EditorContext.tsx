"use client";

import React, { createContext, useCallback, useContext, useRef } from "react";
import type { Editor } from "@tiptap/react";

interface ActiveEditorCtx {
  getEditor: () => Editor | null;
  registerEditor: (editor: Editor | null) => void;
}

const EditorContext = createContext<ActiveEditorCtx>({
  getEditor: () => null,
  registerEditor: () => {},
});

export function EditorContextProvider({ children }: { children: React.ReactNode }) {
  const editorRef = useRef<Editor | null>(null);

  const registerEditor = useCallback((editor: Editor | null) => {
    editorRef.current = editor;
  }, []);

  const getEditor = useCallback(() => editorRef.current, []);

  return (
    <EditorContext.Provider value={{ getEditor, registerEditor }}>
      {children}
    </EditorContext.Provider>
  );
}

export const useEditorContext = () => useContext(EditorContext);
