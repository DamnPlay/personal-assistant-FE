const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'
const API_KEY = import.meta.env.VITE_API_KEY ?? ''

/**
 * Send a message to the backend assistant API.
 * Expects the backend to expose POST /chat with body { message, history }.
 * Returns the assistant's reply as a string.
 *
 * Replace the stub below with your actual backend integration.
 */
export async function sendMessage(message, history = []) {
  // --- STUB: remove when backend is ready ---
  if (!API_URL || API_URL === 'http://localhost:8000') {
    await new Promise((r) => setTimeout(r, 800 + Math.random() * 600))
    return simulateReply(message)
  }
  // ------------------------------------------

  const headers = {
    'Content-Type': 'application/json',
    ...(API_KEY ? { Authorization: `Bearer ${API_KEY}` } : {}),
  }

  const res = await fetch(`${API_URL}/chat`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      message,
      history: history.map((m) => ({ role: m.role, content: m.content })),
    }),
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`API error ${res.status}: ${body}`)
  }

  const data = await res.json()
  return data.reply ?? data.message ?? data.content ?? JSON.stringify(data)
}

const STUBS = [
  "I'm your personal assistant! Connect me to a backend to get real answers.",
  "That's a great question. Once you wire up `VITE_API_URL`, I'll give you a proper response.",
  "I'm running in demo mode right now. Set your API URL in `.env.local` to go live.",
  "Interesting! I can help with tasks, questions, and more once the backend is connected.",
  "I'm here to help! Point me at your backend API and I'll start giving real answers.",
]

let stubIdx = 0
function simulateReply(msg) {
  const lower = msg.toLowerCase()
  if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
    return "Hello! 👋 I'm your personal assistant. How can I help you today?"
  }
  if (lower.includes('help')) {
    return "I can help you with tasks, answer questions, and more.\n\nTo connect me to a real AI backend, set `VITE_API_URL` in your `.env.local` file."
  }
  const reply = STUBS[stubIdx % STUBS.length]
  stubIdx++
  return reply
}
