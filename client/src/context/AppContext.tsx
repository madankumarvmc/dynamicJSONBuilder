import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import mappingsData from '../config/mappings.json';
import templatesData from '../config/templates.json';
import defaultsData from '../config/defaults.json';
import { validateJsonStructure, deepClone, setNestedValue } from '../utils/jsonUtils';

interface ExplainerModal {
  show: boolean;
  title: string;
  content: string;
  fieldType: string;
  required: boolean;
  jsonPath: string;
}

interface ValidationError {
  path: string;
  message: string;
}

interface AppContextType {
  leftSidebarExpanded: boolean;
  rightSidebarExpanded: boolean;
  activeSection: string;
  activeTab: string;
  formData: any;
  jsonOutput: string;
  jsonValid: boolean;
  validationErrors: ValidationError[];
  explainerModal: ExplainerModal;
  sections: any;
  mappings: any;
  toggleLeftSidebar: () => void;
  toggleRightSidebar: () => void;
  setActiveSection: (section: string) => void;
  setActiveTab: (tab: string) => void;
  updateFormData: (path: string, value: any) => void;
  setJsonOutput: (json: string) => void;
  handleJsonOutputChange: (json: string) => void;
  showExplainer: (fieldKey: string, fieldConfig: any, path: string) => void;
  closeExplainer: () => void;
  resetForm: () => void;
  validateForm: () => void;
  saveConfiguration: () => void;
  exportJson: () => void;
  formatJson: () => void;
  copyJson: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [leftSidebarExpanded, setLeftSidebarExpanded] = useState(true);
  const [rightSidebarExpanded, setRightSidebarExpanded] = useState(true);
  const [activeSection, setActiveSection] = useState(() => {
    // Automatically pick the first section from the templates
    const firstSection = Object.keys(templatesData)[0];
    return firstSection || '';
  });
  const [activeTab, setActiveTab] = useState(() => {
    // Automatically pick the first subsection from the first section
    const firstSection = Object.keys(templatesData)[0];
    if (firstSection && (templatesData as any)[firstSection]?.subsections) {
      return Object.keys((templatesData as any)[firstSection].subsections)[0] || 'general';
    }
    return 'general';
  });
  const [formData, setFormData] = useState(templatesData);
  const [jsonOutput, setJsonOutput] = useState('');
  const [jsonValid, setJsonValid] = useState(true);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [explainerModal, setExplainerModal] = useState<ExplainerModal>({
    show: false,
    title: '',
    content: '',
    fieldType: '',
    required: false,
    jsonPath: ''
  });

  const sections = templatesData;
  const mappings = mappingsData;

  // Initialize active tab when section changes
  useEffect(() => {
    const currentSection = (sections as any)[activeSection];
    if (currentSection && currentSection.subsections) {
      const firstTab = Object.keys(currentSection.subsections)[0];
      if (firstTab && firstTab !== activeTab) {
        setActiveTab(firstTab);
      }
    }
  }, [activeSection]);

  // Update JSON output when form data changes or active section/tab changes
  useEffect(() => {
    try {
      // Get only the current section's subsection data
      const currentSectionData = (formData as any)[activeSection];
      const currentSubsectionData = currentSectionData?.subsections?.[activeTab];
      
      if (currentSubsectionData) {
        const formatted = JSON.stringify(currentSubsectionData, null, 2);
        setJsonOutput(formatted);
      } else {
        setJsonOutput('{}');
      }
      setJsonValid(true);
      setValidationErrors([]);
    } catch (error) {
      setJsonValid(false);
      setValidationErrors([{ path: 'root', message: 'Invalid JSON structure' }]);
    }
  }, [formData, activeSection, activeTab]);

  const toggleLeftSidebar = () => {
    setLeftSidebarExpanded(!leftSidebarExpanded);
  };

  const toggleRightSidebar = () => {
    setRightSidebarExpanded(!rightSidebarExpanded);
  };

  const updateFormData = (path: string, value: any) => {
    const newFormData = deepClone(formData);
    setNestedValue(newFormData, path, value);
    
    // Auto-populate fields when taskKind changes
    if (path.includes('taskKind') && value && (defaultsData as any)[value]) {
      const pathParts = path.split('.');
      const sectionPath = pathParts.slice(0, -1).join('.');
      const defaultValues = (defaultsData as any)[value];
      
      // Merge default values into the current subsection
      Object.keys(defaultValues).forEach(key => {
        const fieldPath = `${sectionPath}.${key}`;
        setNestedValue(newFormData, fieldPath, defaultValues[key]);
      });
    }
    
    setFormData(newFormData);
  };

  const handleJsonOutputChange = (json: string) => {
    setJsonOutput(json);
    
    try {
      const parsed = JSON.parse(json);
      
      // Use field mappings for proper validation instead of generic validation
      const currentMappings = mappings[activeSection]?.[activeTab] || {};
      const validationErrors = validateWithMappings(parsed, currentMappings);
      
      if (validationErrors.length === 0) {
        // Update only the current subsection in the form data
        const newFormData = deepClone(formData);
        if ((newFormData as any)[activeSection]?.subsections) {
          (newFormData as any)[activeSection].subsections[activeTab] = parsed;
          setFormData(newFormData);
        }
        setJsonValid(true);
        setValidationErrors([]);
      } else {
        setJsonValid(false);
        setValidationErrors(validationErrors);
      }
    } catch (error) {
      setJsonValid(false);
      setValidationErrors([{ path: 'root', message: 'Invalid JSON syntax' }]);
    }
  };

