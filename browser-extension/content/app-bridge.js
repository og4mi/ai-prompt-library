// Bridge script to allow extension to access the web app's localStorage

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getLocalStorage') {
    try {
      const data = {};
      request.keys.forEach(key => {
        data[key] = localStorage.getItem(key);
      });
      sendResponse({ success: true, data });
    } catch (error) {
      sendResponse({ success: false, error: error.message });
    }
    return true;
  }

  if (request.action === 'setLocalStorage') {
    try {
      Object.entries(request.data).forEach(([key, value]) => {
        localStorage.setItem(key, value);
      });

      // Dispatch a storage event so the app updates
      window.dispatchEvent(new Event('storage'));

      sendResponse({ success: true });
    } catch (error) {
      sendResponse({ success: false, error: error.message });
    }
    return true;
  }
});
