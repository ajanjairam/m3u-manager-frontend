/// <reference types="vite/client" />

import axios from "axios";

export default axios.create({
  baseURL: import.meta.env.PROD ? "/api/v1/" : "http://127.0.0.1:5000/api/v1/",
});
