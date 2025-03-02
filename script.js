/* Update the updatePreviewPopupContent function to better handle emoji display */

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
                <span class="reason-text">
                    <span class="emoji">${currentEmojiMap[1]}</span>
                    ${reason1}
                </span>
                <span class="count">0</span>
            </button>
            <button class="reason-option" data-reason="reason2">
                <span class="reason-text">
                    <span class="emoji">${currentEmojiMap[2]}</span>
                    ${reason2}
                </span>
                <span class="count">0</span>
            </button>
            <button class="reason-option" data-reason="reason3">
                <span class="reason-text">
                    <span class="emoji">${currentEmojiMap[3]}</span>
                    ${reason3}
                </span>
                <span class="count">0</span>
            </button>
            <button class="reason-option" data-reason="reason4">
                <span class="reason-text">
                    <span class="emoji">${currentEmojiMap[4]}</span>
                    ${reason4}
                </span>
                <span class="count">0</span>
            </button>
        </div>
        <div class="thanks-message" style="display: none; color: ${currentColor};">Thanks for your feedback!</div>
    `;
    
    // Add event listeners to reason options
    addReasonOptionListeners();
}

/* Update the generateCode function to use the same improved structure */

// Modify the generated code in the generateCode function to use the same structure
// Update where it creates the reason options HTML:

const code = `<!-- Reaction Button for "${productName}" with Counter Support -->
<div class="thumbs-i-container" id="thumbs-i-container">
    <button class="thumbs-i-button" id="thumbs-i-button">
        ${currentMainEmoji} <span class="i-indicator">i</span>
        <span class="counter" id="main-counter"></span>
    </button>
    
    <div class="thumbs-i-popup" id="thumbs-i-popup">
        <h4>Why did you like this?</h4>
        <div class="reasons-grid">
            <button class="reason-option" data-reason="reason1">
                <span class="reason-text">
                    <span class="emoji">${currentEmojiMap[1]}</span>
                    ${reason1}
                </span>
                <span class="count" id="count-reason1">0</span>
            </button>
            <button class="reason-option" data-reason="reason2">
                <span class="reason-text">
                    <span class="emoji">${currentEmojiMap[2]}</span>
                    ${reason2}
                </span>
                <span class="count" id="count-reason2">0</span>
            </button>
            <button class="reason-option" data-reason="reason3">
                <span class="reason-text">
                    <span class="emoji">${currentEmojiMap[3]}</span>
                    ${reason3}
                </span>
                <span class="count" id="count-reason3">0</span>
            </button>
            <button class="reason-option" data-reason="reason4">
                <span class="reason-text">
                    <span class="emoji">${currentEmojiMap[4]}</span>
                    ${reason4}
                </span>
                <span class="count" id="count-reason4">0</span>
            </button>
        </div>
        <div class="thanks-message" id="thanks-message">Thanks for your feedback!</div>
    </div>
</div>`;
