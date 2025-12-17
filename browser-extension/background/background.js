// Background service worker for Prompt Library extension

// Listen for installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('Prompt Library extension installed');

  // Initialize storage with empty prompts array if not exists
  chrome.storage.local.get(['prompts'], (result) => {
    if (!result.prompts) {
      chrome.storage.local.set({ prompts: [] });
    }
  });
});

// Listen for messages from popup or content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getPrompts') {
    // Fetch prompts from storage
    chrome.storage.local.get(['prompts'], (result) => {
      sendResponse({ prompts: result.prompts || [] });
    });
    return true; // Keep channel open for async response
  }

  if (request.action === 'savePrompts') {
    // Save prompts to storage
    chrome.storage.local.set({ prompts: request.prompts }, () => {
      sendResponse({ success: true });
    });
    return true;
  }

  if (request.action === 'syncFromApp') {
    // Sync prompts from the web app
    syncPromptsFromApp(request.apiUrl)
      .then(prompts => sendResponse({ success: true, prompts }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true;
  }
});

// Sync prompts from web app API
async function syncPromptsFromApp(apiUrl) {
  try {
    const response = await fetch(`${apiUrl}/api/prompts`);
    if (!response.ok) {
      throw new Error('Failed to fetch prompts from app');
    }

    const prompts = await response.json();

    // Save to storage
    await chrome.storage.local.set({ prompts });

    return prompts;
  } catch (error) {
    console.error('Error syncing prompts:', error);
    throw error;
  }
}

// Periodic sync (every 30 minutes)
chrome.alarms.create('syncPrompts', { periodInMinutes: 30 });

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'syncPrompts') {
    // Try to sync from default app URL
    const defaultAppUrl = 'http://localhost:3004'; // Update with your app URL
    syncPromptsFromApp(defaultAppUrl).catch(err => {
      console.log('Auto-sync failed:', err.message);
    });
  }
});

// Context menu for saving text as a prompt (optional feature)
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'saveAsPrompt',
    title: 'Save as Prompt',
    contexts: ['selection']
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'saveAsPrompt' && info.selectionText) {
    // Send message to open popup with pre-filled content
    chrome.storage.local.set({
      draftPrompt: {
        content: info.selectionText,
        timestamp: Date.now()
      }
    });
  }
});
