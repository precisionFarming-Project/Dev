const axios = require('axios');

const clientId = "96dHZVzsAuujKN4Hs-kqvqusgvhyXeN8fw2mJDLRRkwP5P4YZwwcM4U7Gk1q6tkb42qjGHmfnhbBgAeTp9pSYszETGQNqhQr";
const clientSecret = "lrFxI-iSEg-6-fa016GDKwOrKDuNG2osqkoYX-C4gmd51d44QUBaQOBxZ4CdiCiPOZCeCM5gFzlbeJo4lNrJRtIobwTBBiTISWIM6LP8a-s=";

// OAuth token endpoint (replace with your provider's token URL)
const tokenUrl = "lrFxI-iSEg-6-fa016GDKwOrKDuNG2osqkoYX-C4gmd51d44QUBaQOBxZ4CdiCiPOZCeCM5gFzlbeJo4lNrJRtIobwTBBiTISWIM6LP8a-s=";

const getToken = async () => {
  try {
    const response = await axios.post(
      tokenUrl,
      new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: clientId,
        client_secret: clientSecret,
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );
    console.log("Access Token:", response.data.access_token);
    return response.data.access_token;
  } catch (error) {
    console.error("Error fetching token:", error.response?.data || error.message);
  }
};

getToken();
