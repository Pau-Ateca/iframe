function onEnterPress(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
}

// Esta función enviará el mensaje del usuario al bot
async function sendMessage() {
    var input = document.getElementById('chat-message');
    var userMessage = input.value.trim();

    if (userMessage !== '') {
        try {
            await sendMessageToChatbase(userMessage); // Enviar el mensaje del usuario al bot
            input.value = ''; // Vaciar el input de texto después de enviar el mensaje
        } catch (error) {
            console.error('Error al enviar el mensaje:', error);
        }
    }
}

// Esta función enviará el mensaje al bot y manejará la respuesta
async function sendMessageToChatbase(userMessage) {
    const chatbotId = "zSO6Sk6htdxWvmCn2IhXL";
    const apiUrl = "https://76dd-145-1-219-48.ngrok-free.app/Assistant/SendMessage";

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chatbotId: chatbotId,
                message: userMessage,
                user: "user"
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message);
        }

        const data = await response.text();
        handleChatbaseResponse(data, userMessage); // Manejar la respuesta del bot
    } catch (error) {
        console.error('Error al enviar el mensaje:', error);
    }
}

// Esta función manejará la respuesta del bot y la agregará a la conversación
function handleChatbaseResponse(message, userMessage) {
    var conversation = getConversationFromLocalStorage(); // Obtener la conversación actual del local storage

    if (userMessage !== message) {
        conversation.push({ content: message, role: 'Traveltool Bot Assistant' }); // Si el mensaje recibido es diferente al enviado por el usuario, es del bot
    } else {
        conversation.push({ content: message, role: 'User' }); // Si el mensaje recibido es el mismo que el enviado por el usuario, es del usuario
    }

    saveConversationToLocalStorage(conversation); // Guardar la conversación actualizada en el local storage
    renderConversation(); // Renderizar la conversación
}

// Esta función renderizará la conversación en el chat
function renderConversation() {
    var conversation = getConversationFromLocalStorage(); // Obtener la conversación actual del local storage
    var messageWindow = document.getElementById('message-window');
    messageWindow.innerHTML = ''; // Limpiar el contenido actual del contenedor de la conversación

    conversation.forEach(item => {
        var messageElement = document.createElement('div');
        messageElement.classList.add('message', item.role.toLowerCase()); // Aplicar clase correspondiente al rol

        var messageContent = document.createElement('p');
        messageContent.textContent = item.content;

        messageElement.appendChild(messageContent);
        messageWindow.appendChild(messageElement);
    });
}