# LaTeX Rich Text Editor

A modern, production-ready LaTeX editor with live preview, built with React.js and Node.js. Perfect for writing mathematical equations, chemistry formulas, and academic documents.

## ✨ Features

### Frontend
- **Live LaTeX Preview**: Real-time rendering of LaTeX equations using KaTeX
- **Split-Screen Interface**: Editor on the left, preview on the right
- **Custom Toolbar**: Clickable math and chemistry symbols
- **Note Management**: Create, edit, delete, and organize notes
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern UI**: Clean, professional design with TailwindCSS

### Backend
- **RESTful API**: Full CRUD operations for notes
- **MongoDB Integration**: Reliable data storage with Mongoose
- **Search & Pagination**: Find notes quickly with advanced search
- **Security**: Helmet, CORS, and input validation
- **Error Handling**: Comprehensive error management

## 🚀 Tech Stack

- **Frontend**: React.js, TypeScript, TailwindCSS, KaTeX
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Development**: Vite, ESLint, PostCSS
- **Deployment**: Vercel (frontend), MongoDB Atlas (database)

## 📋 Math & Chemistry Symbols

### Mathematics
- Summation (∑), Integral (∫), Square root (√)
- Greek letters (α, β, γ, δ, θ, λ, μ, σ, φ, ψ, ω)
- Operators (≤, ≥, ≠, ∞, π)
- Functions, limits, matrices, fractions

### Chemistry
- Common compounds (H₂O, CO₂, NaCl, CH₄, NH₃)
- Reaction arrows (→, ⇌, ↑, ↓)
- Charges (⁺, ⁻, ²⁺, ²⁻)
- Thermodynamics (Δ, ΔH, pH, Kₑq)

## 🛠️ Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Frontend Setup
1. Install dependencies:
   ```bash
   npm install
   ```

2. Create environment file:
   ```bash
   cp .env.example .env
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

### Backend Setup
1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```

4. Start the server:
   ```bash
   npm run dev
   ```

## 🔧 Configuration

### Environment Variables

#### Frontend (.env)
```
VITE_API_URL=http://localhost:3001/api
```

#### Backend (.env)
```
MONGODB_URI=mongodb://localhost:27017/latex-editor
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### MongoDB Setup
1. **Local MongoDB**: Install and run MongoDB locally
2. **MongoDB Atlas**: Create a free cluster and get connection string

## 🚀 Deployment

### Frontend (Vercel)
1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically on push

### Backend (Railway/Heroku)
1. Create new app
2. Connect GitHub repository
3. Set environment variables
4. Deploy

### Database (MongoDB Atlas)
1. Create MongoDB Atlas account
2. Create new cluster
3. Get connection string
4. Update backend environment variables

## 📖 Usage

### Basic LaTeX
```latex
Inline math: $E = mc^2$
Display math: $$\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}$$
```

### Advanced Examples
```latex
Matrix: $\begin{pmatrix} a & b \\ c & d \end{pmatrix}$
Fraction: $\frac{numerator}{denominator}$
Limit: $\lim_{x \to 0} \frac{\sin x}{x} = 1$
```

### Chemistry
```latex
Reaction: $CH_4 + 2O_2 \rightarrow CO_2 + 2H_2O$
Equilibrium: $N_2 + 3H_2 \rightleftharpoons 2NH_3$
```

## 🎨 Design Features

- **Apple-Level Aesthetics**: Clean, professional design
- **Responsive Layout**: Mobile-first approach
- **Smooth Animations**: Hover effects and transitions
- **Accessibility**: WCAG compliant design
- **Dark Mode Ready**: Easy theme switching

## 📁 Project Structure

```
latex-editor/
├── src/
│   ├── components/
│   │   ├── Editor.tsx
│   │   ├── Preview.tsx
│   │   ├── Toolbar.tsx
│   │   ├── NotesList.tsx
│   │   └── NoteEditor.tsx
│   ├── services/
│   │   └── api.ts
│   ├── types/
│   │   └── index.ts
│   └── data/
│       └── symbols.ts
├── backend/
│   ├── models/
│   │   └── Note.js
│   ├── routes/
│   │   └── notes.js
│   └── server.js
└── README.md
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [KaTeX](https://katex.org/) for LaTeX rendering
- [React](https://reactjs.org/) for the UI framework
- [TailwindCSS](https://tailwindcss.com/) for styling
- [MongoDB](https://mongodb.com/) for database
- [Vercel](https://vercel.com/) for deployment
