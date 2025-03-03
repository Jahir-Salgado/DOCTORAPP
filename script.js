// Configuración de Supabase
const supabaseUrl = 'https://nzrbkfvspfcmolnblksv.supabase.co'; // Reemplaza con tu URL de Supabase
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im56cmJrZnZzcGZjbW9sbmJsa3N2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA5NzkyNzYsImV4cCI6MjA1NjU1NTI3Nn0.xRNoLwvs3xbBAcWSpjYJHbfhCQTyKF6MJWp1CDUS_LI'; // Reemplaza con tu API Key de Supabase
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// Función para el botón de Zoom (sin cambios)
document.getElementById('zoomButton').addEventListener('click', function() {
    const zoomLink = "https://us05web.zoom.us/j/82789212171?pwd=m4wKaRwRNbVv3RwERha5wuFaZRqXw1.1";
    window.open(zoomLink, "_blank");
});

// Registro de usuario
document.getElementById('registerForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;

    // Registrar usuario con Supabase
    const { user, error } = await supabase.auth.signUp({ email, password });
    if (error) {
        alert("Error en el registro: " + error.message);
    } else {
        alert("Registro exitoso. Ahora puedes iniciar sesión.");
        document.getElementById('registerForm').reset();
    }
});

// Login de usuario
document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    // Iniciar sesión con Supabase
    const { user, error } = await supabase.auth.signIn({ email, password });
    if (error) {
        alert("Error en el login: " + error.message);
    } else {
        alert("Inicio de sesión exitoso. Redirigiendo a DoctorApp...");
        window.location.href = "indexinicio.html"; // Redirigir a DoctorApp
    }
});

// Función para enviar mensajes al chatbot (sin cambios)
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

// Función para agregar mensajes al historial del chat (sin cambios)
function addMessageToChat(message) {
    const chatHistory = document.getElementById('chatHistory');
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    chatHistory.appendChild(messageElement);
    chatHistory.scrollTop = chatHistory.scrollHeight; // Desplazar al final
}

// Función para enviar mensajes a la API de DeepSeek (sin cambios)
async function sendMessageToChatbot(message) {
    const apiKey = 'sk-3af2a5ca314242a7b792b27b99870c13'; // Tu clave de API de DeepSeek
    const apiUrl = 'https://api.deepseek.com/v1/completions'; // Reemplaza con el endpoint correcto

    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: "deepseek-model", // Reemplaza con el modelo correcto
            prompt: message,
            max_tokens: 150 // Ajusta según sea necesario
        })
    });

    if (!response.ok) {
        throw new Error("Error en la solicitud a la API");
    }

    const data = await response.json();
    return data.choices[0].text.trim(); // Ajusta según la estructura de la respuesta
}