// Content script for injecting prompt library functionality into AI tool pages

// Detect which AI tool we're on
const currentTool = detectAITool();

// Add floating button to open prompt library
function createFloatingButton() {
  const button = document.createElement('button');
  button.id = 'prompt-library-btn';
  button.className = 'prompt-library-floating-btn';
  button.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M12 2L2 7l10 5 10-5-10-5z"/>
      <path d="M2 17l10 5 10-5"/>
      <path d="M2 12l10 5 10-5"/>
    </svg>
  `;
  button.title = 'Open Prompt Library';
  document.body.appendChild(button);

  button.addEventListener('click', () => {
    togglePromptPanel();
  });
}

// Create prompt panel
function createPromptPanel() {
  const panel = document.createElement('div');
  panel.id = 'prompt-library-panel';
  panel.className = 'prompt-library-panel hidden';
  panel.innerHTML = `
    <div class="prompt-library-header">
      <h3>Prompt Library</h3>
      <button id="close-panel" class="close-btn">&times;</button>
    </div>
    <div class="prompt-library-search">
      <input type="text" id="panel-search" placeholder="Search prompts..." />
    </div>
    <div class="prompt-library-filters">
      <select id="panel-category-filter">
        <option value="">All Categories</option>
      </select>
      <select id="panel-model-filter">
        <option value="">All Models</option>
      </select>
    </div>
    <div id="panel-prompts-list" class="prompt-library-list">
      <div class="loading">Loading prompts...</div>
    </div>
  `;
  document.body.appendChild(panel);

  // Setup event listeners
  document.getElementById('close-panel').addEventListener('click', () => {
    togglePromptPanel();
  });

  loadPromptsIntoPanel();
}

// Toggle prompt panel visibility
function togglePromptPanel() {
  const panel = document.getElementById('prompt-library-panel');
  panel.classList.toggle('hidden');
}

// Load prompts into panel
async function loadPromptsIntoPanel() {
  try {
    const result = await chrome.storage.local.get(['prompts']);
    const prompts = result.prompts || [];

    populatePanelFilters(prompts);
    renderPanelPrompts(prompts);
    setupPanelFiltering(prompts);
  } catch (error) {
    console.error('Error loading prompts:', error);
  }
}

// Populate panel filters
function populatePanelFilters(prompts) {
  const categoryFilter = document.getElementById('panel-category-filter');
  const modelFilter = document.getElementById('panel-model-filter');

  const categories = [...new Set(prompts.map(p => p.category))].sort();
  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });

  const models = [...new Set(prompts.map(p => p.aiModel))].sort();
  models.forEach(model => {
    const option = document.createElement('option');
    option.value = model;
    option.textContent = model;
    modelFilter.appendChild(option);
  });
}

// Render prompts in panel
function renderPanelPrompts(prompts, filteredPrompts = null) {
  const list = document.getElementById('panel-prompts-list');
  const displayPrompts = filteredPrompts || prompts;

  if (displayPrompts.length === 0) {
    list.innerHTML = '<div class="empty-state">No prompts found</div>';
    return;
  }

  list.innerHTML = displayPrompts.map(prompt => `
    <div class="prompt-panel-item" data-id="${prompt.id}">
      <div class="prompt-panel-title">${escapeHtml(prompt.title)}</div>
      <div class="prompt-panel-preview">${escapeHtml(truncate(prompt.content, 80))}</div>
      <div class="prompt-panel-meta">
        <span class="badge-small">${escapeHtml(prompt.category)}</span>
        <span class="badge-small">${escapeHtml(prompt.aiModel)}</span>
      </div>
    </div>
  `).join('');

  // Add click handlers
  document.querySelectorAll('.prompt-panel-item').forEach(item => {
    item.addEventListener('click', () => {
      const prompt = prompts.find(p => p.id === item.dataset.id);
      if (prompt) {
        insertPromptIntoInput(prompt.content);
        togglePromptPanel();
      }
    });
  });
}

// Setup filtering in panel
function setupPanelFiltering(prompts) {
  const searchInput = document.getElementById('panel-search');
  const categoryFilter = document.getElementById('panel-category-filter');
  const modelFilter = document.getElementById('panel-model-filter');

  const filterPrompts = () => {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedCategory = categoryFilter.value;
    const selectedModel = modelFilter.value;

    const filtered = prompts.filter(prompt => {
      const matchesSearch = !searchTerm ||
        prompt.title.toLowerCase().includes(searchTerm) ||
        prompt.content.toLowerCase().includes(searchTerm) ||
        prompt.tags.some(tag => tag.toLowerCase().includes(searchTerm));

      const matchesCategory = !selectedCategory || prompt.category === selectedCategory;
      const matchesModel = !selectedModel || prompt.aiModel === selectedModel;

      return matchesSearch && matchesCategory && matchesModel;
    });

    renderPanelPrompts(prompts, filtered);
  };

  searchInput.addEventListener('input', filterPrompts);
  categoryFilter.addEventListener('change', filterPrompts);
  modelFilter.addEventListener('change', filterPrompts);
}

// Insert prompt into the current AI tool's input
function insertPromptIntoInput(content) {
  const inputSelector = getInputSelector();
  if (!inputSelector) return;

  const input = document.querySelector(inputSelector);
  if (!input) {
    console.error('Could not find input element');
    return;
  }

  // Different insertion methods for different tools
  if (currentTool === 'chatgpt' || currentTool === 'claude') {
    // For contenteditable divs
    input.focus();
    input.textContent = content;

    // Trigger input event
    const event = new Event('input', { bubbles: true });
    input.dispatchEvent(event);
  } else if (currentTool === 'gemini') {
    // For textarea
    input.value = content;

    // Trigger input event
    const event = new Event('input', { bubbles: true });
    input.dispatchEvent(event);
    input.focus();
  }

  showNotification('Prompt inserted!');
}

// Get input selector based on AI tool
function getInputSelector() {
  switch (currentTool) {
    case 'chatgpt':
      return '#prompt-textarea';
    case 'claude':
      return 'div[contenteditable="true"]';
    case 'gemini':
      return 'textarea[aria-label*="prompt" i], textarea.ql-editor, div[contenteditable="true"]';
    default:
      return null;
  }
}

// Detect which AI tool we're on
function detectAITool() {
  const hostname = window.location.hostname;
  if (hostname.includes('openai.com')) return 'chatgpt';
  if (hostname.includes('claude.ai')) return 'claude';
  if (hostname.includes('gemini.google.com')) return 'gemini';
  return null;
}

// Show notification
function showNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'prompt-library-notification';
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.classList.add('fade-out');
    setTimeout(() => notification.remove(), 300);
  }, 2000);
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

// Initialize
if (currentTool) {
  createFloatingButton();
  createPromptPanel();
}

// Listen for storage changes to update panel
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'local' && changes.prompts) {
    loadPromptsIntoPanel();
  }
});
