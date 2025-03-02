// DOM Elements
const form = document.getElementById('generator-form');
const productNameInput = document.getElementById('product-name');
const affiliateLinkInput = document.getElementById('affiliate-link');
const reason1Input = document.getElementById('reason1');
const reason2Input = document.getElementById('reason2');
const reason3Input = document.getElementById('reason3');
const reason4Input = document.getElementById('reason4');
const colorOptions = document.querySelectorAll('.color-option');
const mainEmojiChoices = document.querySelectorAll('.main-emoji-choice');
const generateButton = document.getElementById('generate-button');
const resetButton = document.getElementById('reset-button');
const previewTitle = document.getElementById('preview-title');
const previewButton = document.getElementById('preview-button');
const previewCounter = document.getElementById('preview-counter');
const previewContainer = document.getElementById('preview-container');
const codeOutput = document.getElementById('code-output');
const generatedCode = document.getElementById('generated-code');
const copyButton = document.getElementById('copy-button');
const successMessage = document.getElementById('success-message');
const emojiToggles = document.querySelectorAll('.emoji-toggle');
const emojiChoices = document.querySelectorAll('.emoji-choice');

// Feedback display elements
const feedbackDisplay = document.getElementById('preview-feedback-display');
const feedbackReasons = document.querySelector('.feedback-reasons');
const totalCountDisplay = document.getElementById('feedback-total-count');

// Current state
let currentColor = '#0066cc';
let currentMainEmoji = '👍';
let currentEmojiMap = {
    1: '👌',
    2: '🎯',
    3: '💯',
    4: '🔄'
};
let previewCount = 0;
let previewPopup = null;
let isPreviewPopupCreated = false;
let reasonCounts = {
    reason1: 0,
    reason2: 0,
    reason3: 0,
    reason4: 0
};
let totalFeedbackCount = 0;

// Toggle emoji choice panels
emojiToggles.forEach(toggle => {
    toggle.addEventListener('click', function() {
        const targetId = this.dataset.target;
        const targetPanel = document.getElementById(targetId);
        
        if (targetPanel.style.display === 'none') {
            targetPanel.style.display = 'flex';
            this.textContent = 'Hide emoji options';
        } else {
            targetPanel.style.display = 'none';
            this.textContent = 'Show emoji options';
        }
    });
});

// Handle emoji selection
emojiChoices.forEach(choice => {
    choice.addEventListener('click', function() {
        const targetId = this.dataset.target;
        const emoji = this.dataset.emoji;
        const displayElement = document.getElementById(`emoji-display-${targetId}`);
        
        // Update the display
        displayElement.textContent = emoji;
        
        // Update state
        currentEmojiMap[targetId] = emoji;
        
        // Update UI
        const emojiDisplay = document.getElementById(`reason${targetId}-emoji`);
        if (emojiDisplay) {
            emojiDisplay.textContent = emoji;
        }
        
        // Update preview
        updatePreview();
    });
});

// Handle main emoji selection
mainEmojiChoices.forEach(choice => {
    choice.addEventListener('click', function() {
        // Update selected state
        mainEmoji​​​​​​​​​​​​​​​​
