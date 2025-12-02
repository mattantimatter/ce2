# Setting Up Your Atom Gen Application

## 1. Thesys API Key Setup

The Thesys API key is required to run this application. Here's how to set it up:

### Get Your API Key
1. Visit [https://docs.thesys.dev](https://docs.thesys.dev)
2. Sign up or log in to get your API key
3. Copy your API key

### Add API Key to Environment Variables

#### For Local Development:
Create a `.env.local` file in the project root:

```bash
# Thesys API Key
THESYS_API_KEY=your_actual_api_key_here

# Optional: Google API Keys (for image search and Gemini)
GOOGLE_API_KEY=your_google_api_key_here
GOOGLE_CX=your_google_custom_search_engine_id_here

# Optional: Weather API
WEATHER_API_KEY=your_weather_api_key_here
```

#### For Vercel Deployment:
1. Go to your Vercel project settings
2. Navigate to "Environment Variables"
3. Add the following variables:
   - Key: `THESYS_API_KEY`
   - Value: Your actual Thesys API key
   - Environment: Production, Preview, Development (select all)
4. Click "Save"
5. Redeploy your application

#### For Other Platforms:
Add `THESYS_API_KEY` as an environment variable in your platform's dashboard.

## 2. Features Implemented

### ✅ Light/Dark Mode
- Automatic theme switching based on system preferences
- Toggle manually in the app
- Separate backgrounds for light and dark modes

### ✅ Chat History
- Built-in C1Chat component includes sidebar functionality
- View and manage your conversation history
- Persistent across sessions (managed by C1Chat component)

### ✅ MCP Integration
- Filesystem operations (read, write, list files)
- Combined with existing tools (weather, image search)
- Extensible architecture for adding more MCP servers

## 3. Running the Application

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

## 4. Troubleshooting

### "API Key Missing" Error
- Make sure `.env.local` exists and contains `THESYS_API_KEY`
- Restart your development server after adding environment variables
- For production, verify the environment variable is set in your deployment platform

### Build Failures
- Ensure `pnpm-lock.yaml` is committed (required for Vercel)
- Check that all dependencies are installed with `pnpm install`
- Review build logs for specific errors

## 5. Documentation

- [Thesys C1 Documentation](https://docs.thesys.dev)
- [MCP Integration Guide](https://docs.thesys.dev/guides/integrate-data/mcp)
- [Example Repository](https://github.com/thesysdev/examples/tree/main/mcp-with-c1-chat)
