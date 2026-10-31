// Forwards /api calls to the .NET backend during `ng serve`, so no CORS setup is needed.
// Override the target with the API_URL environment variable, e.g. API_URL=https://localhost:7126
const target = process.env.API_URL || 'http://localhost:5096';

export default {
  '/api': {
    target,
    secure: false,
    changeOrigin: true,
  },
};
