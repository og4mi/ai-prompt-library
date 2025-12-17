// Popup script for Curata browser extension

let allPrompts = [];
let allCategories = [];
let filteredPrompts = [];

const APP_URL = 'http://localhost:3004';
const STORAGE_KEYS = {
  PROMPTS: 'prompt-library-prompts',
  CATEGORIES: 'prompt-library-categories',
};

// DOM elements
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const modelFilter = document.getElementById('modelFilter');
const promptsList = document.getElementById('promptsList');
const refreshBtn = document.getElementById('refreshBtn');
const openAppBtn = document.getElementById('openAppBtn');

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
  await loadDataFromApp();
  setupEventListeners();
});

// Load data from the web app's localStorage via content script
async function loadDataFromApp() {
  try {
    // Query for the app tab
    const tabs = await chrome.tabs.query({ url: `${APP_URL}/*` });

    if (tabs.length > 0) {
      // App is open, get data from its localStorage
      const response = await chrome.tabs.sendMessage(tabs[0].id, {
        action: 'getLocalStorage',
        keys: [STORAGE_KEYS.PROMPTS, STORAGE_KEYS.CATEGORIES]
      });

      if (response && response.success) {
        allPrompts = JSON.parse(response.data[STORAGE_KEYS.PROMPTS] || '[]');
        allCategories = JSON.parse(response.data[STORAGE_KEYS.CATEGORIES] || '[]');
      } else {
        // Fall back to extension storage
        await loadFromExtensionStorage();
      }
    } else {
      // App not open, use extension storage
      await loadFromExtensionStorage();
    }

    populateFilters();
    filterPrompts();
  } catch (error) {
    console.error('Error loading data:', error);
    await loadFromExtensionStorage();
    populateFilters();
    filterPrompts();
  }
}

// Fallback to extension storage
async function loadFromExtensionStorage() {
  const result = await chrome.storage.local.get(['prompts', 'categories']);
  allPrompts = result.prompts || [];
  allCategories = result.categories || getDefaultCategories();
}

// Save to both extension storage and app localStorage
async function saveData() {
  // Save to extension storage
  await chrome.storage.local.set({
    prompts: allPrompts,
    categories: allCategories
  });

  // Try to save to app's localStorage if it's open
  try {
    const tabs = await chrome.tabs.query({ url: `${APP_URL}/*` });
    if (tabs.length > 0) {
      await chrome.tabs.sendMessage(tabs[0].id, {
        action: 'setLocalStorage',
        data: {
          [STORAGE_KEYS.PROMPTS]: JSON.stringify(allPrompts),
          [STORAGE_KEYS.CATEGORIES]: JSON.stringify(allCategories)
        }
      });
    }
  } catch (error) {
    console.error('Could not sync to app:', error);
  }
}

// Populate category and model filter dropdowns
function populateFilters() {
  // Populate categories
  const categories = allCategories.length > 0
    ? allCategories.map(c => c.name)
    : [...new Set(allPrompts.map(p => p.category))].sort();

  categoryFilter.innerHTML = '<option value="">All Categories</option>';
  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });

  // Populate AI models
  const models = [...new Set(allPrompts.map(p => p.aiModel))].sort();
  modelFilter.innerHTML = '<option value="">All Models</option>';
  models.forEach(model => {
    const option = document.createElement('option');
    option.value = model;
    option.textContent = model;
    modelFilter.appendChild(option);
  });
}

// Filter prompts based on search and filters
function filterPrompts() {
  const searchTerm = searchInput.value.toLowerCase();
  const selectedCategory = categoryFilter.value;
  const selectedModel = modelFilter.value;

  filteredPrompts = allPrompts.filter(prompt => {
    const matchesSearch = !searchTerm ||
      prompt.title.toLowerCase().includes(searchTerm) ||
      prompt.content.toLowerCase().includes(searchTerm) ||
      (prompt.tags && prompt.tags.some(tag => tag.toLowerCase().includes(searchTerm)));

    const matchesCategory = !selectedCategory || prompt.category === selectedCategory;
    const matchesModel = !selectedModel || prompt.aiModel === selectedModel;

    return matchesSearch && matchesCategory && matchesModel;
  });

  renderPrompts();
}

// Render prompts list
function renderPrompts() {
  if (filteredPrompts.length === 0) {
    if (allPrompts.length === 0) {
      promptsList.innerHTML = `
        <div class="empty-state">
          <h3>No prompts yet</h3>
          <p>Create your first prompt below</p>
          <button id="addPromptBtn" class="primary-btn" style="margin-top: 16px; width: auto; padding: 8px 16px;">
            + Add Prompt
          </button>
        </div>
      `;
      document.getElementById('addPromptBtn')?.addEventListener('click', showAddPromptForm);
    } else {
      promptsList.innerHTML = `
        <div class="empty-state">
          <h3>No results found</h3>
          <p>Try adjusting your search or filters</p>
        </div>
      `;
    }
    return;
  }

  promptsList.innerHTML = filteredPrompts.map(prompt => `
    <div class="prompt-item" data-id="${prompt.id}">
      <div class="prompt-title">${escapeHtml(prompt.title)}</div>
      <div class="prompt-preview">${escapeHtml(truncate(prompt.content, 100))}</div>
      <div class="prompt-meta">
        <span class="badge badge-category">${escapeHtml(prompt.category)}</span>
        <span class="badge badge-model">${escapeHtml(prompt.aiModel)}</span>
      </div>
    </div>
  `).join('');

  // Add click handlers
  document.querySelectorAll('.prompt-item').forEach(item => {
    item.addEventListener('click', () => handlePromptClick(item.dataset.id));
  });
}

