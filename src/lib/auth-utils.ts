// Authentication utility functions

/**
 * Clear all authentication data from localStorage
 * This can help resolve issues with cached user data
 */
export function clearAuthData() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('skillvoyager_user');
    localStorage.removeItem('skillvoyager_users');
    console.log('Authentication data cleared');
  }
}

/**
 * Get current user from localStorage
 */
export function getCurrentUser() {
  if (typeof window !== 'undefined') {
    const savedUser = localStorage.getItem('skillvoyager_user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (error) {
        console.error('Error parsing saved user:', error);
        return null;
      }
    }
  }
  return null;
}

/**
 * Get all users from localStorage
 */
export function getAllUsers() {
  if (typeof window !== 'undefined') {
    const users = localStorage.getItem('skillvoyager_users');
    if (users) {
      try {
        return JSON.parse(users);
      } catch (error) {
        console.error('Error parsing users:', error);
        return [];
      }
    }
  }
  return [];
}

/**
 * Debug function to log current auth state
 */
export function debugAuthState() {
  console.log('=== AUTH DEBUG ===');
  console.log('Current user:', getCurrentUser());
  console.log('All users:', getAllUsers());
  console.log('================');
}