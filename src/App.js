import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [message, setMessage] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    setResult('');

    try {
      const response = await axios.post('/api/chat', { message });
      setResult(response.data.reply);
    } catch (error) {
      console.error('Error:', error);
      setResult('Lỗi kết nối đến server. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">AI Chat Assistant</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit} className="mb-6">
            <div className="flex gap-4">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Nhập câu hỏi..."
                className="flex-1 px-4 py-2 border rounded-lg"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !message.trim()}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
              >
                {loading ? 'Đang xử lý...' : 'Gửi'}
              </button>
            </div>
          </form>

          {result && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-gray-700 whitespace-pre-line">
                {result}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
