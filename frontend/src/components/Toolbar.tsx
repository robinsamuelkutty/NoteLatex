import React from 'react';
import { Calculator, FlaskConical, Save, FileText, Plus } from 'lucide-react';
import { mathSymbols, chemistrySymbols } from '../data/symbols';

interface ToolbarProps {
  onSymbolClick: (latex: string) => void;
  onSave: () => void;
  onNewNote: () => void;
  onShowNotes: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ onSymbolClick, onSave, onNewNote, onShowNotes }) => {
  const [activeTab, setActiveTab] = React.useState<'math' | 'chemistry'>('math');

  const renderSymbolButtons = () => {
    const symbols = activeTab === 'math' ? mathSymbols : chemistrySymbols;
    const baseStyle =
      activeTab === 'math'
        ? 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'
        : 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200';

    return symbols.map((symbol, index) => (
      <button
        key={index}
        onClick={() =>
          onSymbolClick(
            `${symbol.displayMode === 'block' ? `$$${symbol.latex}$$` : `$${symbol.latex}$`}`
          )
        }
        className={`px-3 py-2 rounded-lg transition-colors text-sm font-mono ${baseStyle}`}
        title={symbol.description}
      >
        {symbol.symbol}
      </button>
    ));
  };

  return (
    <div className="bg-white border-b border-gray-200 p-4">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={onNewNote}
            className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={16} />
            New Note
          </button>
          <button
            onClick={onShowNotes}
            className="flex items-center gap-2 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <FileText size={16} />
            Notes
          </button>
          <button
            onClick={onSave}
            className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Save size={16} />
            Save
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('math')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
              activeTab === 'math'
                ? 'bg-blue-100 text-blue-700 border border-blue-300'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Calculator size={16} />
            Math
          </button>
          <button
            onClick={() => setActiveTab('chemistry')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
              activeTab === 'chemistry'
                ? 'bg-green-100 text-green-700 border border-green-300'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <FlaskConical size={16} />
            Chemistry
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
        {renderSymbolButtons()}
      </div>
    </div>
  );
};

export default Toolbar;
