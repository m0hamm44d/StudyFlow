require('dotenv').config();
const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function testOpenAI() {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: 'Test message for OpenAI.' }],
    });

    console.log('OpenAI Response:', response.choices[0].message.content);
  } catch (error) {
    console.error('Error testing OpenAI:', error);
  }
}

testOpenAI();