import React from 'react';
import { BlockMath, InlineMath } from 'react-katex'; 
import { Eye } from 'lucide-react';
import 'katex/dist/katex.min.css';

interface PreviewProps {
  content: string;
  title: string;
}

const Preview: React.FC<PreviewProps> = ({ content, title }) => {
  const renderContent = (text: string) => {
    if (!text) return null;

    // Split by display math blocks ($$...$$)
    const displayMathRegex = /\$\$([\s\S]+?)\$\$/g;
    const parts = text.split(displayMathRegex);
    
    return parts.map((part, index) => {
      // Even indices are regular text, odd indices are display math
      if (index % 2 === 0) {
        // Handle inline math in regular text
        return renderInlineMath(part, index);
      } else {
        // Display math
        try {
          return (
            <div key={index} className="my-4">
              <BlockMath math={part.trim()} />
            </div>
          );
        } catch (error) {
          return (
            <div key={index} className="my-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <span className="text-red-600 font-mono text-sm">
                LaTeX Error: {part}
              </span>
            </div>
          );
        }
      }
    });
  };

  const renderInlineMath = (text: string, baseIndex: number) => {
    const inlineMathRegex = /\$([^$]+)\$/g;
    const parts = text.split(inlineMathRegex);
    
    return parts.map((part, index) => {
      const key = `${baseIndex}-${index}`;
      
      if (index % 2 === 0) {
        // Regular text - preserve line breaks
        return (
          <span key={key}>
            {part.split('\n').map((line, lineIndex) => (
              <React.Fragment key={lineIndex}>
                {line}
                {lineIndex < part.split('\n').length - 1 && <br />}
              </React.Fragment>
            ))}
          </span>
        );
      } else {
        // Inline math
        try {
          return <InlineMath key={key} math={part.trim()} />;
        } catch (error) {
          return (
            <span key={key} className="bg-red-100 text-red-600 px-1 rounded font-mono text-sm">
              Error: {part}
            </span>
          );
        }
      }
    });
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-2 mb-2">
          <Eye size={20} className="text-gray-600" />
          <span className="text-lg font-semibold text-gray-800">Preview</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 truncate">
          {title || 'Untitled Note'}
        </h1>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="bg-white p-6 rounded-lg shadow-sm min-h-[400px]">
          <div className="prose prose-lg max-w-none">
            {content ? renderContent(content) : (
              <p className="text-gray-500 italic">
                Start typing in the editor to see the preview...
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preview;