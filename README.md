# Thuý An Yoga Landing Page

A modern yoga landing page built with React, TypeScript, and Supabase.

## Features

- 🧘‍♀️ Yoga course management
- 👤 User authentication with Supabase
- 💳 Recharge code payment system
- 📱 Responsive design
- 🎨 Modern UI with Shadcn/ui
- 🔐 Admin panel for course management

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI**: Tailwind CSS, Shadcn/ui, Lucide React
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Deployment**: GitHub Pages

## Local Development

### Prerequisites

- Node.js 18+
- npm or yarn

### Setup

1. Clone the repository:
```bash
git clone <your-repo-url>
cd yogalanding
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:8080`

## Deployment to GitHub Pages

### Prerequisites

1. Push your code to a GitHub repository
2. Enable GitHub Pages in your repository settings
3. Set up GitHub Actions permissions

### Setup GitHub Secrets

In your GitHub repository, go to Settings > Secrets and variables > Actions, and add the following secrets:

- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key

### Deploy

1. Push your code to the `main` branch
2. The GitHub Actions workflow will automatically build and deploy your app
3. Your app will be available at `https://your-username.github.io/your-repo-name`

### Manual Deployment

If you prefer to deploy manually:

1. Build the project:
```bash
npm run build:client
```

2. The built files will be in the `dist/spa` directory
3. Upload the contents of `dist/spa` to your GitHub Pages branch

## Project Structure

```
├── client/                 # React frontend
│   ├── components/        # Reusable UI components
│   ├── contexts/          # React contexts
│   ├── hooks/            # Custom hooks
│   ├── pages/            # Page components
│   └── lib/              # Utility functions
├── supabase/             # Database schema and migrations
├── public/               # Static assets
└── .github/workflows/    # GitHub Actions
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anonymous key |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License
