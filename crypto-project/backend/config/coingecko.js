import axios from "axios";

const DEMO_BASE_URL = "https://api.coingecko.com/api/v3";
const PRO_BASE_URL = "https://pro-api.coingecko.com/api/v3";

const getApiPlan = () =>
  (process.env.COINGECKO_API_PLAN || process.env.COINGECKO_API_TYPE || "demo")
    .trim()
    .toLowerCase();

const getApiKeyConfig = () => {
  const plan = getApiPlan();
  const proKey = process.env.COINGECKO_PRO_API_KEY;
  const demoKey = process.env.COINGECKO_DEMO_API_KEY;
  const genericKey = process.env.COINGECKO_API_KEY;

  if (plan === "pro" || proKey) {
    return {
      baseURL: PRO_BASE_URL,
      headers: proKey || genericKey ? { "x-cg-pro-api-key": proKey || genericKey } : {},
    };
  }

  return {
    baseURL: DEMO_BASE_URL,
    headers: demoKey || genericKey ? { "x-cg-demo-api-key": demoKey || genericKey } : {},
  };
};

export const coingeckoGet = (path, options = {}) => {
  const { baseURL, headers } = getApiKeyConfig();

  return axios.get(`${baseURL}${path}`, {
    timeout: 10000,
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  });
};

export const getCoinGeckoErrorDetails = (error) => ({
  status: error.response?.status,
  message: error.response?.data?.error || error.response?.data?.message || error.message,
});
