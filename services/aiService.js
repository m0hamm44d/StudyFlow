const fs = require('fs');
const pdfParse = require('pdf-parse');
const textract = require('textract');
const OpenAI = require('openai'); // Import the OpenAI package

// Initialize OpenAI API
console.log('Loaded OPENAI_API_KEY:', process.env.OPENAI_API_KEY); // Debug log

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Use your API key from environment variables
});

// Function to extract text from uploaded files
async function extractText(filePath) {
  console.log('Extracting text from file:', filePath); // Log the file path
  const fileExtension = filePath.split('.').pop().toLowerCase();
  console.log('File extension:', fileExtension); // Log the file extension

  try {
    if (fileExtension === 'pdf') {
      console.log('Detected PDF file. Using pdf-parse...');
      const dataBuffer = fs.readFileSync(filePath);
      const pdfData = await pdfParse(dataBuffer);
      console.log('PDF text extracted successfully.');
      return pdfData.text;
    } else {
      console.log('Passing file to textract...');
      return new Promise((resolve, reject) => {
        textract.fromFileWithPath(filePath, (error, text) => {
          if (error) {
            console.error('Textract error:', error); // Log textract errors
            reject(new Error('Textract failed to extract text.'));
          } else {
            console.log('Textract text extracted successfully.');
            resolve(text);
          }
        });
      });
    }
  } catch (err) {
    console.error('Error in extractText:', err); // Log general errors
    throw new Error('Failed to extract text from file.');
  }
}

// Function to generate flashcards using OpenAI
async function generateFlashcards(text) {
  try {
    console.log('Generating flashcards with OpenAI...');
    const prompt = `Generate concise and clear flashcards based on the following content:\n\n${text}`;
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // Adjust the model as needed
      messages: [{ role: 'user', content: prompt }],
    });

    console.log('Flashcards generated successfully.');
    return response.choices[0].message.content
      .trim()
      .split('\n')
      .filter(Boolean);
  } catch (error) {
    console.error('Error generating flashcards:', error); // Log OpenAI errors
    throw new Error('Failed to generate flashcards.');
  }
}

// Main processing function
exports.processFileToFlashcards = async (filePath) => {
  try {
    const extractedText = await extractText(filePath);
    return await generateFlashcards(extractedText);
  } catch (error) {
    console.error('Error processing file to flashcards:', error); // Log processing errors
    throw new Error('File processing failed.');
  }
};