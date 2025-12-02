# 🤖 Thesys Model Selection Guide

## Current Model Configuration

Your app is currently using: **`c1/openai/gpt-5/v-20250930`**

This is configured in: [`src/app/api/chat/route.ts`](src/app/api/chat/route.ts) on line 62.

## Available Thesys Models

Thesys provides access to various AI models through their C1 platform:

### OpenAI Models
- `c1/openai/gpt-5/v-20250930` - GPT-5 (Latest) ✅ **Currently Using**
- `c1/openai/gpt-4-turbo` - GPT-4 Turbo
- `c1/openai/gpt-4` - GPT-4
- `c1/openai/gpt-3.5-turbo` - GPT-3.5 Turbo

### Anthropic Models
- `c1/anthropic/claude-sonnet-4/v-20250617` - Claude Sonnet 4 (Latest)
- `c1/anthropic/claude-3-5-sonnet` - Claude 3.5 Sonnet
- `c1/anthropic/claude-3-opus` - Claude 3 Opus
- `c1/anthropic/claude-3-sonnet` - Claude 3 Sonnet
- `c1/anthropic/claude-3-haiku` - Claude 3 Haiku

### Other Models
- Check [Thesys Documentation](https://docs.thesys.dev) for the full list of available models

## How to Change the Model

### Step 1: Open the Route File
Edit: `src/app/api/chat/route.ts`

### Step 2: Find the Model Configuration
Look for line ~62 where you see:

```typescript
const llmStream = await client.beta.chat.completions.runTools({
  model: `c1/openai/gpt-5/v-20250930`,  // ← Change this line
  temperature: 1 as unknown as number,
  // ...
});
```

### Step 3: Replace with Your Desired Model
For example, to use Claude Sonnet 4:

```typescript
model: `c1/anthropic/claude-sonnet-4/v-20250617`,
```

Or for Claude 3.5 Sonnet:

```typescript
model: `c1/anthropic/claude-3-5-sonnet`,
```

Or for GPT-4 Turbo:

```typescript
model: `c1/openai/gpt-4-turbo`,
```

### Step 4: Commit and Deploy

```bash
git add src/app/api/chat/route.ts
git commit -m "Change model to [MODEL_NAME]"
git push origin main
```

## Model Comparison

### GPT-5 (Current)
- ✅ Best for general tasks
- ✅ Fast response times
- ✅ Good at following instructions
- ✅ Excellent with tools/functions

### Claude Sonnet 4
- ✅ Excellent for complex reasoning
- ✅ Better at long-form content
- ✅ Strong analytical capabilities
- ✅ Very good with code generation

### Claude 3.5 Sonnet
- ✅ Balanced performance
- ✅ Good at creative tasks
- ✅ Reliable and consistent
- ⚡ Slightly slower than GPT-4 Turbo

### GPT-4 Turbo
- ✅ Fast and efficient
- ✅ Good for most tasks
- ✅ Lower cost
- ⚡ Less capable than GPT-5

## Testing Different Models

To test different models without deployment:

1. Run locally: `pnpm dev`
2. Change the model in `route.ts`
3. Restart the dev server
4. Test with various prompts
5. Compare responses

## Cost Considerations

Different models have different costs per token:
- Check [Thesys Pricing](https://docs.thesys.dev/pricing) for current rates
- More capable models (GPT-5, Claude Sonnet 4) cost more
- Consider your usage patterns and budget

## Recommended Models by Use Case

### For General Chat & Questions
- **GPT-5** (current) ✅
- Claude 3.5 Sonnet

### For Code Generation
- **Claude Sonnet 4**
- GPT-5

### For Creative Writing
- **Claude Sonnet 4**
- Claude 3.5 Sonnet

### For Fast Responses (Cost-Effective)
- **GPT-4 Turbo**
- GPT-3.5 Turbo

### For Complex Reasoning & Analysis
- **Claude Sonnet 4**
- GPT-5

## Model Features Matrix

| Feature | GPT-5 | Claude Sonnet 4 | Claude 3.5 | GPT-4 Turbo |
|---------|-------|----------------|------------|-------------|
| Speed | ⚡⚡⚡ | ⚡⚡ | ⚡⚡ | ⚡⚡⚡ |
| Reasoning | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| Code Gen | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| Creativity | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| Cost | $$$ | $$$$ | $$$ | $$ |

## Need Help?

- 📚 [Thesys Docs](https://docs.thesys.dev)
- 💬 [Thesys Discord](https://discord.gg/thesys)
- 🐛 Report issues in your repository

---

**Current Configuration:**
- Model: `c1/openai/gpt-5/v-20250930`
- Location: `src/app/api/chat/route.ts` (line 62)
- Temperature: 1
- Streaming: Enabled
- Tools: Weather, Image Search, Web Search, MCP Filesystem

