import React, { useState } from 'react';
import { Stethoscope, Pill, Home, ClipboardList, Brain, AlertTriangle, Sparkles } from 'lucide-react';

function App() {
  const [symptoms, setSymptoms] = useState('');
  const [apiKey, setApiKey] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-lg mb-4">
            <Sparkles className="w-8 h-8 text-blue-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            CÔNG CỤ HỖ TRỢ <br /> CHẨN ĐOÁN VÀ CẤP CỨU
          </h1>
          <p className="text-gray-600 text-lg">
            Sử dụng trí tuệ nhân tạo để lập kế hoạch, phân loại cấp cứu và chẩn đoán
          </p>
        </div>

        {/* Lý do đến trạm */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <label className="block text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <Stethoscope className="w-6 h-6 mr-3 text-blue-500" />
            Lý do đến trạm (Triệu chứng / Chấn thương)
          </label>
          <textarea
            className="w-full h-32 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-gray-700 placeholder-gray-400"
            placeholder="Ví dụ: Bệnh nhân bị sốt cao 39.5°C kèm đau đầu và nôn ói. Hoặc: Bị té xe, chấn thương cẳng chân phải, đang chảy máu."
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
          />
        </div>

        {/* API Key */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <label className="block text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <Brain className="w-6 h-6 mr-3 text-orange-500" />
            Gemini API Key (Bắt buộc khi triển khai ngoài)
          </label>
          <input
            type="password"
            className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-700 placeholder-gray-400"
            placeholder="Nhập API Key của bạn tại đây..."
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
        </div>

        {/* Canvas Area */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="border-2 border-dashed border-gray-300 rounded-xl h-40 flex items-center justify-center bg-gray-50">
            <p className="text-gray-500 text-center">
              🎨 Canvas tại đây...<br/>
              <span className="text-sm">(Khu vực vẽ hoặc hiển thị hình ảnh)</span>
            </p>
          </div>
        </div>

        {/* Action Buttons Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <button className="bg-blue-500 hover:bg-blue-600 text-white py-4 px-2 rounded-xl shadow-md transition-all duration-200 flex flex-col items-center justify-center">
            <ClipboardList className="w-8 h-8 mb-2" />
            <span className="font-semibold text-lg">HD Tại nhà</span>
          </button>
          <button className="bg-green-500 hover:bg-green-600 text-white py-4 px-2 rounded-xl shadow-md transition-all duration-200 flex flex-col items-center justify-center">
            <Pill className="w-8 h-8 mb-2" />
            <span className="font-semibold text-lg">Gợi ý Thuốc</span>
          </button>
          <button className="bg-purple-500 hover:bg-purple-600 text-white py-4 px-2 rounded-xl shadow-md transition-all duration-200 flex flex-col items-center justify-center">
            <Stethoscope className="w-8 h-8 mb-2" />
            <span className="font-semibold text-lg">Chẩn đoán PB</span>
          </button>
          <button className="bg-red-500 hover:bg-red-600 text-white py-4 px-2 rounded-xl shadow-md transition-all duration-200 flex flex-col items-center justify-center">
            <Home className="w-8 h-8 mb-2" />
            <span className="font-semibold text-lg">Lập KẾ HOẠCH</span>
          </button>
        </div>

        {/* Information Cards */}
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
            <h3 className="font-bold text-blue-800 text-xl mb-3 flex items-center">
              <AlertTriangle className="w-6 h-6 mr-3" />
              GỢI Ý CHẨN ĐOÁN PHÂN BIỆT
            </h3>
            <p className="text-blue-700">
              Nhấn nút "Chẩn đoán Phân biệt" để nhận gợi ý chẩn đoán dựa trên triệu chứng.
            </p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
            <h3 className="font-bold text-green-800 text-xl mb-3 flex items-center">
              <Pill className="w-6 h-6 mr-3" />
              GỢI Ý THUỐC ĐIỀU TRỊ VÀ CẢNH BÁO
            </h3>
            <p className="text-green-700">
              Nhấn nút "Gợi Ý Thuốc" để nhận thông tin về thuốc điều trị ban đầu và các cảnh báo liên quan.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500">
          <p>🚑 Ứng dụng hỗ trợ y tế - Phiên bản 1.0</p>
        </div>
      </div>
    </div>
  );
}

export default App;