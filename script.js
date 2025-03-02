
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
        mainEmojiChoices.forEach(opt => opt.classList.remove('selected'));
        this.classList.add('selected');
        
        // Update current emoji
        currentMainEmoji = this.dataset.emoji;
        
        // Update preview
        updatePreview();
    });
});

// Handle color selection
colorOptions.forEach(option => {
    option.addEventListener('click', () => {
        // Update selected state
        colorOptions.forEach(opt => opt.classList.remove('selected'));
        option.classList.add('selected');
        
        // Update current color
        currentColor = option.dataset.color;
        
        // Update preview
        updatePreview();
    });
});

// Preview button click handler with fixed popup positioning
previewButton.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    // Increment preview counter
    previewCount++;
    previewCounter.textContent = previewCount;
    previewCounter.style.display = 'inline-flex';
    
    // Create popup if it doesn't exist yet
    if (!isPreviewPopupCreated) {
        createPreviewPopup();
    } else {
        // Update existing popup
        updatePreviewPopupContent();
    }
    
    // Force the popup to display
    previewPopup.style.display = 'block';
    
    // Position the popup properly below the button
    previewPopup.style.position = 'absolute';
    previewPopup.style.left = '-100px';
    previewPopup.style.top = '40px';
    previewPopup.style.zIndex = '1000';
});

function createPreviewPopup() {
    // Create the popup
    previewPopup = document.createElement('div');
    previewPopup.classList.add('thumbs-i-popup');
    previewPopup.id = 'preview-popup';
    
    // Add content to popup
    updatePreviewPopupContent();
    
    // Add popup to the preview container
    previewContainer.appendChild(previewPopup);
    
    // Add event listeners to reason options
    addReasonOptionListeners();
    
    // Close popup when clicking outside
    document.addEventListener('click', function(e) {
        if (previewPopup && !previewContainer.contains(e.target) || 
            (previewContainer.contains(e.target) && e.target !== previewButton && !previewPopup.contains(e.target))) {
            previewPopup.style.display = 'none';
        }
    });
    
    isPreviewPopupCreated = true;
}

