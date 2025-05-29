import { useAppContext } from "../context/AppContext";

export default function JsonPanel() {
  const { 
    rightSidebarExpanded, 
    toggleRightSidebar, 
    jsonOutput, 
    handleJsonOutputChange, 
    jsonValid,
    validationErrors,
    formatJson,
    copyJson 
  } = useAppContext();

  return (
    <aside 
      className={`bg-white border-l border-gray-200 transition-all duration-300 ease-in-out ${
        rightSidebarExpanded ? 'w-96' : 'w-0'
      }`}
    >
      {rightSidebarExpanded && (
        <>
          {/* JSON panel header */}
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <i className="fas fa-code text-gray-600"></i>
              <span className="font-medium text-gray-900">JSON Output</span>
            </div>
            <button 
              className="p-1 hover:bg-gray-100 rounded" 
              onClick={toggleRightSidebar}
            >
              <i className="fas fa-times text-gray-600"></i>
            </button>
          </div>
          
          {/* JSON editor content */}
          <div className="h-full flex flex-col">
            
            {/* JSON controls */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-700">Live Preview</span>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={formatJson}
                    className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded"
                  >
                    Format
                  </button>
                  <button 
                    onClick={copyJson}
                    className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded"
                  >
                    Copy
                  </button>
                </div>
              </div>
              
              {/* Validation status */}
              <div className="flex items-center space-x-2 text-xs">
                <div className={`w-2 h-2 rounded-full ${jsonValid ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-gray-600">
                  {jsonValid ? 'Valid JSON structure' : 'Invalid JSON structure'}
                </span>
              </div>
            </div>
            
            {/* JSON editor textarea */}
            <div className="flex-1 p-4">
              <textarea 
                className="w-full h-full border border-gray-300 rounded-lg p-4 text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
                value={jsonOutput}
                onChange={(e) => handleJsonOutputChange(e.target.value)}
                style={{ fontFamily: 'Monaco, Menlo, Ubuntu Mono, monospace' }}
              />
            </div>
            
            {/* JSON validation errors */}
            {validationErrors.length > 0 && (
              <div className="p-4 border-t border-gray-200">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-red-700">Validation Errors:</h4>
                  <div className="space-y-1">
                    {validationErrors.map((error, index) => (
                      <div key={index} className="text-xs text-red-600 bg-red-50 p-2 rounded">
                        <code>{error.path}</code>: {error.message}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </aside>
  );
}
