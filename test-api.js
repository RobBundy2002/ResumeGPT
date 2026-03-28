const OpenAI = require('openai');

// Test with your API key
const openai = new OpenAI({
  apiKey: ''
});

async function testAPI() {
  try {
    console.log('Testing OpenAI API connection...');
    
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: "Hello" }],
      max_tokens: 5,
    });
    
    console.log('✅ API connection successful!');
    console.log('Response:', completion.choices[0].message.content);
  } catch (error) {
    console.log('❌ API connection failed:');
    console.log('Error:', error.message);
    console.log('Status:', error.status);
    console.log('Type:', error.type);
  }
}

testAPI(); 