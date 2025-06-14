
import { useState, useCallback } from 'react';

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
  email?: boolean;
  url?: boolean;
  numeric?: boolean;
}

export interface ValidationSchema {
  [key: string]: ValidationRule;
}

export interface ValidationErrors {
  [key: string]: string;
}

export const useFormValidation = <T extends Record<string, any>>(
  initialValues: T,
  schema: ValidationSchema
) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = useCallback((name: string, value: any): string | null => {
    const rule = schema[name];
    if (!rule) return null;

    // Required validation
    if (rule.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
      return 'Este campo es obligatorio';
    }

    // Skip other validations if field is empty and not required
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      return null;
    }

    // Email validation
    if (rule.email && typeof value === 'string') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return 'Formato de email inválido';
      }
    }

    // URL validation
    if (rule.url && typeof value === 'string') {
      try {
        new URL(value);
      } catch {
        return 'Formato de URL inválido';
      }
    }

    // Numeric validation
    if (rule.numeric && isNaN(Number(value))) {
      return 'Debe ser un número válido';
    }

    // Length validation
    if (typeof value === 'string') {
      if (rule.minLength && value.length < rule.minLength) {
        return `Mínimo ${rule.minLength} caracteres`;
      }
      if (rule.maxLength && value.length > rule.maxLength) {
        return `Máximo ${rule.maxLength} caracteres`;
      }
    }

    // Pattern validation
    if (rule.pattern && typeof value === 'string' && !rule.pattern.test(value)) {
      return 'Formato inválido';
    }

    // Custom validation
    if (rule.custom) {
      return rule.custom(value);
    }

    return null;
  }, [schema]);

  const setValue = useCallback((name: string, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }));
    
    // Validate field if it's been touched
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({
        ...prev,
        [name]: error || ''
      }));
    }
  }, [validateField, touched]);

  const setTouched = useCallback((name: string) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    
    // Validate field when touched
    const error = validateField(name, values[name]);
    setErrors(prev => ({
      ...prev,
      [name]: error || ''
    }));
  }, [validateField, values]);

  const validateAll = useCallback((): boolean => {
    const newErrors: ValidationErrors = {};
    let isValid = true;

    Object.keys(schema).forEach(name => {
      const error = validateField(name, values[name]);
      if (error) {
        newErrors[name] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    setTouched(Object.keys(schema).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
    
    return isValid;
  }, [schema, validateField, values]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  const hasErrors = Object.values(errors).some(error => error !== '');

  return {
    values,
    errors,
    touched,
    setValue,
    setTouched,
    validateAll,
    reset,
    hasErrors,
    isFieldValid: (name: string) => !errors[name] && touched[name]
  };
};
