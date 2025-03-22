
document.addEventListener('DOMContentLoaded', () => {
    const chatContainer = document.getElementById('chat-container');
    const inputForm = document.getElementById('research-form');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    
    // Initial state
    let isResearching = false;
    let messages = [
        { 
            text: "Hi there! I'm your AI research assistant. I can search across multiple AI models for the best answers using HTML, CSS, JavaScript, and Python.", 
            sender: 'ai',
            sources: [] 
        }
    ];
    
    // Initialize chat with welcome message
    renderMessages();
    
    // Focus input on load
    userInput.focus();
    
    // Handle input changes to enable/disable send button
    userInput.addEventListener('input', () => {
        sendButton.disabled = !userInput.value.trim();
    });
    
    // Handle form submission
    inputForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const query = userInput.value.trim();
        if (!query || isResearching) return;
        
        // Add user message
        messages.push({ text: query, sender: 'user', sources: [] });
        renderMessages();
        
        // Clear input
        userInput.value = '';
        sendButton.disabled = true;
        
        // Show researching indicator
        isResearching = true;
        renderResearchIndicator();
        scrollToBottom();
        
        try {
            // Call API to get research results
            const response = await fetch('/api/research', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query })
            });
            
            if (!response.ok) {
                throw new Error('Failed to get research results');
            }
            
            const data = await response.json();
            
            // Add AI response
            messages.push({ 
                text: data.text, 
                sender: 'ai', 
                sources: data.sources 
            });
        } catch (error) {
            console.error('Error:', error);
            
            // Add error message
            messages.push({ 
                text: "I'm sorry, there was an error processing your request. Please try again.", 
                sender: 'ai',
                sources: []
            });
        } finally {
            isResearching = false;
            renderMessages();
            scrollToBottom();
        }
    });
    
    // Handle textarea enter key to submit form
    userInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (userInput.value.trim()) {
                inputForm.dispatchEvent(new Event('submit'));
            }
        }
    });
    
    // Render all messages
    function renderMessages() {
        // Create chat content container if it doesn't exist
        let chatContent = document.querySelector('.chat-content');
        if (!chatContent) {
            chatContent = document.createElement('div');
            chatContent.className = 'chat-content';
            chatContainer.innerHTML = '';
            chatContainer.appendChild(chatContent);
        } else {
            chatContent.innerHTML = '';
        }
        
        // Render each message
        messages.forEach(message => {
            const messageWrapper = document.createElement('div');
            messageWrapper.className = `message-wrapper ${message.sender}`;
            
            const messageCard = document.createElement('div');
            messageCard.className = `message-card ${message.sender}`;
            
            // Sender info
            const messageSender = document.createElement('div');
            messageSender.className = 'message-sender';
            
            const senderIcon = document.createElement('svg');
            senderIcon.className = 'sender-icon';
            senderIcon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
            senderIcon.setAttribute('width', '24');
            senderIcon.setAttribute('height', '24');
            senderIcon.setAttribute('viewBox', '0 0 24 24');
            senderIcon.setAttribute('fill', 'none');
            senderIcon.setAttribute('stroke', 'currentColor');
            senderIcon.setAttribute('stroke-width', '2');
            senderIcon.setAttribute('stroke-linecap', 'round');
            senderIcon.setAttribute('stroke-linejoin', 'round');
            
            if (message.sender === 'ai') {
                senderIcon.innerHTML = '<rect x="3" y="3" width="18" height="18" rx="2" /><path d="M12 7v0.01" /><path d="M12 17v0.01" /><path d="M7 12h0.01" /><path d="M17 12h0.01" /><path d="M12 12h0.01" />';
            } else {
                senderIcon.innerHTML = '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />';
            }
            
            const senderName = document.createElement('span');
            senderName.className = 'sender-name';
            senderName.textContent = message.sender === 'ai' ? 'Assistant' : 'You';
            
            messageSender.appendChild(senderIcon);
            messageSender.appendChild(senderName);
            messageCard.appendChild(messageSender);
            
            // Message text
            const messageText = document.createElement('p');
            messageText.className = 'message-text';
            messageText.textContent = message.text;
            messageCard.appendChild(messageText);
            
            // Sources (if any)
            if (message.sources && message.sources.length > 0) {
                const messageSources = document.createElement('div');
                messageSources.className = 'message-sources';
                
                const sourcesHeader = document.createElement('div');
                sourcesHeader.className = 'sources-header';
                
                const searchIcon = document.createElement('svg');
                searchIcon.className = 'sender-icon';
                searchIcon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
                searchIcon.setAttribute('width', '24');
                searchIcon.setAttribute('height', '24');
                searchIcon.setAttribute('viewBox', '0 0 24 24');
                searchIcon.setAttribute('fill', 'none');
                searchIcon.setAttribute('stroke', 'currentColor');
                searchIcon.setAttribute('stroke-width', '2');
                searchIcon.setAttribute('stroke-linecap', 'round');
                searchIcon.setAttribute('stroke-linejoin', 'round');
                searchIcon.innerHTML = '<circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />';
                
                const sourcesText = document.createElement('span');
                sourcesText.textContent = 'Sources:';
                
                sourcesHeader.appendChild(searchIcon);
                sourcesHeader.appendChild(sourcesText);
                messageSources.appendChild(sourcesHeader);
                
                const sourcesContent = document.createElement('div');
                sourcesContent.className = 'sources-content';
                
                message.sources.forEach(source => {
                    const sourceTag = document.createElement('span');
                    sourceTag.className = 'source-tag';
                    sourceTag.textContent = `${source.name} (${Math.round(source.confidence * 100)}%) - ${source.language}`;
                    sourcesContent.appendChild(sourceTag);
                });
                
                messageSources.appendChild(sourcesContent);
                messageCard.appendChild(messageSources);
            }
            
            messageWrapper.appendChild(messageCard);
            chatContent.appendChild(messageWrapper);
        });
        
        scrollToBottom();
    }
    
    // Render research indicator
    function renderResearchIndicator() {
        const chatContent = document.querySelector('.chat-content');
        
        const researchIndicator = document.createElement('div');
        researchIndicator.className = 'research-indicator';
        researchIndicator.id = 'research-indicator';
        
        const researchCard = document.createElement('div');
        researchCard.className = 'research-card';
        
        // Sender info
        const researchSender = document.createElement('div');
        researchSender.className = 'research-sender';
        
        const botIcon = document.createElement('svg');
        botIcon.className = 'sender-icon';
        botIcon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        botIcon.setAttribute('width', '24');
        botIcon.setAttribute('height', '24');
        botIcon.setAttribute('viewBox', '0 0 24 24');
        botIcon.setAttribute('fill', 'none');
        botIcon.setAttribute('stroke', 'currentColor');
        botIcon.setAttribute('stroke-width', '2');
        botIcon.setAttribute('stroke-linecap', 'round');
        botIcon.setAttribute('stroke-linejoin', 'round');
        botIcon.innerHTML = '<rect x="3" y="3" width="18" height="18" rx="2" /><path d="M12 7v0.01" /><path d="M12 17v0.01" /><path d="M7 12h0.01" /><path d="M17 12h0.01" /><path d="M12 12h0.01" />';
        
        const senderName = document.createElement('span');
        senderName.className = 'sender-name';
        senderName.textContent = 'Assistant';
        
        researchSender.appendChild(botIcon);
        researchSender.appendChild(senderName);
        researchCard.appendChild(researchSender);
        
        // Research status
        const researchStatus = document.createElement('div');
        researchStatus.className = 'research-status';
        
        const researchText = document.createElement('div');
        researchText.className = 'research-text';
        
        const searchIcon = document.createElement('svg');
        searchIcon.className = 'sender-icon pulse';
        searchIcon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        searchIcon.setAttribute('width', '24');
        searchIcon.setAttribute('height', '24');
        searchIcon.setAttribute('viewBox', '0 0 24 24');
        searchIcon.setAttribute('fill', 'none');
        searchIcon.setAttribute('stroke', 'currentColor');
        searchIcon.setAttribute('stroke-width', '2');
        searchIcon.setAttribute('stroke-linecap', 'round');
        searchIcon.setAttribute('stroke-linejoin', 'round');
        searchIcon.innerHTML = '<circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />';
        
        const statusText = document.createElement('span');
        statusText.textContent = 'Researching across multiple AI models (HTML, CSS, JS, Python)...';
        
        researchText.appendChild(searchIcon);
        researchText.appendChild(statusText);
        researchStatus.appendChild(researchText);
        
        // Skeleton loaders
        const skeletonLong = document.createElement('div');
        skeletonLong.className = 'skeleton long';
        
        const skeletonMedium = document.createElement('div');
        skeletonMedium.className = 'skeleton medium';
        
        researchStatus.appendChild(skeletonLong);
        researchStatus.appendChild(skeletonMedium);
        
        researchCard.appendChild(researchStatus);
        researchIndicator.appendChild(researchCard);
        
        chatContent.appendChild(researchIndicator);
    }
    
    // Scroll to bottom of chat container
    function scrollToBottom() {
        setTimeout(() => {
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }, 0);
    }
});
