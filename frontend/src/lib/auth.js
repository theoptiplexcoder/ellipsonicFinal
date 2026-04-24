// Get stored JWT token
export const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
};

// Remove token on logout
export const removeToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
  }
};

// Get authorization headers
export const getAuthHeaders = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Decode JWT token to get user data
export const decodeToken = (token) => {
  try {
    if (!token) return null;
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    
    const decoded = JSON.parse(atob(parts[1]));
    return decoded;
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
};

// Get user data from token
export const getUserFromToken = () => {
  const token = getToken();
  return decodeToken(token);
};