function updatePreviewPopupContent() {
    if (!previewPopup) return;
    
    const reason1 = reason1Input.value || 'Helpful info';
    const reason2 = reason2Input.value || 'Great explanation';
    const reason3 = reason3Input.value || 'Just what I needed';
    const reason4 = reason4Input.value || 'Will recommend';
    
    previewPopup.innerHTML = `
        <h4>Why did you like this?</h4>
        <div class="reasons-grid">
            <button class="reason-option" data-reason="reason1">
                <span class="reason-text">${currentEmojiMap[1]} ${reason1}</span>
                <span class="count">${reasonCounts.reason1}</span>
            </button>
            <button class="reason-option" data-reason="reason2">
                <span class="reason-text">${currentEmojiMap[2]} ${reason2}</span>
                <span class="count">${reasonCounts.reason2}</span>
            </button>
            <button class="reason-option" data-reason="reason3">
                <span class="reason-text">${currentEmojiMap[3]} ${reason3}</span>
                <span class="count">${reasonCounts.reason3}</span>
            </button>
            <button class="reason-option" data-reason="reason4">
                <span class="reason-text">${currentEmojiMap[4]} ${reason4}</span>
                <span class="count">${reasonCounts.reason4}</span>
            </button>
        </div>
        <div class="thanks-message" style="display: none; color: ${currentColor};">Thanks for your feedback!</div>
        
        <div class="popup-feedback-summary">
            <div class="popup-feedback-header">Current feedback:</div>
            <div class="popup-feedback-stats">
                ${totalFeedbackCount > 0 ? `
                    <div>${totalFeedbackCount} total ${totalFeedbackCount === 1 ? 'response' : 'responses'}</div>
                    ${Object.entries(reasonCounts).map(([reason, count]) => 
                        count > 0 ? `<div class="popup-stat-item">${count} × ${reason === 'reason1' ? reason1 : reason === 'reason2' ? reason2 : reason === 'reason3' ? reason3 : reason4}</div>` : ''
                    ).join('')}
                ` : '<div>No feedback yet</div>'}
            </div>
        </div>
    `;
    
    // Add event listeners to reason options
    addReasonOptionListeners();
}
function addReasonOptionListeners() {
    if (!previewPopup) return;
    
    const reasonOptions = previewPopup.querySelectorAll('.reason-option');
    const thanksMessage = previewPopup.querySelector('.thanks-message');
    
    reasonOptions.forEach(option => {
        option.addEventListener('click', function(e) {
            e.stopPropagation();
            
            const reason = this.dataset.reason;
            
            // Toggle selection
            if (this.classList.contains('selected')) {
                // Deselect this option
                this.classList.remove('selected');
                
                // Decrement counters
                reasonCounts[reason]--;
                totalFeedbackCount--;
                
                // Update displays
                this.querySelector('.count').textContent = reasonCounts[reason];
                document.getElementById(`public-count-${reason}`).textContent = reasonCounts[reason];
                totalCountDisplay.textContent = `${totalFeedbackCount} ${totalFeedbackCount === 1 ? 'response' : 'responses'}`;
                
                // Hide thanks message
                thanksMessage.style.display = 'none';
            } else {
                // Select this option
                reasonOptions.forEach(opt => opt.classList.remove('selected'));
                this.classList.add('selected');
                this.style.backgroundColor = currentColor;
                
                // Increment counters
                reasonCounts[reason]++;
                totalFeedbackCount++;
                
                // Update displays
                this.querySelector('.count').textContent = reasonCounts[reason];
                document.getElementById(`public-count-${reason}`).textContent = reasonCounts[reason];
                totalCountDisplay.textContent = `${totalFeedbackCount} ${totalFeedbackCount === 1 ? 'response' : 'responses'}`;
                
                // Force the feedback display to show
                feedbackReasons.classList.add('active');
                
                // Show thanks message
                thanksMessage.style.display = 'block';
                
                // Hide popup after a delay
                setTimeout(() => {
                    previewPopup.style.display = 'none';
                }, 1500);
            }
            
            // Update feedback display
            updateFeedbackDisplay();
        });
    });
}

// Update preview based on form inputs
function updatePreview() {
    // Update title
    const productName = productNameInput.value || 'Product Review';
    previewTitle.textContent = productName;
    
    // Update main emoji
    const buttonContent = `${currentMainEmoji} <span class="i-indicator">i</span>`;
    previewButton.innerHTML = buttonContent;
    
    if (previewCount > 0) {
        previewButton.innerHTML += `<span class="counter" id="preview-counter">${previewCount}</span>`;
    }
    
    // Update button color
    const iIndicator = previewButton.querySelector('.i-indicator');
    iIndicator.style.backgroundColor = currentColor;
    
    // Update progress bar colors
    document.querySelectorAll('.reason-progress').forEach(bar => {
        bar.style.backgroundColor = `${currentColor}40`;
    });
    
    // Update reason texts in feedback display
    document.getElementById('reason1-text').textContent = reason1Input.value || 'Helpful info';
    document.getElementById('reason2-text').textContent = reason2Input.value || 'Great explanation';
    document.getElementById('reason3-text').textContent = reason3Input.value || 'Just what I needed';
    document.getElementById('reason4-text').textContent = reason4Input.value || 'Will recommend';
    
    // Update emojis in feedback display
    document.getElementById('reason1-emoji').textContent = currentEmojiMap[1];
    document.getElementById('reason2-emoji').textContent = currentEmojiMap[2];
    document.getElementById('reason3-emoji').textContent = currentEmojiMap[3];
    document.getElementById('reason4-emoji').textContent = currentEmojiMap[4];
    
    // Update popup content if it exists
    if (isPreviewPopupCreated && previewPopup) {
        updatePreviewPopupContent();
    }
}

