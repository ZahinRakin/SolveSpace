# Frontend Backend Connection Updates

## Changes Made

The frontend has been updated to connect to the deployed backend at `https://solvespace-backend.onrender.com` instead of the local development server.

### Files Modified:

1. **`frontend/vite.config.js`**
   - Updated proxy configuration to point to the new backend URL
   - Added environment variable definition for the API base URL

2. **`frontend/src/main.jsx`**
   - Added global axios configuration for production builds
   - Sets `axios.defaults.baseURL` to the deployed backend URL when in production mode

3. **`frontend/src/utils/api.js`** (New file)
   - Created a centralized API configuration with:
     - Automatic base URL selection (dev vs prod)
     - Request interceptor for authentication tokens
     - Response interceptor for token refresh handling
     - Proper error handling for authentication failures

## How It Works:

- **Development Mode**: The Vite proxy redirects `/api/*` requests to the deployed backend
- **Production Mode**: Axios is configured with the full backend URL as the base URL

## Backend URL:
- **Production**: `https://solvespace-backend.onrender.com`
- **Development**: Proxied through Vite development server

All existing API calls using relative paths (e.g., `/api/v1/...`) will now automatically work with the new backend URL without requiring changes to individual components.

## Note:
No changes were needed to individual component files since they all use relative API paths that are now handled by the global axios configuration and Vite proxy.
