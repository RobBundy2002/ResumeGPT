# 🧠 ResumeGPT - AI-Powered Resume Analyzer & Job Match Tool

A smart, full-stack application that uses OpenAI's GPT-4 to analyze resumes against job descriptions and provide detailed matching scores, missing keywords, and improvement suggestions.

![ResumeGPT Demo](https://img.shields.io/badge/Status-Live-brightgreen)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4-purple)

## ✨ Features

- **📄 Resume Upload**: Support for PDF and text files with drag-and-drop interface
- **🎯 Job Description Analysis**: Paste any job description for comprehensive matching
- **🤖 AI-Powered Analysis**: Uses GPT-4 for intelligent resume-job matching
- **📊 Match Scoring**: 0-100 score with visual progress indicators
- **🔍 Keyword Analysis**: Identifies missing and matching keywords
- **💡 Smart Suggestions**: Actionable improvement recommendations
- **✍️ Resume Rewrites**: Specific suggestions for bullet point improvements
- **📱 Responsive Design**: Beautiful, modern UI that works on all devices
- **⚡ Real-time Analysis**: Fast, accurate results powered by OpenAI

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ResumeGPT.git
   cd ResumeGPT
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Set up environment variables**
   ```bash
   # Copy the example environment file
   cp server/.env.example server/..env
   
   # Edit server/..env and add your OpenAI API key
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. **Start the development servers**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI framework
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **React Dropzone** - File upload functionality
- **React Hot Toast** - User notifications
- **Axios** - HTTP client

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **OpenAI API** - GPT-4 integration
- **Multer** - File upload handling
- **PDF-Parse** - PDF text extraction
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing

## 📖 Usage

1. **Upload Resume**: Drag and drop a PDF or text file, or paste your resume content directly
2. **Add Job Description**: Paste the complete job description you want to match against
3. **Analyze**: Click "Analyze Match" to get AI-powered insights
4. **Review Results**: 
   - Check your match score (0-100)
   - Review missing and matching keywords
   - Read improvement suggestions
   - See specific resume rewrite recommendations

## 🔧 API Endpoints

### Health Check
```
GET /api/health
```

### Upload Resume
```
POST /api/upload-resume
Content-Type: multipart/form-data
Body: resume file (PDF or TXT)
```

### Analyze Resume
```
POST /api/analyze
Content-Type: application/json
Body: {
  "resume": "resume text content",
  "jobDescription": "job description text"
}
```

## 🎨 Customization

### Styling
The app uses Tailwind CSS for styling. You can customize the design by modifying:
- `client/src/index.css` - Global styles and custom components
- `client/tailwind.config.js` - Tailwind configuration
- Individual component files for specific styling

### OpenAI Prompt
The analysis prompt can be customized in `server/index.js`. Look for the `prompt` variable in the `/api/analyze` endpoint.

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push

### Heroku
1. Create a Heroku app
2. Set environment variables
3. Deploy using Heroku CLI

### Docker
```bash
# Build the image
docker build -t resumegpt .

# Run the container
docker run -p 3000:3000 -p 5000:5000 resumegpt
```

## 🔒 Security

- Rate limiting on API endpoints
- Helmet.js for security headers
- File upload validation
- CORS configuration
- Input sanitization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- OpenAI for providing the GPT-4 API
- The React and Node.js communities
- All contributors and users of ResumeGPT

## 📞 Support

If you have any questions or need help:
- Open an issue on GitHub
- Check the documentation
- Contact the maintainers

---

**Made with ❤️ for job seekers everywhere**