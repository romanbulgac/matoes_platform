/**
 * API Response Transformation Utilities
 * Converts backend PascalCase responses to frontend camelCase
 * 
 * Backend: ASP.NET Core with PropertyNamingPolicy = null (PascalCase)
 * Frontend: JavaScript/TypeScript conventions (camelCase)
 * 
 * @module utils/apiTransform
 * @version 1.0
 * @date October 14, 2025
 */

/**
 * Recursively converts object keys from PascalCase to camelCase
 * 
 * Features:
 * - Deep object traversal
 * - Array element transformation
 * - Null/undefined safe
 * - Type-safe with generics
 * 
 * @template T - Expected output type
 * @param obj - Input object with PascalCase keys
 * @returns Object with camelCase keys
 * 
 * @example
 * ```typescript
 * // Backend response
 * const raw = { TotalChildren: 5, InvitationStatistics: { ActiveChildren: 3 } };
 * 
 * // Transform to camelCase
 * const data = toCamelCase<ParentDashboardDto>(raw);
 * // { totalChildren: 5, invitationStatistics: { activeChildren: 3 } }
 * ```
 */
export function toCamelCase<T>(obj: unknown): T {
  if (obj === null || obj === undefined) return obj as T;
  if (typeof obj !== 'object') return obj as T;
  if (Array.isArray(obj)) return obj.map(item => toCamelCase(item)) as T;
  
  const camelObj: Record<string, unknown> = {};
  for (const key in obj as Record<string, unknown>) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const camelKey = key.charAt(0).toLowerCase() + key.slice(1);
      camelObj[camelKey] = toCamelCase((obj as Record<string, unknown>)[key]);
    }
  }
  return camelObj as T;
}

/**
 * Recursively converts object keys from camelCase to PascalCase
 * 
 * Used for sending data to backend (if needed)
 * Note: Most DTOs are already converted by convertKeysToPascalCase utility
 * 
 * @template T - Expected output type
 * @param obj - Input object with camelCase keys
 * @returns Object with PascalCase keys
 * 
 * @example
 * ```typescript
 * // Frontend data
 * const data = { childName: 'Ion', childemail: 'ion@example.com' };
 * 
 * // Transform to PascalCase
 * const dto = toPascalCase(data);
 * // { Childname: 'Ion', Childemail: 'ion@example.com' }
 * ```
 */
export function toPascalCase<T>(obj: unknown): T {
  if (obj === null || obj === undefined) return obj as T;
  if (typeof obj !== 'object') return obj as T;
  if (Array.isArray(obj)) return obj.map(item => toPascalCase(item)) as T;
  
  const pascalObj: Record<string, unknown> = {};
  for (const key in obj as Record<string, unknown>) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const pascalKey = key.charAt(0).toUpperCase() + key.slice(1);
      pascalObj[pascalKey] = toPascalCase((obj as Record<string, unknown>)[key]);
    }
  }
  return pascalObj as T;
}

/**
 * Type guard to check if value is a plain object
 */
export function isPlainObject(value: unknown): value is Record<string, unknown> {
  return (
    value !== null &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    !(value instanceof Date) &&
    !(value instanceof RegExp)
  );
}

/**
 * Safely transforms API response with error handling
 * 
 * @template T - Expected output type
 * @param response - Raw API response
 * @param fallback - Fallback value if transformation fails
 * @returns Transformed response or fallback
 * 
 * @example
 * ```typescript
 * const data = safeTransform<UserDto>(rawResponse, { id: '', name: 'Unknown' });
 * ```
 */
export function safeTransform<T>(response: unknown, fallback: T): T {
  try {
    return toCamelCase<T>(response);
  } catch (error) {
    console.error('❌ Transform error:', error);
    return fallback;
  }
}
