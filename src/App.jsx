import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI Chat Assistant
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Nhập câu hỏi của bạn và nhận phản hồi thông minh từ AI
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
          {/* Input Form */}
          <form onSubmit={handleSubmit} className="mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Nhập câu hỏi của bạn tại đây..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                  disabled={loading}
                />
              </div>
              <button
                type="submit"
                disabled={loading || !message.trim()}
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 whitespace-nowrap"
              >
                {loading ? 'Đang xử lý...' : 'Gửi tin nhắn'}
              </button>
            </div>
          </form>

          {/* Result Display */}
          {result && (
            <div className="border-t pt-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Phản hồi:
                </h3>
              </div>
              <div className="text-gray-700 whitespace-pre-line bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto font-mono text-sm">
                {result}
              </div>
            </div>
          )}

          {/* Loading Indicator */}
          {loading && (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          )}

          {/* Instructions */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">
              Hướng dẫn sử dụng:
            </h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Nhập câu hỏi vào ô trống và nhấn "Gửi tin nhắn"</li>
              <li>• Chờ AI xử lý và trả về kết quả</li>
              <li>• Có thể hỏi tiếp dựa trên kết quả nhận được</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>Powered by AI Technology</p>
        </div>
      </div>
    </div>
  );
}

export default App;