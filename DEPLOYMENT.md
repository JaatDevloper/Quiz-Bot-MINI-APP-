# Deployment Guide for Premium Quiz Bot Mini App

## 🚀 Deploying to Koyeb

### Step 1: Prepare Your Code

1. Make sure all your code is committed to GitHub:
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

### Step 2: Create Koyeb Account

1. Go to [Koyeb](https://www.koyeb.com/)
2. Sign up for a free account
3. Verify your email

### Step 3: Deploy from GitHub

1. **Click "Create App"** in Koyeb dashboard

2. **Select Deployment Source**
   - Choose "GitHub"
   - Authorize Koyeb to access your repositories
   - Select your repository

3. **Configure Build Settings**
   - **Builder**: Dockerfile (Koyeb will auto-detect)
   - **Branch**: main
   - **Build command**: (leave empty, Dockerfile handles it)
   - **Run command**: (leave empty, Dockerfile handles it)

4. **Configure Service**
   - **Service name**: `premium-quiz-bot`
   - **Region**: Choose closest to your users
   - **Instance type**: Nano (free tier) or larger
   - **Scaling**: 1 instance minimum, 1 maximum
   - **Port**: 5000

5. **Add Environment Variables**
   Click "Environment variables" and add:
   ```
   BOT_TOKEN=your_telegram_bot_token_from_botfather
   SESSION_SECRET=generate_random_string_here
   NODE_ENV=production
   PORT=5000
   ```

   To generate a secure SESSION_SECRET:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

6. **Configure Health Checks** (Optional but recommended)
   - Path: `/`
   - Port: 5000
   - Initial delay: 10 seconds
   - Timeout: 5 seconds

7. **Click "Deploy"**

### Step 4: Get Your App URL

1. Wait for deployment to complete (2-5 minutes)
2. Copy your app URL: `https://your-app-name.koyeb.app`
3. Test it in your browser to make sure it loads

### Step 5: Configure Telegram Bot

Now connect the Mini App to your Telegram bot:

#### Option A: Using BotFather (Manual)

1. Open Telegram and message [@BotFather](https://t.me/BotFather)
2. Send `/mybots`
3. Select your bot
4. Select "Bot Settings"
5. Select "Menu Button"
6. Select "Configure Menu Button"
7. Enter button text: `📱 Open Quiz App`
8. Enter Mini App URL: `https://your-app-name.koyeb.app`

#### Option B: Using Bot API (Programmatic)

Add this to your Python bot code:

```python
from telegram import Update, MenuButtonWebApp, WebAppInfo
from telegram.ext import ContextTypes

async def setup_mini_app(context: ContextTypes.DEFAULT_TYPE):
    """Set up the Mini App menu button"""
    await context.bot.set_chat_menu_button(
        menu_button=MenuButtonWebApp(
            text="📱 Quiz Manager",
            web_app=WebAppInfo(url="https://your-app-name.koyeb.app")
        )
    )

# Call this when your bot starts
application.post_init = setup_mini_app
```

### Step 6: Test Your Mini App

1. Open your Telegram bot
2. Click the menu button (bottom-left, next to attach button)
3. Your Mini App should open in Telegram's WebView
4. Test all features:
   - Dashboard loads with stats
   - Create quiz works
   - Quizzes are saved
   - Dark mode toggle works

## 🔄 Updating Your Deployment

Koyeb automatically deploys when you push to GitHub:

```bash
# Make your changes
git add .
git commit -m "Update feature"
git push origin main
```

Koyeb will:
1. Detect the push
2. Pull the latest code
3. Build new Docker image
4. Deploy with zero downtime

## 📊 Monitoring Your App

### Koyeb Dashboard

- **Logs**: View real-time application logs
- **Metrics**: CPU, memory, network usage
- **Health**: Service uptime and health checks

### Accessing Logs

```bash
# Install Koyeb CLI
npm install -g @koyeb/cli

# Login
koyeb login

# View logs
koyeb service logs premium-quiz-bot
```

## 🐛 Troubleshooting

### App Not Loading

1. **Check Koyeb logs**
   - Go to your app in Koyeb dashboard
   - Click "Logs" tab
   - Look for errors

2. **Verify environment variables**
   - Make sure `BOT_TOKEN` is set correctly
   - Make sure `PORT` is 5000
   - Make sure `NODE_ENV` is production

3. **Check build status**
   - Go to "Deployments" tab
   - Make sure latest deployment succeeded

### Telegram Integration Not Working

1. **Verify Mini App URL**
   - Make sure you're using `https://` (not `http://`)
   - Make sure URL is exactly as shown in Koyeb
   - No trailing slash

2. **Check Bot Configuration**
   - Verify the menu button is set correctly in BotFather
   - Try removing and re-adding the menu button

3. **Test in Browser First**
   - Open your Mini App URL in a browser
   - Make sure it loads correctly
   - Then test in Telegram

### Performance Issues

1. **Upgrade instance size**
   - Nano (free) → Micro → Small
   - More memory = better performance

2. **Enable auto-scaling**
   - Set max instances to 2-3
   - Koyeb will scale based on traffic

## 💾 Adding Database Persistence

For production use, upgrade from in-memory storage to PostgreSQL:

### Step 1: Create PostgreSQL Database

Use Koyeb's database service or external provider:

**Koyeb Database:**
1. In Koyeb dashboard, go to "Databases"
2. Create new PostgreSQL database
3. Copy connection string

**External Providers:**
- [Neon](https://neon.tech) - Free PostgreSQL
- [Supabase](https://supabase.com) - Free tier available
- [ElephantSQL](https://www.elephantsql.com) - Free tier

### Step 2: Update Environment Variables

Add to Koyeb:
```
DATABASE_URL=postgresql://user:password@host:5432/dbname
```

### Step 3: Update Code

The app is already set up with Drizzle ORM. You just need to:

1. Update `server/storage.ts` to use the database
2. Run migrations: `npm run db:push`
3. Redeploy

## 🔒 Security Best Practices

1. **Never commit `.env` file**
   - Always use `.env.example` as template
   - Set actual values in Koyeb dashboard

2. **Use strong SESSION_SECRET**
   - Generate with: `openssl rand -hex 32`
   - Never reuse across projects

3. **Enable HTTPS only**
   - Koyeb provides this automatically
   - Telegram requires HTTPS for Mini Apps

4. **Validate Telegram data**
   - The app validates Telegram user IDs
   - Add additional validation as needed

## 📈 Scaling Your App

### Horizontal Scaling

```
Koyeb Dashboard → Your Service → Scaling
Set: Min instances: 1, Max instances: 3
```

### Vertical Scaling

Upgrade instance size based on usage:
- **Nano** (free): 0.1 vCPU, 512 MB RAM
- **Micro**: 0.5 vCPU, 1 GB RAM
- **Small**: 1 vCPU, 2 GB RAM
- **Medium**: 2 vCPU, 4 GB RAM

## 💰 Cost Estimation

**Free Tier (Nano):**
- 1 instance
- 512 MB RAM
- 100 GB bandwidth
- Perfect for testing and small user base

**Paid Plans:**
- ~$5-20/month for small to medium apps
- Scales based on usage
- Pay only for what you use

## 🆘 Getting Help

- **Koyeb Docs**: https://www.koyeb.com/docs
- **Koyeb Support**: support@koyeb.com
- **Community**: https://community.koyeb.com

---

**Congratulations!** 🎉 Your Premium Quiz Bot Mini App is now live and running on Koyeb!
