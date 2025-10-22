const OPENAI_API_KEY = "foobar";

// Helper function to read file as base64 using XMLHttpRequest
const readFileAsBase64 = (uri) => {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
            const reader = new FileReader();
            reader.onloadend = function () {
                // Extract base64 data after the comma
                const base64 = reader.result.split(',')[1];
                resolve(base64);
            };
            reader.onerror = reject;
            reader.readAsDataURL(xhr.response);
        };
        xhr.onerror = reject;
        xhr.responseType = 'blob';
        xhr.open('GET', uri, true);
        xhr.send(null);
    });
};

export const translateHindi = async (imageUri) => {
    try {
        console.log('=== Starting translateHindi ===');
        console.log('Image URI:', imageUri);

        // Read file as base64
        console.log('Step 1: Reading file as base64...');
        const base64String = await readFileAsBase64(imageUri);
        console.log('Base64 conversion complete, length:', base64String?.length);

        console.log('Step 4: Making OpenAI API call...');
        const requestBody = {
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: `You are a translator. Extract all Hindi text from the image and output literal, word-by-word English translation in JSON: [{eng:'...', hin:'...'}].
        example: [{"eng": "Forest in one tree on very many cranes lived were", "hin": "जंगल में एक पेड़ पर बहुत सारे बगुले रहते थे |"}]`,
                },
                {
                    role: "user",
                    content: [
                        { type: "text", text: "Translate this image" },
                        {
                            type: "image_url",
                            image_url: {
                                url: `data:image/jpeg;base64,${base64String}`
                            }
                        },
                    ],
                },
            ],
        };

        console.log('Request body prepared, message count:', requestBody.messages.length);

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
            },
            body: JSON.stringify(requestBody),
        });

        console.log('OpenAI API response status:', response.status, response.ok);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('OpenAI API error response:', errorText);
            throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
        }

        console.log('Step 5: Parsing response...');
        const data = await response.json();
        console.log('OpenAI response received, choices:', data.choices?.length);

        const resultText = data.choices[0].message.content;
        console.log('Result text:', resultText);

        try {
            return JSON.parse(resultText);
        } catch {
            console.warn("Not strict JSON:", resultText);
            return resultText;
        }
    } catch (error) {
        console.error('=== Error in translateHindi ===');
        console.error('Error type:', error.constructor.name);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        throw error;
    }
}
