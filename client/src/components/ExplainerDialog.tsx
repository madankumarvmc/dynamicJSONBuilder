import { useAppContext } from "../context/AppContext";

export default function ExplainerDialog() {
  const { explainerModal, closeExplainer } = useAppContext();

  if (!explainerModal.show) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={closeExplainer}
    >
      <div 
        className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              {explainerModal.title}
            </h3>
            <button 
              className="text-gray-400 hover:text-gray-600"
              onClick={closeExplainer}
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>
        
        {/* Modal content */}
        <div className="p-6">
          <p className="text-gray-700 leading-relaxed">
            {explainerModal.content}
          </p>
          
          {/* Field metadata */}
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Field Properties:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>
                <strong>Type:</strong>{' '}
                <code className="text-xs bg-gray-200 px-1 rounded">
                  {explainerModal.fieldType}
                </code>
              </li>
              <li>
                <strong>Required:</strong>{' '}
                <span>{explainerModal.required ? 'Yes' : 'No'}</span>
              </li>
              <li>
                <strong>JSON Path:</strong>{' '}
                <code className="text-xs bg-gray-200 px-1 rounded">
                  {explainerModal.jsonPath}
                </code>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Modal footer */}
        <div className="p-6 border-t border-gray-200 flex justify-end">
          <button 
            onClick={closeExplainer}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
