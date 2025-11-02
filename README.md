# Premium Quiz Bot - Telegram Mini App

A modern, feature-rich Telegram Mini App for creating, managing, and tracking quizzes. Built with React, Express, and designed specifically for Telegram's WebView environment.

## ✨ Features

- 📊 **Dashboard** - View quiz statistics and engagement metrics
- ✏️ **Create Quizzes** - Build interactive quizzes with multiple choice questions
- 📚 **Quiz Management** - Edit, delete, and organize your quizzes
- 💰 **Paid/Free Quizzes** - Monetize your content with paid quiz options
- 🌙 **Dark Mode** - Automatic theme switching based on user preference
- 📱 **Mobile-First** - Optimized for Telegram's mobile experience
- 🎨 **Beautiful UI** - Modern purple gradient design with smooth animations

## 🚀 Quick Start

### Prerequisites

- Node.js 20 or higher
- npm or yarn
- Telegram Bot Token (from @BotFather)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/premium-quiz-bot-miniapp.git
   cd premium-quiz-bot-miniapp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your configuration:
   ```env
   BOT_TOKEN=your_telegram_bot_token_here
   SESSION_SECRET=your_random_session_secret
   PORT=5000
   NODE_ENV=development
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5000`

## 📦 Deployment to Koyeb

### Method 1: Deploy from GitHub (Recommended)

1. **Push your code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/premium-quiz-bot-miniapp.git
   git push -u origin main
   ```

2. **Deploy on Koyeb**
   - Go to [Koyeb](https://app.koyeb.com)
   - Click "Create App"
   - Select "GitHub" as the deployment method
   - Choose your repository
   - Configure the deployment:
     - **Build command**: `npm install && npm run build`
     - **Run command**: `npm start`
     - **Port**: `5000`
   - Add environment variables:
     - `BOT_TOKEN`: Your Telegram bot token
     - `SESSION_SECRET`: A random secret string
     - `NODE_ENV`: `production`

3. **Get your Mini App URL**
   - After deployment, copy your app URL (e.g., `https://your-app.koyeb.app`)

4. **Configure your Telegram Bot**
   
   Set the Mini App URL in your bot using BotFather:
   ```
   /mybots → Select your bot → Bot Settings → Menu Button → Configure Menu Button
   ```
   
   Or use this command in your bot code:
   ```python
   await bot.set_chat_menu_button(
       menu_button=MenuButtonWebApp(
           text="Open Quiz App",
           web_app=WebAppInfo(url="https://your-app.koyeb.app")
       )
   )
   ```

### Method 2: Deploy with Docker

1. **Build the Docker image**
   ```bash
   docker build -t premium-quiz-bot .
   ```

2. **Run with Docker Compose**
   ```bash
   docker-compose up -d
   ```

3. **Or run directly**
   ```bash
   docker run -p 5000:5000 \
     -e BOT_TOKEN=your_token \
     -e SESSION_SECRET=your_secret \
     premium-quiz-bot
   ```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `BOT_TOKEN` | Your Telegram bot token from @BotFather | Yes | - |
| `SESSION_SECRET` | Random string for session encryption | Yes | - |
| `PORT` | Server port | No | 5000 |
| `NODE_ENV` | Environment (development/production) | No | development |
| `MINI_APP_URL` | Full URL of your deployed Mini App | No | - |

### Integrating with Your Python Bot

To connect this Mini App with your existing Python quiz bot:

1. **Add the Web App button to your bot**
   ```python
   from telegram import MenuButtonWebApp, WebAppInfo
   
   await context.bot.set_chat_menu_button(
       menu_button=MenuButtonWebApp(
           text="📱 Open Quiz App",
           web_app=WebAppInfo(url="https://your-app.koyeb.app")
       )
   )
   ```

2. **Handle Web App data in your bot** (optional)
   ```python
   async def handle_web_app_data(update: Update, context: ContextTypes.DEFAULT_TYPE):
       data = update.effective_message.web_app_data.data
       # Process the data from the Mini App
       await update.message.reply_text(f"Received: {data}")
   
   app.add_handler(MessageHandler(filters.StatusUpdate.WEB_APP_DATA, handle_web_app_data))
   ```

## 📁 Project Structure

```
premium-quiz-bot-miniapp/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── contexts/      # React contexts (Theme)
│   │   ├── lib/           # Utility functions
│   │   ├── pages/         # Page components
│   │   └── App.tsx        # Main app component
│   └── index.html
├── server/                 # Backend Express server
│   ├── routes.ts          # API routes
│   ├── storage.ts         # Data storage layer
│   └── index.ts           # Server entry point
├── shared/                 # Shared types and schemas
│   └── schema.ts          # Database schemas
├── Dockerfile             # Docker configuration
├── docker-compose.yml     # Docker Compose configuration
└── package.json           # Dependencies and scripts
```

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run check` - Run TypeScript type checking

### Tech Stack

**Frontend:**
- React 18
- TypeScript
- Tailwind CSS
- Shadcn UI components
- Telegram Mini App SDK
- TanStack Query (React Query)
- Wouter (routing)

**Backend:**
- Express.js
- TypeScript
- In-memory storage (easily upgradable to PostgreSQL)
- Zod validation

## 🔄 Upgrading to PostgreSQL

The app currently uses in-memory storage. To upgrade to PostgreSQL:

1. **Set up PostgreSQL database** on your hosting platform

2. **Update `server/storage.ts`** to use Drizzle ORM with PostgreSQL

3. **Add database connection**
   ```typescript
   import { drizzle } from 'drizzle-orm/node-postgres';
   import { Pool } from 'pg';
   
   const pool = new Pool({ connectionString: process.env.DATABASE_URL });
   export const db = drizzle(pool);
   ```

4. **Run migrations**
   ```bash
   npm run db:push
   ```

## 📝 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/stats/:userId` | Get quiz statistics for a user |
| GET | `/api/quizzes/:userId` | Get all quizzes for a user |
| GET | `/api/quiz/:id` | Get a single quiz by ID |
| POST | `/api/quiz` | Create a new quiz |
| PATCH | `/api/quiz/:id` | Update a quiz |
| DELETE | `/api/quiz/:id` | Delete a quiz |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/yourusername/premium-quiz-bot-miniapp/issues) page
2. Create a new issue with detailed information
3. Contact the maintainer

## 🙏 Acknowledgments

- Built with [Replit](https://replit.com)
- UI components from [Shadcn UI](https://ui.shadcn.com)
- Telegram Mini App SDK

---

Made with ❤️ for Telegram Bot Developers
