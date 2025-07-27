const API_KEY_SERVER_URL = "https://api-key-worker.sampadaa.workers.dev/get-gemini-api-key"; 

async function fetchApiKeyFromServer() {
  try {
    console.log("Background: Fetching API key from backend server...");
    const response = await fetch(API_KEY_SERVER_URL);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Server responded with status ${response.status}: ${errorText}`);
    }
    const data = await response.json();
    if (data.apiKey) {
      console.log("Background: API key successfully fetched from server.");
      await chrome.storage.local.set({ geminiApiKey: data.apiKey });
      return data.apiKey;
    } else {
      throw new Error("API key not found in server response.");
    }
  } catch (error) {
    console.error("Background: Error fetching API key from server:", error);
    return null;
  }
}

fetchApiKeyFromServer();

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getGeminiApiKey") {
    console.log("Background: Received request for API key from content script.");
    chrome.storage.local.get(['geminiApiKey'], async function(result) {
      let apiKey = result.geminiApiKey;
      if (!apiKey) {
        apiKey = await fetchApiKeyFromServer();
      }
      
      if (apiKey) {
        console.log("Background: Sending API key to content script.");
        sendResponse({ apiKey: apiKey });
      } else {
        console.warn("Background: API key not available to send to content script.");
        sendResponse({ apiKey: null, error: "API key not available." });
      }
    });
    return true; 
  }
});
