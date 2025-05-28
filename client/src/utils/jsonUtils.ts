interface ValidationError {
  path: string;
  message: string;
}

interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

export function validateJsonStructure(data: any): ValidationResult {
  const errors: ValidationError[] = [];
  
  try {
    // Basic JSON structure validation
    if (typeof data !== 'object' || data === null) {
      errors.push({ path: 'root', message: 'Must be an object' });
      return { valid: false, errors };
    }

    // Validate nested structure
    validateNestedObject(data, '', errors);
    
    return { valid: errors.length === 0, errors };
  } catch (error) {
    errors.push({ path: 'root', message: 'Invalid JSON structure' });
    return { valid: false, errors };
  }
}

function validateNestedObject(obj: any, path: string, errors: ValidationError[]) {
  for (const [key, value] of Object.entries(obj)) {
    const currentPath = path ? `${path}.${key}` : key;
    
    if (value === null || value === undefined) {
      errors.push({ path: currentPath, message: 'Value cannot be null or undefined' });
    } else if (typeof value === 'object' && !Array.isArray(value)) {
      validateNestedObject(value, currentPath, errors);
    }
  }
}

export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (obj instanceof Date) {
    return new Date(obj.getTime()) as unknown as T;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => deepClone(item)) as unknown as T;
  }
  
  const cloned = {} as T;
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }
  
  return cloned;
}

export function setNestedValue(obj: any, path: string, value: any): void {
  const keys = path.split('.');
  let current = obj;
  
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!current[key] || typeof current[key] !== 'object') {
      current[key] = {};
    }
    current = current[key];
  }
  
  current[keys[keys.length - 1]] = value;
}

export function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

export function syncFormToJson(formData: any): string {
  try {
    return JSON.stringify(formData, null, 2);
  } catch (error) {
    return '{}';
  }
}

export function syncJsonToForm(jsonString: string): { success: boolean; data?: any; error?: string } {
  try {
    const data = JSON.parse(jsonString);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: 'Invalid JSON syntax' };
  }
}
