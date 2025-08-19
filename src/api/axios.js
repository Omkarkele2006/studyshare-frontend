import axios from 'axios';

// Make sure this is your correct and complete Render URL
const RENDER_URL = 'https://studyshare-backend-xo81.onrender.com'; 

const API = axios.create({
  baseURL: RENDER_URL,
});

export default API;