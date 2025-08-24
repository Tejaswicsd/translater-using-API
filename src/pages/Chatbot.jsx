import React, { useState } from 'react';

function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userMessage = input;
    setMessages([...messages, `🧑: ${userMessage}`]);
    setInput('');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a helpful Spanish tutor.' },
          { role: 'user', content: userMessage },
        ],
      }),
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || 'No reply';
    setMessages((prev) => [...prev, `🤖: ${reply}`]);
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">AI Chatbot</h2>
      <div className="space-y-2 mb-4">
        {messages.map((msg, i) => (
          <p key={i} className="bg-gray-100 p-2 rounded">{msg}</p>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type in Spanish..." className="border p-2 flex-1" />
        <button type="submit" className="bg-blue-500 text-white px-4">Send</button>
      </form>
    </div>
  );
}

export default Chatbot;