function updateFeedbackDisplay() {
    // Update total count
    totalCountDisplay.textContent = `${totalFeedbackCount} ${totalFeedbackCount === 1 ? 'response' : 'responses'}`;
    
    // Show the reasons container if there's any feedback
    if (totalFeedbackCount > 0 && !feedbackReasons.classList.contains('active')) {
        feedbackReasons.classList.add('active');
    } else if (totalFeedbackCount === 0) {
        feedbackReasons.classList.remove('active');
    }
    
    // Calculate percentages for each reason
    const maxCount = Math.max(...Object.values(reasonCounts));
    
    // Update each reason's bar and count
    for (const [reason, count] of Object.entries(reasonCounts)) {
        const countElement = document.getElementById(`public-count-${reason}`);
        const progressBar = document.getElementById(`${reason}-progress`);
        
        countElement.textContent = count;
        
        // Calculate percentage (of max value for better visualization)
        const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;
        progressBar.style.width = `${percentage}%`;
        
        // Use the main button color but with transparency
        progressBar.style.backgroundColor = `${currentColor}40`; // 40 adds 25% opacity
        
        // Hide reasons with zero votes
        const reasonElement = document.getElementById(`feedback-${reason}`);
        reasonElement.style.display = count > 0 ? 'block' : 'none';
    }
}

