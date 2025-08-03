const OpenAI = require('openai');

// Test with your API key
const openai = new OpenAI({
  apiKey: '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'
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