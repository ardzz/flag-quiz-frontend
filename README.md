# FlagMaster - Vue.js Frontend

A modern, responsive Vue.js application for the Flag Guesser game built with Vite, Vue 3, Pinia, and Tailwind CSS.

## Features

- 🎮 Interactive flag guessing game with timer
- 🌓 Dark/Light mode support
- 🏆 Leaderboard system
- 👤 User authentication (Login/Register)
- 📊 Score tracking and game history
- 🎨 Beautiful UI with Tailwind CSS
- ⚡ Fast development with Vite
- 📱 Fully responsive design

## Tech Stack

- **Framework**: Vue.js 3 with Composition API
- **State Management**: Pinia
- **Routing**: Vue Router
- **HTTP Client**: Axios
- **UI Framework**: Tailwind CSS
- **Build Tool**: Vite
- **Icons**: Heroicons

## Project Structure

```
flag-guesser-frontend/
├── src/
│   ├── assets/          # Static assets and styles
│   ├── components/      # Reusable Vue components
│   │   ├── auth/       # Authentication components
│   │   ├── game/       # Game-related components
│   │   └── common/     # Shared components
│   ├── router/         # Vue Router configuration
│   ├── services/       # API services
│   ├── stores/         # Pinia stores
│   ├── views/          # Page components
│   └── main.js         # Application entry point
├── public/             # Public static files
└── package.json
```

## Setup and Installation

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation Steps

1. Clone the repository:
```bash
git clone <repository-url>
cd flag-quiz-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
   - Copy `.env.development` and update the API URL if needed
   - For production, update `.env.production`

4. Start development server:
```bash
npm run dev
```

5. Build for production:
```bash
npm run build
```

6. Preview production build:
```bash
npm run preview
```

## Environment Variables

Create `.env.development` and `.env.production` files:

```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
VITE_WS_URL=http://localhost:3000
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

## Key Components

### Views
- **Home**: Landing page with features and leaderboard preview
- **Login/Register**: Authentication views
- **GameLobby**: Template selection
- **GamePlay**: Main game interface
- **Leaderboard**: Global rankings
- **Profile**: User profile and stats

### Components
- **Navbar**: Navigation with theme toggle
- **GameTimer**: Countdown timer with visual feedback
- **FlagDisplay**: Flag image with blur effect
- **AnswerOptions**: Multiple choice answers
- **ScoreDisplay**: Real-time score tracking

### Stores
- **auth**: User authentication state
- **game**: Game state and logic
- **leaderboard**: Leaderboard data

## API Integration

The app integrates with a REST API backend. Key endpoints:

- `/auth/login` - User login
- `/auth/register` - User registration
- `/game-templates` - Get available game templates
- `/games` - Create and manage games
- `/leaderboard` - Get leaderboard data

## Dark Mode

The application supports both light and dark modes. Users can toggle between themes using the button in the navbar. The preference is saved to localStorage.

## Deployment

### Netlify

Create `netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Vercel

Create `vercel.json`:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License

## Credits

Built with ❤️ using Vue.js and Tailwind CSS
