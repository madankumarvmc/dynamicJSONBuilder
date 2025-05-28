import { useAppContext } from "../context/AppContext";

export default function FormSection() {
  const { 
    activeSection, 
    activeTab, 
    sections, 
    mappings, 
    formData, 
    updateFormData,
    showExplainer,
    resetForm,
    validateForm,
    saveConfiguration 
  } = useAppContext();

  const currentSection = sections[activeSection];
  const currentSubsection = currentSection?.subsections?.[activeTab];
  const sectionMappings = mappings[activeSection]?.[activeTab] || {};

  const renderField = (fieldKey: string, fieldConfig: any, path: string) => {
    const value = getNestedValue(formData, path);
    
    switch (fieldConfig.type) {
      case 'text':
      case 'email':
        return (
          <input
            type={fieldConfig.type}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder={fieldConfig.placeholder}
            value={value || ''}
            onChange={(e) => updateFormData(path, e.target.value)}
          />
        );
      
      case 'select':
        return (
          <select
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            value={value || ''}
            onChange={(e) => updateFormData(path, e.target.value)}
          >
            {fieldConfig.options?.map((option: any) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      
      case 'checkbox':
        return (
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              checked={value || false}
              onChange={(e) => updateFormData(path, e.target.checked)}
            />
            <span className="text-sm font-medium text-gray-900">{fieldConfig.label}</span>
          </label>
        );
      
      case 'checkbox-group':
        return (
          <div className="grid grid-cols-2 gap-3">
            {fieldConfig.options?.map((option: any) => (
              <label key={option.value} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  checked={(value || []).includes(option.value)}
                  onChange={(e) => {
                    const currentArray = value || [];
                    const newArray = e.target.checked
                      ? [...currentArray, option.value]
                      : currentArray.filter((v: any) => v !== option.value);
                    updateFormData(path, newArray);
                  }}
                />
                <span className="text-sm text-gray-900">{option.label}</span>
              </label>
            ))}
          </div>
        );
      
      case 'number':
        return (
          <input
            type="number"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={value || ''}
            min={fieldConfig.min}
            max={fieldConfig.max}
            onChange={(e) => updateFormData(path, parseInt(e.target.value) || 0)}
          />
        );
      
      default:
        return null;
    }
  };

  const getNestedValue = (obj: any, path: string) => {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  };

  if (!currentSection || !currentSubsection) {
    return (
      <main className="flex-1 overflow-auto bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Configuration Found</h2>
          <p className="text-gray-600">Please select a valid section and subsection.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 overflow-auto bg-gray-50">
      <div className="max-w-4xl mx-auto p-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          
          {/* Section header */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              {currentSection.title}
            </h2>
            <p className="text-gray-600">
              {currentSection.description}
            </p>
          </div>
          
          {/* Dynamic form fields */}
          <div className="space-y-6">
            {Object.entries(sectionMappings).map(([fieldKey, fieldConfig]: [string, any]) => {
              const path = `${activeSection}.${activeTab}.${fieldKey}`;
              
              return (
                <div key={fieldKey} className="space-y-2">
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-900">
                    <span>{fieldConfig.label}</span>
                    {fieldConfig.explainer && (
                      <button 
                        className="explainer-icon w-4 h-4 text-gray-400 hover:text-blue-600 transition-colors hover:scale-110"
                        onClick={() => showExplainer(fieldKey, fieldConfig, path)}
                      >
                        <i className="fas fa-question-circle"></i>
                      </button>
                    )}
                  </label>
                  
                  {renderField(fieldKey, fieldConfig, path)}
                  
                  {fieldConfig.description && (
                    <p className="text-xs text-gray-500">{fieldConfig.description}</p>
                  )}
                </div>
              );
            })}
          </div>
          
          {/* Form actions */}
          <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between">
            <button 
              onClick={resetForm}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium"
            >
              Reset to Defaults
            </button>
            <div className="space-x-3">
              <button 
                onClick={validateForm}
                className="px-6 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-medium"
              >
                Validate
              </button>
              <button 
                onClick={saveConfiguration}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
              >
                Save Configuration
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
