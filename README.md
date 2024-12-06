# Grammar Tune  

Grammar Tune is an intelligent grammar-checking and text manipulation application powered by AI. It offers real-time grammar correction, text summarization, paraphrasing, translation, and more. With its user-friendly rich text editor, Grammar Tune provides a seamless experience for text interaction, catering to a wide range of language-processing needs.

---

## Features  

- **Grammar Checking**: Detect and correct grammar errors instantly.  
- **Text Summarization**: Create concise summaries in paragraph or bullet-point formats.  
- **Text Paraphrasing**: Rewrite text in various styles while preserving meaning.  
- **Language Translation**: Translate text between multiple languages with ease.  
- **AI Model Selection**: Choose from multiple AI models for customized results.  
- **Rich Text Editor**: A fully-featured editor for intuitive text editing.  
- **PDF Extraction**: Upload and extract text from PDFs for editing or summarization.  
- **Clipboard Support**: Paste text directly into the editor for quick input.  
- **UI for Summarization**: Select between paragraph and bullet-point summaries.  
- **Word Count**: Real-time word count for the editor's text.  
- **Processing Animation**: Visual feedback while tasks are being performed.  

---

## Supported Languages for Grammar Checking  

### English Variants:  
- American English  
- British English  
- Canadian English  
- Australian English  
- New Zealand English  
- Indian English  
- South African English  

### Other Languages:  
- Spanish (ES)  
- French (FR)  
- German (DE)  
- Italian (IT)  
- Portuguese (PT)  
- Dutch (NL)  
- Russian (RU)  

**Note**: Accuracy may vary based on dialects and cultural expressions.  

---

## Supported AI Models  

Grammar Tune supports the following AI models for grammar checking, summarization, paraphrasing, and translation:  

- MetaLlama-31-8B-Instruct  
- MetaLlama-31-70B-Instruct  
- MetaLlama-31-405B-Instruct  
- MetaLlama-32-1B-Instruct  
- MetaLlama-32-3B-Instruct  
- Llama32-11B-Vision-Instruct  
- Llama32-90B-Vision-Instruct  

---

## How It Works  

1. **Grammar Checking**: Input text into the editor for real-time error detection and correction.  
2. **Text Summarization**: Choose between paragraph or bullet-point summaries, and process text accordingly.  
3. **Text Paraphrasing**: Rewrite text in various styles with a focus on clarity.  
4. **Translation**: Translate text between supported languages.  
5. **AI Model Selection**: Select AI models for tasks like grammar checking or summarization.  
6. **PDF Upload**: Extract and edit text from uploaded PDF files.  
7. **Clipboard Integration**: Paste content directly into the editor for processing.  

---

## Getting Started  

### Prerequisites  

- Node.js  
- React  
- Material UI (MUI)  
- Modus CLI (HyperMode)  

### Installation  

#### Frontend:  
1. Clone the repository:  
   ```bash  
   git clone https://github.com/tope-olajide/grammar-tune.git  
   ```  
2. Install dependencies:  
   ```bash  
   cd grammar-tune  
   npm install  
   ```  
3. Start the frontend server:  
   ```bash  
   npm start  
   ```  

#### Backend:  
1. Clone the repository:  
   ```bash  
   git clone https://github.com/tope-olajide/grammar-tune-api.git  
   ```  
2. Install dependencies:  
   ```bash  
   cd grammar-tune-api  
   npm install  
   ```  
3. Install Modus CLI globally:  
   ```bash  
   npm install -g @hypermode/modus-cli  
   ```  
4. Add your SambaNova API key to a `.env.dev.local` file:  
   ```plaintext  
   MODUS_SAMBA_NOVA_API_KEY = "Your_API_Key"  
   ```  
5. Start the backend server:  
   ```bash  
   modus dev  
   ```  

---

### Environment Variables  

In the frontend, create a `.env` file and set the API endpoint:  
```plaintext  
API_ENDPOINT = "http://localhost:8686/graphql"  
```  

---

## Usage  

1. Visit the live application at [Grammar Tune](https://grammar-tune.vercel.app).  
2. Upload a PDF, paste text, or type directly into the editor.  
3. Select an AI model for grammar checking, summarization, or translation.  
4. Process the text and review suggestions or results.  

---

## Links  

- **[Grammar Tune Website](https://grammar-tune.vercel.app/)**  
- **[Frontend GitHub Repository](https://github.com/tope-olajide/grammar-tune/)**  
- **[Backend GitHub Repository](https://github.com/tope-olajide/grammar-tune-api/)**  

---

## Contributing  

Contributions are welcome! Fork the repository, make changes, and submit a pull request. For bugs or feature requests, please open an issue.  

---

## License  

This project is licensed under the MIT License. See the `LICENSE` file for details.  