// Show add prompt form
function showAddPromptForm() {
  promptsList.innerHTML = `
    <div class="add-prompt-form">
      <h3 style="margin-bottom: 16px; font-size: 16px;">Add New Prompt</h3>

      <label style="display: block; margin-bottom: 8px; font-size: 13px; font-weight: 500;">Title</label>
      <input type="text" id="promptTitle" placeholder="Enter prompt title..." style="width: 100%; padding: 8px; border: 1px solid hsl(var(--border)); border-radius: 6px; margin-bottom: 12px; font-size: 14px;" />

      <label style="display: block; margin-bottom: 8px; font-size: 13px; font-weight: 500;">Content</label>
      <textarea id="promptContent" placeholder="Enter prompt content..." style="width: 100%; padding: 8px; border: 1px solid hsl(var(--border)); border-radius: 6px; margin-bottom: 12px; min-height: 100px; font-size: 14px; font-family: inherit; resize: vertical;"></textarea>

      <label style="display: block; margin-bottom: 8px; font-size: 13px; font-weight: 500;">Category</label>
      <select id="promptCategory" style="width: 100%; padding: 8px; border: 1px solid hsl(var(--border)); border-radius: 6px; margin-bottom: 12px; font-size: 14px;">
        ${allCategories.map(cat => `<option value="${escapeHtml(cat.name)}">${escapeHtml(cat.name)}</option>`).join('')}
      </select>

      <label style="display: block; margin-bottom: 8px; font-size: 13px; font-weight: 500;">AI Model</label>
      <select id="promptModel" style="width: 100%; padding: 8px; border: 1px solid hsl(var(--border)); border-radius: 6px; margin-bottom: 16px; font-size: 14px;">
        <option value="ChatGPT">ChatGPT</option>
        <option value="Claude">Claude</option>
        <option value="Gemini">Gemini</option>
        <option value="Other">Other</option>
      </select>

      <div style="display: flex; gap: 8px;">
        <button id="savePromptBtn" class="primary-btn" style="flex: 1;">Save Prompt</button>
        <button id="cancelPromptBtn" style="flex: 1; padding: 10px; border: 1px solid hsl(var(--border)); background: transparent; border-radius: 6px; font-size: 14px; cursor: pointer;">Cancel</button>
      </div>
    </div>
  `;

  document.getElementById('savePromptBtn').addEventListener('click', handleSavePrompt);
  document.getElementById('cancelPromptBtn').addEventListener('click', () => {
    filterPrompts();
  });
}

// Handle saving new prompt
async function handleSavePrompt() {
  const title = document.getElementById('promptTitle').value.trim();
  const content = document.getElementById('promptContent').value.trim();
  const category = document.getElementById('promptCategory').value;
  const aiModel = document.getElementById('promptModel').value;

  if (!title || !content) {
    showToast('Title and content are required', true);
    return;
  }

  const newPrompt = {
    id: Date.now().toString(),
    title,
    content,
    category,
    aiModel,
    tags: [],
    isFavorite: false,
    dateAdded: new Date().toISOString(),
  };

  allPrompts.unshift(newPrompt);
  await saveData();

  showToast('Prompt saved successfully!');
  populateFilters();
  filterPrompts();
}

// Handle prompt click - copy to clipboard
async function handlePromptClick(promptId) {
  const prompt = allPrompts.find(p => p.id === promptId);
  if (!prompt) return;

  try {
    await navigator.clipboard.writeText(prompt.content);
    showToast('Copied to clipboard!');
  } catch (error) {
    console.error('Failed to copy:', error);
    showToast('Failed to copy', true);
  }
}

// Show toast notification
function showToast(message, isError = false) {
  const existingToast = document.querySelector('.copied-toast');
  if (existingToast) {
    existingToast.remove();
  }

  const toast = document.createElement('div');
  toast.className = 'copied-toast';
  if (isError) {
    toast.style.background = 'hsl(0 84.2% 60.2%)';
  }
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 2000);
}

// Setup event listeners
function setupEventListeners() {
  searchInput.addEventListener('input', filterPrompts);
  categoryFilter.addEventListener('change', filterPrompts);
  modelFilter.addEventListener('change', filterPrompts);

  refreshBtn.addEventListener('click', async () => {
    refreshBtn.style.opacity = '0.5';
    await loadDataFromApp();
    refreshBtn.style.opacity = '1';
    showToast('Prompts refreshed!');
  });

  openAppBtn.addEventListener('click', () => {
    chrome.tabs.create({ url: APP_URL });
  });
}

// Utility functions
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function truncate(text, length) {
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
}

function getDefaultCategories() {
  return [
    { id: "writing", name: "Writing", color: "#3B82F6" },
    { id: "code", name: "Code", color: "#10B981" },
    { id: "image", name: "Image Generation", color: "#8B5CF6" },
    { id: "analysis", name: "Analysis", color: "#F59E0B" },
    { id: "creative", name: "Creative", color: "#EC4899" },
    { id: "productivity", name: "Productivity", color: "#6366F1" },
    { id: "other", name: "Other", color: "#6B7280" },
  ];
}
