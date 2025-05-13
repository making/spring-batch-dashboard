// httpClient.ts
// A utility HTTP client for handling API requests with consistent error handling

/**
 * Error class for authentication errors (401)
 */
export class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthenticationError';
  }
}

/**
 * Custom HTTP client with error handling
 * - Handles 401 errors by throwing a specific AuthenticationError
 * - Provides standardized error handling for all API requests
 */
const httpClient = {
  /**
   * Makes a fetch request with error handling
   * @param url The URL to fetch
   * @param options Fetch options
   * @returns The response data
   */
  async fetch<T>(url: string, options?: RequestInit): Promise<T> {
    const response = await fetch(url, options);
    
    // Handle unauthorized access (401 error)
    if (response.status === 401) {
      // Throw a specific authentication error
      throw new AuthenticationError('Authentication required. Please log in to continue.');
    }
    
    // Handle other HTTP errors
    if (!response.ok) {
      // Try to parse error response
      try {
        const errorData = await response.json();
        throw errorData;
      } catch {
        // If parsing fails, throw generic error with status
        throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
      }
    }
    
    // Parse successful response
    return await response.json() as T;
  },
  
  /**
   * GET request
   * @param url The URL to fetch
   * @param options Additional fetch options
   * @returns The response data
   */
  async get<T>(url: string, options?: RequestInit): Promise<T> {
    return this.fetch<T>(url, { 
      method: 'GET',
      ...options
    });
  },
  
  /**
   * POST request
   * @param url The URL to post to
   * @param data The data to send
   * @param options Additional fetch options
   * @returns The response data
   */
  async post<T, D>(url: string, data: D, options?: RequestInit): Promise<T> {
    return this.fetch<T>(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      },
      body: JSON.stringify(data),
      ...options
    });
  },
  
  /**
   * PUT request
   * @param url The URL to put to
   * @param data The data to send
   * @param options Additional fetch options
   * @returns The response data
   */
  async put<T, D>(url: string, data: D, options?: RequestInit): Promise<T> {
    return this.fetch<T>(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      },
      body: JSON.stringify(data),
      ...options
    });
  },
  
  /**
   * DELETE request
   * @param url The URL to delete from
   * @param options Additional fetch options
   * @returns The response data
   */
  async delete<T>(url: string, options?: RequestInit): Promise<T> {
    return this.fetch<T>(url, {
      method: 'DELETE',
      ...options
    });
  }
};

export default httpClient;
