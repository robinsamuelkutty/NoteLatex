import React, { useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import { Type } from 'lucide-react';

export interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  title: string;
  onTitleChange: (title: string) => void;
  placeholder?: string;
}

export interface EditorHandle {
  insertTextAtCursor: (text: string) => void;
}

const Editor = forwardRef<EditorHandle, EditorProps>(({
  value,
  onChange,
  title,
  onTitleChange,
  placeholder = "Start typing your LaTeX content here...\n\nUse $ for inline math: $x^2 + y^2 = r^2$\nUse $$ for display math:\n$$\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}$$"
}, ref) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  const insertTextAtCursor = (text: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newValue = value.substring(0, start) + text + value.substring(end);
    
    onChange(newValue);
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + text.length, start + text.length);
    }, 0);
  };

  // 👇 Correctly expose methods using forwardRef
  useImperativeHandle(ref, () => ({
    insertTextAtCursor
  }));

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2 mb-2">
          <Type size={20} className="text-gray-600" />
          <span className="text-lg font-semibold text-gray-800">Editor</span>
        </div>
        <input
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Enter note title..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      
      <div className="flex-1 p-4">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full h-full min-h-[400px] p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm leading-relaxed"
          style={{ fontFamily: 'JetBrains Mono, Consolas, Monaco, monospace' }}
        />
      </div>
    </div>
  );
});

export default Editor;
