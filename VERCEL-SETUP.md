# 🚨 URGENT: Vercel Environment Variable Setup

## Your messages aren't working because the API key is missing!

### Step-by-Step Fix:

1. **Go to your Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Click on your project: `ce2` or `ce2-1`

2. **Navigate to Settings**
   - Click on the "Settings" tab at the top

3. **Go to Environment Variables**
   - Click on "Environment Variables" in the left sidebar

4. **Add the Thesys API Key**
   - Click "Add New"
   - **Name/Key:** `THESYS_API_KEY`
   - **Value:** Your actual API key from https://docs.thesys.dev
   - **Environment:** Select ALL (Production, Preview, Development)
   - Click "Save"

5. **Get Your API Key** (if you don't have it)
   - Visit: https://docs.thesys.dev
   - Sign up or log in
   - Copy your API key

6. **Redeploy Your App**
   - Go to "Deployments" tab
   - Click the three dots (...) on the latest deployment
   - Click "Redeploy"
   - OR just push a new commit to trigger automatic deployment

### Expected Result After Adding API Key:

✅ Messages will send and receive responses
✅ AI will respond to your prompts
✅ All tools (weather, images, web search) will work
✅ MCP filesystem operations will function

### Verify It's Working:

After redeployment, try:
1. Type "hello" in the chat
2. You should see the AI respond
3. Try one of the sample prompts (stocks, travel, etc.)

### Additional Optional Variables:

If you want to use image search and weather features, add these too:

- `GOOGLE_API_KEY` - For image search
- `GOOGLE_CX` - Google Custom Search Engine ID
- `WEATHER_API_KEY` - For weather information

### Still Not Working?

Check the Vercel deployment logs:
1. Go to your project in Vercel
2. Click on the failing deployment
3. Click "View Function Logs"
4. Look for API key errors

---

## Current Features After Fix:

✅ **Theme Toggle** - Click sun/moon icon in top-left to switch light/dark
✅ **Chat History** - Sidebar shows previous conversations
✅ **MCP Integration** - Filesystem operations enabled
✅ **Sample Prompts** - Click any prompt card to start
✅ **Artifacts** - Generate slides and reports


