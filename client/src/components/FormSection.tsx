import { useState } from "react";
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

  // Track collapsed state for each object field - initialize based on defaultCollapsed
  const [collapsedObjects, setCollapsedObjects] = useState<Record<string, boolean>>(() => {
    const initialState: Record<string, boolean> = {};
    Object.entries(sectionMappings).forEach(([fieldKey, fieldConfig]: [string, any]) => {
      if (fieldConfig.type === 'object' && fieldConfig.defaultCollapsed !== undefined) {
        initialState[fieldKey] = fieldConfig.defaultCollapsed;
      }
    });
    return initialState;
  });

  // Toggle collapse state for object fields
  const toggleObjectCollapse = (fieldKey: string) => {
    setCollapsedObjects(prev => ({
      ...prev,
      [fieldKey]: !prev[fieldKey]
    }));
  };

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
      
      case 'uuid':
        return (
          <div className="flex space-x-2">
            <input
              type="text"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors font-mono text-sm"
              placeholder="UUID will be generated automatically"
              value={value || ''}
              onChange={(e) => updateFormData(path, e.target.value)}
            />
            <button
              type="button"
              onClick={() => {
                const uuid = crypto.randomUUID();
                updateFormData(path, uuid);
              }}
              className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Generate
            </button>
          </div>
        );
      
      case 'number':
        return (
          <input
            type="number"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={value || ''}
            min={fieldConfig.min}
            max={fieldConfig.max}
            onChange={(e) => updateFormData(path, parseInt(e.target.value) || 0)}
          />
        );
      
      case 'number-nullable':
        return (
          <div className="flex items-center space-x-3">
            <input
              type="number"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={value === null ? '' : value || ''}
              min={fieldConfig.min}
              max={fieldConfig.max}
              onChange={(e) => {
                const val = e.target.value === '' ? null : (parseInt(e.target.value) || 0);
                updateFormData(path, val);
              }}
            />
            <button
              type="button"
              onClick={() => updateFormData(path, null)}
              className="px-3 py-2 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              Set Null
            </button>
          </div>
        );
      
      case 'boolean-nullable':
        return (
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name={`${path}-nullable`}
                checked={value === true}
                onChange={() => updateFormData(path, true)}
                className="w-4 h-4 text-blue-600"
              />
              <span className="text-sm">True</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name={`${path}-nullable`}
                checked={value === false}
                onChange={() => updateFormData(path, false)}
                className="w-4 h-4 text-blue-600"
              />
              <span className="text-sm">False</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name={`${path}-nullable`}
                checked={value === null}
                onChange={() => updateFormData(path, null)}
                className="w-4 h-4 text-blue-600"
              />
              <span className="text-sm">Null</span>
            </label>
          </div>
        );
      
      case 'array-simple':
        const arrayValue = value || [];
        return (
          <div className="space-y-2">
            {arrayValue.map((item: string, index: number) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={item}
                  onChange={(e) => {
                    const newArray = [...arrayValue];
                    newArray[index] = e.target.value;
                    updateFormData(path, newArray);
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    const newArray = arrayValue.filter((_: any, i: number) => i !== index);
                    updateFormData(path, newArray);
                  }}
                  className="px-2 py-2 text-red-600 hover:bg-red-50 rounded"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                const newArray = [...arrayValue, ''];
                updateFormData(path, newArray);
              }}
              className="w-full px-3 py-2 border-2 border-dashed border-gray-300 text-gray-500 rounded-lg hover:border-blue-400 hover:text-blue-600"
            >
              + Add Item
            </button>
          </div>
        );

      case 'array-select':
        const arraySelectValue = value || [];
        return (
          <div className="space-y-3">
            {/* Selected items */}
            <div className="space-y-2">
              {arraySelectValue.map((item: string, index: number) => (
                <div key={index} className="flex items-center space-x-2 bg-blue-50 border border-blue-200 rounded-lg p-2">
                  <span className="flex-1 text-sm text-blue-800">{fieldConfig.options?.find((opt: any) => opt.value === item)?.label || item}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const newArray = arraySelectValue.filter((_: any, i: number) => i !== index);
                      updateFormData(path, newArray);
                    }}
                    className="px-2 py-1 text-blue-600 hover:bg-blue-100 rounded text-sm"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            
            {/* Add new item */}
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value=""
              onChange={(e) => {
                if (e.target.value && !arraySelectValue.includes(e.target.value)) {
                  const newArray = [...arraySelectValue, e.target.value];
                  updateFormData(path, newArray);
                }
                e.target.value = '';
              }}
            >
              <option value="">Select to add...</option>
              {fieldConfig.options?.filter((option: any) => !arraySelectValue.includes(option.value)).map((option: any) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
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
      
      case 'object':
      case 'nested-object':
        // Handle both simple object (key-value editor) and complex object (defined fields)
        if (fieldConfig.fields) {
          // Complex object with defined fields - make it collapsible
          const isCollapsed = collapsedObjects[fieldKey];
          
          return (
            <div className="border border-gray-200 rounded-lg bg-gray-50">
              {/* Collapsible Header */}
              <button
                type="button"
                onClick={() => toggleObjectCollapse(fieldKey)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-100 transition-colors rounded-lg"
              >
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-900">{fieldConfig.label}</span>
                  {fieldConfig.explainer && (
                    <button 
                      className="explainer-icon w-4 h-4 text-gray-400 hover:text-blue-600 transition-colors hover:scale-110 flex items-center justify-center rounded-full bg-gray-100 hover:bg-blue-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        showExplainer(fieldKey, fieldConfig, path);
                      }}
                      title="Click for field explanation"
                    >
                      <span className="text-xs font-bold">?</span>
                    </button>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500">
                    {Object.keys(fieldConfig.fields).length} fields
                  </span>
                  <span className={`text-gray-500 transition-transform duration-200 ${isCollapsed ? 'rotate-0' : 'rotate-90'}`}>
                    ▶
                  </span>
                </div>
              </button>

              {/* Collapsible Content */}
              {!isCollapsed && (
                <div className="px-4 pb-4 space-y-4 border-t border-gray-200 bg-white">
                  {Object.entries(fieldConfig.fields).map(([nestedKey, nestedConfig]: [string, any]) => (
                    <div key={nestedKey} className="space-y-2">
                      <label className="flex items-center space-x-2 text-sm font-medium text-gray-900">
                        <span>{nestedConfig.label || nestedKey}</span>
                        {nestedConfig.explainer && (
                          <button 
                            className="explainer-icon w-4 h-4 text-gray-400 hover:text-blue-600 transition-colors hover:scale-110 flex items-center justify-center rounded-full bg-gray-100 hover:bg-blue-100"
                            onClick={() => showExplainer(nestedKey, nestedConfig, `${path}.${nestedKey}`)}
                            title="Click for field explanation"
                          >
                            <span className="text-xs font-bold">?</span>
                          </button>
                        )}
                      </label>
                      {renderField(nestedKey, nestedConfig, `${path}.${nestedKey}`)}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        } else {
          // Simple object (key-value pairs editor) - make it collapsible
          const objectValue = value || {};
          const entries = Object.entries(objectValue);
          const isCollapsed = collapsedObjects[fieldKey];
          
          return (
            <div className="border border-gray-200 rounded-lg bg-gray-50">
              {/* Collapsible Header */}
              <button
                type="button"
                onClick={() => toggleObjectCollapse(fieldKey)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-100 transition-colors rounded-lg"
              >
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-900">{fieldConfig.label}</span>
                  {fieldConfig.explainer && (
                    <button 
                      className="explainer-icon w-4 h-4 text-gray-400 hover:text-blue-600 transition-colors hover:scale-110 flex items-center justify-center rounded-full bg-gray-100 hover:bg-blue-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        showExplainer(fieldKey, fieldConfig, path);
                      }}
                      title="Click for field explanation"
                    >
                      <span className="text-xs font-bold">?</span>
                    </button>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500">
                    {entries.length} properties
                  </span>
                  <span className={`text-gray-500 transition-transform duration-200 ${isCollapsed ? 'rotate-0' : 'rotate-90'}`}>
                    ▶
                  </span>
                </div>
              </button>

              {/* Collapsible Content */}
              {!isCollapsed && (
                <div className="px-4 pb-4 space-y-3 border-t border-gray-200 bg-white">
                  {entries.map(([key, val], index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        placeholder="Key"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={key}
                        onChange={(e) => {
                          const newObject = { ...objectValue };
                          delete newObject[key];
                          if (e.target.value) {
                            newObject[e.target.value] = val;
                          }
                          updateFormData(path, newObject);
                        }}
                      />
                      <input
                        type="text"
                        placeholder="Value"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={typeof val === 'object' && val !== null ? JSON.stringify(val) : String(val || '')}
                        onChange={(e) => {
                          const newObject = { ...objectValue };
                          try {
                            // Try to parse as JSON first, fallback to string
                            newObject[key] = e.target.value.startsWith('{') || e.target.value.startsWith('[') 
                              ? JSON.parse(e.target.value) 
                              : e.target.value;
                          } catch {
                            newObject[key] = e.target.value;
                          }
                          updateFormData(path, newObject);
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newObject = { ...objectValue };
                          delete newObject[key];
                          updateFormData(path, newObject);
                        }}
                        className="px-2 py-2 text-red-600 hover:bg-red-50 rounded"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      const newObject = { ...objectValue, [`key${entries.length + 1}`]: '' };
                      updateFormData(path, newObject);
                    }}
                    className="w-full px-3 py-2 border-2 border-dashed border-gray-300 text-gray-500 rounded-lg hover:border-blue-400 hover:text-blue-600"
                  >
                    + Add Property
                  </button>
                </div>
              )}
            </div>
          );
        }
      
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
              const path = `${activeSection}.subsections.${activeTab}.${fieldKey}`;
              
              return (
                <div key={fieldKey} className="space-y-2">
                  {/* Only show label wrapper for fields that don't handle their own labels */}
                  {!['checkbox', 'object', 'nested-object'].includes(fieldConfig.type) && (
                    <label className="flex items-center space-x-2 text-sm font-medium text-gray-900">
                      <span>{fieldConfig.label}</span>
                      {fieldConfig.explainer && (
                        <button 
                          className="explainer-icon w-4 h-4 text-gray-400 hover:text-blue-600 transition-colors hover:scale-110 flex items-center justify-center rounded-full bg-gray-100 hover:bg-blue-100"
                          onClick={() => showExplainer(fieldKey, fieldConfig, path)}
                          title="Click for field explanation"
                        >
                          <span className="text-xs font-bold">?</span>
                        </button>
                      )}
                    </label>
                  )}
                  
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
