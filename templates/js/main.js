/* templates/js/main.js */
$(document).ready(function() {
    let isProcessing = false;
    const $messageInput = $('#message-input');
    const $sendButton = $('#send-button');
    const $errorMessage = $('#error-message');
    const $chatMessages = $('#chat-messages');

    // Marked.js 설정
    marked.setOptions({
        highlight: function(code, lang) {
            if (lang && hljs.getLanguage(lang)) {
                return hljs.highlight(code, { language: lang }).value;
            }
            return hljs.highlightAuto(code).value;
        },
        breaks: true,
        gfm: true
    });

    function adjustTextareaHeight() {
        $messageInput.height('auto').height($messageInput[0].scrollHeight);
    }

    function showError(message) {
        $errorMessage.text(message).removeClass('d-none');
        setTimeout(() => $errorMessage.addClass('d-none'), 3000);
    }

    function appendMessage(role, content) {
        const htmlContent = role === 'assistant' ? 
            DOMPurify.sanitize(marked.parse(content)) : 
            DOMPurify.sanitize(content);

        const $messageDiv = $('<div>')
            .addClass(`message ${role}-message`)
            .html(htmlContent);

        $chatMessages.append($messageDiv);
        
        $messageDiv.find('pre code').each((i, block) => {
            hljs.highlightBlock(block);
        });

        $chatMessages.scrollTop($chatMessages[0].scrollHeight);
    }

    async function sendMessage(message, showUserMessage = true, isInitialMessage = false) {
        if (isProcessing) return;
        
        const messageText = message || $messageInput.val().trim();
        if (!messageText) return;

        try {
            isProcessing = true;
            $sendButton.prop('disabled', true);
            $errorMessage.addClass('d-none');
            
            if (showUserMessage) {
                appendMessage('user', messageText);
            }
            
            if (!message) {
                $messageInput.val('').trigger('input');
            }

            const $loading = $('<div>')
                .addClass('my-2')
                .html(`<div class="spinner-border spinner-border-sm text-primary"></div> ${
                    isInitialMessage ? '접속 중...' : '응답 생성 중...'
                }`);
            $chatMessages.append($loading);

            const response = await fetch('/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: messageText })
            });

            if (!response.ok) {
                throw new Error('서버 오류가 발생했습니다.');
            }

            const data = await response.json();
            if (data.error) {
                throw new Error(data.error);
            }
            
            $loading.remove();
            appendMessage('assistant', data.response);
            
        } catch (error) {
            console.error('Error:', error);
            showError(error.message);
            $('.loading').remove();
        } finally {
            isProcessing = false;
            $sendButton.prop('disabled', false);
            $messageInput.focus();
        }
    }

    // 이벤트 핸들러 등록
    $messageInput
        .on('input', adjustTextareaHeight)
        .on('keydown', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });

    $sendButton.on('click', () => sendMessage());
    
    // 페이지 로드 시 초기 메시지 전송
    sendMessage("안녕!", false, true);  // 세 번째 파라미터로 isInitialMessage를 true로 설정
});