// Generate code based on form inputs
function generateCode() {
    const productName = productNameInput.value || 'Product Review';
    const affiliateLink = affiliateLinkInput.value || '';
    const reason1 = reason1Input.value || 'Helpful info';
    const reason2 = reason2Input.value || 'Great explanation';
    const reason3 = reason3Input.value || 'Just what I needed';
    const reason4 = reason4Input.value || 'Will recommend';
    
    // Create the HTML code with dynamic variables
    const htmlCode = `<!-- Reaction Button for "${productName}" with Counter Support -->
<div class="thumbs-i-container" id="thumbs-i-container">
    <button class="thumbs-i-button" id="thumbs-i-button">
        ${currentMainEmoji} <span class="i-indicator">i</span>
        <span class="counter" id="main-counter"></span>
    </button>
    
    <div class="thumbs-i-popup" id="thumbs-i-popup">
        <h4>Why did you like this?</h4>
        <div class="reasons-grid">
            <button class="reason-option" data-reason="reason1">
                <span class="reason-text">${currentEmojiMap[1]} ${reason1}</span>
                <span class="count" id="count-reason1">0</span>
            </button>
            <button class="reason-option" data-reason="reason2">
                <span class="reason-text">${currentEmojiMap[2]} ${reason2}</span>
                <span class="count" id="count-reason2">0</span>
            </button>
            <button class="reason-option" data-reason="reason3">
                <span class="reason-text">${currentEmojiMap[3]} ${reason3}</span>
                <span class="count" id="count-reason3">0</span>
            </button>
            <button class="reason-option" data-reason="reason4">
                <span class="reason-text">${currentEmojiMap[4]} ${reason4}</span>
                <span class="count" id="count-reason4">0</span>
            </button>
        </div>
        <div class="thanks-message" id="thanks-message">Thanks for your feedback!</div>
    </div>
</div>

<!-- Feedback Display Area -->
<div class="thumbs-i-feedback-display" id="thumbs-i-feedback-display">
    <div class="feedback-header">
        <span class="feedback-title">People liked this because:</span>
        <span class="feedback-total-count" id="feedback-total-count">0 responses</span>
    </div>
    <div class="feedback-reasons">
        <div class="feedback-reason" id="feedback-reason1">
            <div class="reason-bar">
                <div class="reason-progress" id="reason1-progress"></div>
                <div class="reason-label"><span id="reason1-emoji">${currentEmojiMap[1]}</span> <span id="reason1-text">${reason1}</span></div>
                <div class="reason-count" id="public-count-reason1">0</div>
            </div>
        </div>
        <div class="feedback-reason" id="feedback-reason2">
            <div class="reason-bar">
                <div class="reason-progress" id="reason2-progress"></div>
                <div class="reason-label"><span id="reason2-emoji">${currentEmojiMap[2]}</span> <span id="reason2-text">${reason2}</span></div>
                <div class="reason-count" id="public-count-reason2">0</div>
            </div>
        </div>
        <div class="feedback-reason" id="feedback-reason3">
            <div class="reason-bar">
                <div class="reason-progress" id="reason3-progress"></div>
                <div class="reason-label"><span id="reason3-emoji">${currentEmojiMap[3]}</span> <span id="reason3-text">${reason3}</span></div>
                <div class="reason-count" id="public-count-reason3">0</div>
            </div>
        </div>
        <div class="feedback-reason" id="feedback-reason4">
            <div class="reason-bar">
                <div class="reason-progress" id="reason4-progress"></div>
                <div class="reason-label"><span id="reason4-emoji">${currentEmojiMap[4]}</span> <span id="reason4-text">${reason4}</span></div>
                <div class="reason-count" id="public-count-reason4">0</div>
            </div>
        </div>
    </div>
</div>`;
    
    // Add style and script tags
    const styleCode = `<style>
/* Reaction Button Styles */
.thumbs-i-container {
    display: inline-block;
    position: relative;
}

.thumbs-i-button {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    position: relative;
    padding: 5px;
    transition: transform 0.2s ease;
    display: flex;
    align-items: center;
}

.thumbs-i-button:hover {
    transform: scale(1.1);
}

.i-indicator {
    position: absolute;
    top: 0;
    right: -2px;
    background: ${currentColor};
    color: white;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    font-size: 12px;
    font-style: italic;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* Counter styles */
.counter {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: #f0f0f0;
    color: #666;
    font-size: 12px;
    font-weight: bold;
    height: 20px;
    min-width: 20px;
    border-radius: 10px;
    margin-left: 6px;
    padding: 0 6px;
}

.counter:empty {
    display: none;
}

/* Popup Styles */
.thumbs-i-popup {
    display: none;
    position: absolute;
    top: 40px;
    left: -100px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    width: 250px;
    z-index: 1000;
    animation: thumbsiFadeIn 0.2s ease-out;
    padding: 12px;
}

@keyframes thumbsiFadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

.thumbs-i-popup h4 {
    font-size: 14px;
    margin-bottom: 10px;
    color: #333;
    text-align: center;
}

.reasons-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    margin-bottom: 8px;
}

.reason-option {
    background: #f0f0f0;
    border: none;
    border-radius: 6px;
    padding: 8px 4px;
    font-size: 13px;
    cursor: pointer;
    transition: all 0.2s;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
}

.reason-option .reason-text {
    flex: 1;
}

.reason-option .count {
    font-size: 11px;
    background: rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    padding: 1px 5px;
    margin-left: 4px;
    min-width: 16px;
    text-align: center;
}

.reason-option:hover {
    background: #e0e0e0;
}

.reason-option.selected {
    background: ${currentColor};
    color: white;
}

.reason-option.selected .count {
    background: rgba(255, 255, 255, 0.3);
}

/* Thank you message */
.thanks-message {
    display: none;
    text-align: center;
    font-size: 14px;
    color: ${currentColor};
    margin-top: 4px;
}

/* Feedback Display Styles */
.thumbs-i-feedback-display {
    margin-top: 20px;
    background: #f7f9fc;
    border-radius: 8px;
    padding: 15px;
}

.feedback-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
}

.feedback-title {
    font-size: 14px;
    font-weight: 600;
    color: #333;
}

.feedback-total-count {
    font-size: 12px;
    color: #666;
}

.feedback-reason {
    margin-bottom: 8px;
}

.reason-bar {
    position: relative;
    height: 30px;
    background: #e9ecef;
    border-radius: 4px;
    overflow: hidden;
    display: flex;
    align-items: center;
}

.reason-progress {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    background-color: rgba(${parseInt(currentColor.slice(1,3), 16)}, ${parseInt(currentColor.slice(3,5), 16)}, ${parseInt(currentColor.slice(5,7), 16)}, 0.2);
    transition: width 0.3s ease;
    width: 0%;
}

.reason-label {
    position: relative;
    padding-left: 10px;
    font-size: 13px;
    z-index: 1;
    flex: 1;
}

.reason-count {
    position: relative;
    padding-right: 10px;
    font-weight: 600;
    font-size: 12px;
    z-index: 1;
    color: #444;
}

.feedback-reasons {
    opacity: 0;
    transition: opacity 0.5s ease;
    height: 0;
    overflow: hidden;
}

.feedback-reasons.active {
    opacity: 1;
    height: auto;
}
</style>`;
    
    const scriptCode = `<script>
// Initialize reaction button functionality
document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const thumbsButton = document.getElementById('thumbs-i-button');
    const popup = document.getElementById('thumbs-i-popup');
    const reasonOptions = popup.querySelectorAll('.reason-option');
    const thanksMessage = document.getElementById('thanks-message');
    const mainCounter = document.getElementById('main-counter');
    const feedbackDisplay = document.getElementById('thumbs-i-feedback-display');
    const feedbackReasons = feedbackDisplay.querySelector('.feedback-reasons');
    const totalCountDisplay = document.getElementById('feedback-total-count');
    
    // State
    let isLiked = false;
    let mainCount = 0;
    let reasonCounts = {
        reason1: 0,
        reason2: 0,
        reason3: 0,
        reason4: 0
    };
    let totalFeedbackCount = 0;
    
    // Show/hide popup when clicking the button
    thumbsButton.addEventListener('click', function(e) {
        e.stopPropagation();
        
        // Increment counter on first click
        if (!isLiked) {
            isLiked = true;
            mainCount++;
            mainCounter.textContent = mainCount;
            mainCounter.style.display = 'inline-flex';
        }
        
        // Toggle popup
        popup.style.display = popup.style.display === 'block' ? 'none' : 'block';
    });
    
    // Handle reason selection
    reasonOptions.forEach(option => {
        option.addEventListener('click', function(e) {
            e.stopPropagation();
            
            const reason = this.dataset.reason;
            const countElement = document.getElementById('count-' + reason);
            const publicCountElement = document.getElementById('public-count-' + reason);
            
            // Toggle selection
            if (this.classList.contains('selected')) {
                // Deselect this option
                this.classList.remove('selected');
                
                // Decrement counters
                reasonCounts[reason]--;
                totalFeedbackCount--;
                
                countElement.textContent = reasonCounts[reason];
                publicCountElement.textContent = reasonCounts[reason];
                
                thanksMessage.style.display = 'none';
            } else {
                // Select this option
                reasonOptions.forEach(opt => {
                    if (opt.classList.contains('selected')) {
                        const prevReason = opt.dataset.reason;
                        const prevCountElement = document.getElementById('count-' + prevReason);
                        const prevPublicCountElement = document.getElementById('public-count-' + prevReason);
                        
                        reasonCounts[prevReason]--;
                        totalFeedbackCount--;
                        
                        prevCountElement.textContent = reasonCounts[prevReason];
                        prevPublicCountElement.textContent = reasonCounts[prevReason];
                        
                        opt.classList.remove('selected');
                    }
                });
                
                // Select this option
                this.classList.add('selected');
                this.style.backgroundColor = '${currentColor}';
                
                // Increment counters
                reasonCounts[reason]++;
                totalFeedbackCount++;
                
                countElement.textContent = reasonCounts[reason];
                publicCountElement.textContent = reasonCounts[reason];
                
                // Show thanks message
                thanksMessage.style.display = 'block';
                
                // Show feedback display
                feedbackReasons.classList.add('active');
                
                // Hide popup after a delay
                setTimeout(() => {
                    popup.style.display = 'none';
                }, 1500);
            }
            
            // Update total count
            totalCountDisplay.textContent = totalFeedbackCount + (totalFeedbackCount === 1 ? ' response' : ' responses');
            
            // Update progress bars
            updateProgressBars();
            
            ${affiliateLink ? `// Optional: Track click or redirect
            console.log('Reason selected:', reason);
            // window.open('${affiliateLink}', '_blank');` : ''}
        });
    });
    
    // Update progress bars for visualization
    function updateProgressBars() {
        // Show/hide feedback reasons based on feedback count
        if (totalFeedbackCount > 0 && !feedbackReasons.classList.contains('active')) {
            feedbackReasons.classList.add('active');
        } else if (totalFeedbackCount === 0) {
            feedbackReasons.classList.remove('active');
        }
        
        // Get maximum count for scaling
        const maxCount = Math.max(...Object.values(reasonCounts));
        
        // Update each reason's bar and visibility
        for (const [reason, count] of Object.entries(reasonCounts)) {
            const reasonElement = document.getElementById('feedback-' + reason);
            const progressBar = document.getElementById(reason + '-progress');
            
            // Hide reasons with zero votes
            reasonElement.style.display = count > 0 ? 'block' : 'none';
            
            // Calculate percentage (of max value for better visualization)
            const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;
            progressBar.style.width = percentage + '%';
        }
    }
    
    // Close popup when clicking outside
    document.addEventListener('click', function(e) {
        if (!popup.contains(e.target) && e.target !== thumbsButton) {
            popup.style.display = 'none';
        }
    });
});
</script>`;
    
    // Show the generated code
    generatedCode.textContent = htmlCode + styleCode + scriptCode;
    codeOutput.style.display = 'block';
}

// Copy code to clipboard
copyButton.addEventListener('click', () => {
    const codeText = generatedCode.textContent;
    navigator.clipboard.writeText(codeText).then(() => {
        // Show success message
        successMessage.style.display = 'block';
        setTimeout(() => {
            successMessage.style.display = 'none';
        }, 2000);
    });
});

// Reset form
resetButton.addEventListener('click', () => {
    form.reset();
    
    // Reset colors
    colorOptions.forEach(opt => opt.classList.remove('selected'));
    colorOptions[0].classList.add('selected');
    currentColor = '#0066cc';
    
    // Reset emojis
    mainEmojiChoices.forEach(opt => opt.classList.remove('selected'));
    mainEmojiChoices[0].classList.add('selected');
    currentMainEmoji = '👍';
    
    // Reset preview count
    previewCount = 0;
    
    // Reset emoji map
    currentEmojiMap = {
        1: '👌',
        2: '🎯',
        3: '💯',
        4: '🔄'
    };
    
    // Reset displays
    document.getElementById('emoji-display-1').textContent = '👌';
    document.getElementById('emoji-display-2').textContent = '🎯';
    document.getElementById('emoji-display-3').textContent = '💯';
    document.getElementById('emoji-display-4').textContent = '🔄';
    
    // Reset counters
    reasonCounts = {
        reason1: 0,
        reason2: 0,
        reason3: 0,
        reason4: 0
    };
    totalFeedbackCount = 0;
    
    // Reset feedback display
    feedbackReasons.classList.remove('active');
    
    // Reset popup
    if (previewPopup && previewPopup.parentNode) {
        previewPopup.parentNode.removeChild(previewPopup);
    }
    previewPopup = null;
    isPreviewPopupCreated = false;
    
    // Update preview
    updatePreview();
    
    // Hide code output
    codeOutput.style.display = 'none';
});

// Generate button click handler
generateButton.addEventListener('click', generateCode);

// Initialize preview
updatePreview();
