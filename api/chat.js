const Anthropic = require('@anthropic-ai/sdk');
const CAMPAIGN_CONTEXT = require('../data/campaign_context');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey || apiKey === 'your-api-key-here') {
    return res.status(500).json({ error: 'API key not configured. Add ANTHROPIC_API_KEY to your .env file.' });
  }

  const { messages } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Messages array required' });
  }

  try {
    const client = new Anthropic({ apiKey });

    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: CAMPAIGN_CONTEXT,
      messages: messages.map(m => ({
        role: m.role,
        content: m.content,
      })),
    });

    const text = response.content
      .filter(block => block.type === 'text')
      .map(block => block.text)
      .join('');

    return res.status(200).json({ response: text });
  } catch (err) {
    console.error('Claude API error:', err.message);
    return res.status(500).json({ error: 'Failed to get response from Claude: ' + err.message });
  }
};
