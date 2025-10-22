/**
 * Case Conversion Utilities
 * Converts between camelCase (JavaScript) and PascalCase (C#)
 */

/**
 * Converts camelCase to PascalCase
 * @param str - camelCase string
 * @returns PascalCase string
 */
export function toPascalCase(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Converts PascalCase to camelCase
 * @param str - PascalCase string
 * @returns camelCase string
 */
export function toCamelCase(str: string): string {
  return str.charAt(0).toLowerCase() + str.slice(1);
}

/**
 * Converts all keys in an object from camelCase to PascalCase
 * @param obj - Object with camelCase keys
 * @returns Object with PascalCase keys
 */
export function convertKeysToPascalCase<T extends Record<string, unknown>>(
  obj: T
): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  
  for (const [key, value] of Object.entries(obj)) {
    const pascalKey = toPascalCase(key);
    
    // Рекурсивно конвертируем вложенные объекты
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      result[pascalKey] = convertKeysToPascalCase(value as Record<string, unknown>);
    } else if (Array.isArray(value)) {
      result[pascalKey] = value.map(item => 
        item !== null && typeof item === 'object' && !Array.isArray(item)
          ? convertKeysToPascalCase(item as Record<string, unknown>)
          : item
      );
    } else {
      result[pascalKey] = value;
    }
  }
  
  return result;
}

/**
 * Converts all keys in an object from PascalCase to camelCase
 * @param obj - Object with PascalCase keys
 * @returns Object with camelCase keys
 */
export function convertKeysToCamelCase<T extends Record<string, unknown>>(
  obj: T
): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  
  for (const [key, value] of Object.entries(obj)) {
    const camelKey = toCamelCase(key);
    
    // Рекурсивно конвертируем вложенные объекты
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      result[camelKey] = convertKeysToCamelCase(value as Record<string, unknown>);
    } else if (Array.isArray(value)) {
      result[camelKey] = value.map(item => 
        item !== null && typeof item === 'object' && !Array.isArray(item)
          ? convertKeysToCamelCase(item as Record<string, unknown>)
          : item
      );
    } else {
      result[camelKey] = value;
    }
  }
  
  return result;
}
