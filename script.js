// Función para el botón de Zoom
document.getElementById('zoomButton').addEventListener('click', function() {
    const zoomLink = "https://us05web.zoom.us/j/88392875208?pwd=Tgvj6kUDFvOEVbXj2uaZHZbXyme7S5.1";
    window.open(zoomLink, "_blank");
});

// Función para enviar mensajes al chatbot
document.getElementById('sendButton').addEventListener('click', async function() {
    const input = document.getElementById('chatInput').value;
    if (input) {
        addMessageToChat("Tú: " + input); // Mostrar el mensaje del usuario
        document.getElementById('chatInput').value = ''; // Limpiar el campo de texto

        // Enviar el mensaje a la API de DeepSeek
        try {
            const response = await sendMessageToChatbot(input);
            addMessageToChat("Chatbot: " + response); // Mostrar la respuesta del chatbot
        } catch (error) {
            addMessageToChat("Chatbot: Error al procesar tu consulta.");
            console.error("Error:", error);
        }
    } else {
        alert('Por favor, escribe tu consulta.');
    }
});

// Función para agregar mensajes al historial del chat
function addMessageToChat(message) {
    const chatHistory = document.getElementById('chatHistory');
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    chatHistory.appendChild(messageElement);
    chatHistory.scrollTop = chatHistory.scrollHeight; // Desplazar al final
}

// Función para enviar mensajes a la API de DeepSeek
async function sendMessageToChatbot(message) {
    const apiKey = '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'; // Tu clave de API
    const apiUrl = 'https://api.deepseek.com/chat/completions'; // Endpoint de chat

    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: "deepseek-chat", // Especifica el modelo
            messages: [
                {
                    role: "system",
                    content: "You are a helpful assistant." // Mensaje del sistema
                },
                {
                    role: "user",
                    content: message // Mensaje del usuario
                }
            ],
            stream: false // Respuesta no en streaming
        })
    });

    if (!response.ok) {
        throw new Error("Error en la solicitud a la API");
    }

    const data = await response.json();
    return data.choices[0].message.content; // Extraer la respuesta del chatbot
}