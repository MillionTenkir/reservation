// Create a base fetch configuration
const baseConfig = {
  headers: {
    "Content-Type": "application/json",
  },
};

// Helper function to add authorization token
const addAuthHeader = (config: RequestInit) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (token) {
    return {
      ...config,
      headers: {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      },
    };
  }
  return config;
};

// Helper function to handle response
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    if (response.status === 401) {
      // Clear local storage and redirect to login
      if (typeof window !== "undefined") {
        localStorage.clear();
        window.location.href = "/";
      }
    }
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// API client function
const apiClient = async (url: string, config: RequestInit = {}) => {
  const baseURL = process.env.NEXT_PUBLIC_API_URL || "";
  const fullUrl = `${baseURL}${url}`;

  // Merge base config with provided config
  const mergedConfig = {
    ...baseConfig,
    ...config,
    headers: {
      ...baseConfig.headers,
      ...config.headers,
    },
  };

  // Add auth token if available
  const finalConfig = addAuthHeader(mergedConfig);

  try {
    const response = await fetch(fullUrl, finalConfig);
    return handleResponse(response);
  } catch (error) {
    return Promise.reject(error);
  }
};

export default apiClient;
