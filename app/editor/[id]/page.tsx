"use client";

import React, { useState } from "react";
import { EditorContextProvider } from "./components/EditorContext";
import { FormattingToolbar } from "./components/FormattingToolbar";
import { DocsCanvas } from "./components/DocCanvas";

const INITIAL_CONTENT = `
<h1>Untitled document</h1>
<p>Start typing your document here. Select text to see the bubble menu, or use the toolbar above for full formatting options.</p>
<p></p>
<h2>Getting started</h2>
<p>This is a clean, block-free document editor. Content flows naturally across pages as you type — page-break guides appear automatically every 11 inches.</p>
<p></p>
<h3>Key features</h3>
<ul>
  <li>Full rich-text editing — bold, italic, headings, lists, colours and more</li>
  <li>Auto-flowing pages with subtle page-break rulers</li>
  <li>Inline bubble menu for quick formatting</li>
  <li>Functional File / Edit / Insert / Format / Tools menus</li>
</ul>
<p></p>
<p>Click anywhere and start typing.</p>
`;

export default function EditorPage() {
  const [content, setContent] = useState(INITIAL_CONTENT);
  const [title,   setTitle]   = useState("Untitled document");

  return (
    <EditorContextProvider>
      <div style={{ display: "flex", flexDirection: "column", height: "100vh", width: "100%", overflow: "hidden", fontFamily: "'Google Sans', Arial, sans-serif" }}>

        <FormattingToolbar
          title={title}
          onTitleChange={setTitle}
          docHtml={content}
        />

        <div style={{ flex: 1, overflow: "hidden", display: "flex" }}>
          <DocsCanvas
            content={content}
            onContentChange={setContent}
          />
        </div>

      </div>
    </EditorContextProvider>
  );
}