  // Validate JSON data against field mappings
  const validateWithMappings = (data: any, mappings: any): ValidationError[] => {
    const errors: ValidationError[] = [];

    Object.entries(mappings).forEach(([fieldKey, fieldConfig]: [string, any]) => {
      const value = data[fieldKey];
      
      // Check if field is required and missing
      if (fieldConfig.required && (value === undefined || value === null || value === '')) {
        errors.push({ path: fieldKey, message: 'This field is required' });
        return;
      }

      // Skip validation for optional fields that are null/undefined
      if (!fieldConfig.required && (value === null || value === undefined)) {
        return;
      }

      // Type-specific validation
      switch (fieldConfig.type) {
        case 'number':
          if (value !== null && value !== undefined && value !== '') {
            const numValue = Number(value);
            if (isNaN(numValue)) {
              errors.push({ path: fieldKey, message: 'Must be a valid number' });
            } else if (fieldConfig.min !== undefined && numValue < fieldConfig.min) {
              errors.push({ path: fieldKey, message: `Must be at least ${fieldConfig.min}` });
            } else if (fieldConfig.max !== undefined && numValue > fieldConfig.max) {
              errors.push({ path: fieldKey, message: `Must be at most ${fieldConfig.max}` });
            }
          }
          break;
        
        case 'select':
          if (value && fieldConfig.options) {
            const validOptions = fieldConfig.options.map((opt: any) => opt.value);
            if (!validOptions.includes(value)) {
              errors.push({ path: fieldKey, message: `Must be one of: ${validOptions.join(', ')}` });
            }
          }
          break;
        
        case 'array-simple':
        case 'array-select':
          if (value !== null && value !== undefined && !Array.isArray(value)) {
            errors.push({ path: fieldKey, message: 'Must be an array' });
          }
          break;
        
        case 'object':
          if (value !== null && value !== undefined && typeof value !== 'object') {
            errors.push({ path: fieldKey, message: 'Must be an object' });
          }
          break;
      }
    });

    return errors;
  };

  const showExplainer = (fieldKey: string, fieldConfig: any, path: string) => {
    setExplainerModal({
      show: true,
      title: `${fieldConfig.label} Field`,
      content: fieldConfig.explainer || 'No explanation available for this field.',
      fieldType: fieldConfig.type || 'text',
      required: fieldConfig.required || false,
      jsonPath: path
    });
  };

  const closeExplainer = () => {
    setExplainerModal(prev => ({ ...prev, show: false }));
  };

  const resetForm = () => {
    setFormData(deepClone(templatesData));
  };

  const validateForm = () => {
    const validation = validateJsonStructure(formData);
    setJsonValid(validation.valid);
    setValidationErrors(validation.errors);
    
    if (validation.valid) {
      alert('Form validation passed!');
    } else {
      alert('Form validation failed. Check the JSON panel for errors.');
    }
  };

  const saveConfiguration = () => {
    if (jsonValid) {
      // In a real app, this would save to a backend
      localStorage.setItem('jsonGeneratorConfig', JSON.stringify(formData));
      alert('Configuration saved successfully!');
    } else {
      alert('Cannot save invalid configuration. Please fix errors first.');
    }
  };

  const exportJson = () => {
    // Export only the current subsection data
    const currentSectionData = (formData as any)[activeSection];
    const currentSubsectionData = currentSectionData?.subsections?.[activeTab] || {};
    
    const dataStr = JSON.stringify(currentSubsectionData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${activeSection}-${activeTab}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const formatJson = () => {
    try {
      const parsed = JSON.parse(jsonOutput);
      const formatted = JSON.stringify(parsed, null, 2);
      setJsonOutput(formatted);
    } catch (error) {
      alert('Cannot format invalid JSON');
    }
  };

  const copyJson = () => {
    navigator.clipboard.writeText(jsonOutput).then(() => {
      alert('JSON copied to clipboard!');
    }).catch(() => {
      alert('Failed to copy JSON to clipboard');
    });
  };

  const contextValue: AppContextType = {
    leftSidebarExpanded,
    rightSidebarExpanded,
    activeSection,
    activeTab,
    formData,
    jsonOutput,
    jsonValid,
    validationErrors,
    explainerModal,
    sections,
    mappings,
    toggleLeftSidebar,
    toggleRightSidebar,
    setActiveSection,
    setActiveTab,
    updateFormData,
    setJsonOutput: handleJsonOutputChange,
    handleJsonOutputChange,
    showExplainer,
    closeExplainer,
    resetForm,
    validateForm,
    saveConfiguration,
    exportJson,
    formatJson,
    copyJson
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
