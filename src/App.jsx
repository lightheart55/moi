import React, { useState } from 'react';
import { Stethoscope, Pill, Home, ClipboardList, Brain, AlertTriangle } from 'lucide-react';

function App() {
  const [symptoms, setSymptoms] = useState('');
  const [apiKey, setApiKey] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 py-4 px-3">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            CÔNG CỤ HỖ TRỢ CHẨN ĐOÁN VÀ CẤP CỨU TRẠM Y TẾ
          </h1>
          <p className="text-gray-600 mt-2 text-sm md:text-base">
            Sử dụng trí tuệ nhân tạo để lập kế hoạch, phân loại cấp cứu và chẩn đoán
          </p>
        </div>

        {/* Lý do đến trạm */}
        <div className="bg-white rounded-2xl shadow-md p-5 mb-4 border border-blue-100">
          <label className="block text-lg font-semibold text-gray-800 mb-3 flex items-center">
            <Stethoscope className="w-5 h-5 mr-2 text-blue-500" />
            Lý do đến trạm (Triệu chứng / Chấn thương)
          </label>
          <textarea
            className="w-full h-28 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-gray-700"
            placeholder="Ví dụ: Bệnh nhân bị sốt cao 39.5°C kèm đau đầu và nôn ói. Hoặc: Bị té xe, chấn thương cẳng chân phải, đang chảy máu."
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
          />
        </div>

        {/* API Key */}
        <div className="bg-white rounded-2xl shadow-md p-5 mb-4 border border-orange-100">
          <label className="block text-lg font-semibold text-gray-800 mb-3 flex items-center">
            <Brain className="w-5 h-5 mr-2 text-orange-500" />
            Gemini API Key (Bắt buộc khi triển khai ngoài)
          </label>
          <input
            type="password"
            className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-700"
            placeholder="Nhập API Key của bạn tại đây..."
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
        </div>

        {/* Canvas Area */}
        <div className="bg-white rounded-2xl shadow-md p-5 mb-4 border border-purple-100">
          <div className="border-2 border-dashed border-gray-300 rounded-xl h-40 flex items-center justify-center bg-gray-50">
            <p className="text-gray-500 text-center">
              🎨 Canvas tại đây...<br/>
              <span className="text-sm">(Khu vực vẽ hoặc hiển thị hình ảnh)</span>
            </p>
          </div>
        </div>

        {/* Action Buttons Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-4 rounded-xl shadow-md transition-all duration-200 transform hover:scale-105 flex flex-col items-center">
            <ClipboardList className="w-6 h-6 mb-1" />
            <span className="font-semibold">HD Tại nhà</span>
          </button>
          <button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-4 rounded-xl shadow-md transition-all duration-200 transform hover:scale-105 flex flex-col items-center">
            <Pill className="w-6 h-6 mb-1" />
            <span className="font-semibold">Gợi ý Thuốc</span>
          </button>
          <button className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white py-4 rounded-xl shadow-md transition-all duration-200 transform hover:scale-105 flex flex-col items-center">
            <Stethoscope className="w-6 h-6 mb-1" />
            <span className="font-semibold">Chẩn đoán PB</span>
          </button>
          <button className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-4 rounded-xl shadow-md transition-all duration-200 transform hover:scale-105 flex flex-col items-center">
            <Home className="w-6 h-6 mb-1" />
            <span className="font-semibold">Lập KẾ HOẠCH</span>
          </button>
        </div>

        {/* Information Cards */}
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-2xl p-4 shadow-sm">
            <h3 className="font-bold text-blue-800 text-lg mb-2 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              GỢI Ý CHẨN ĐOÁN PHÂN BIỆT
            </h3>
            <p className="text-blue-700 text-sm">
              Nhấn nút "Chẩn đoán Phân biệt" để nhận gợi ý chẩn đoán dựa trên triệu chứng.
            </p>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-4 shadow-sm">
            <h3 className="font-bold text-green-800 text-lg mb-2 flex items-center">
              <Pill className="w-5 h-5 mr-2" />
              GỢI Ý THUỐC ĐIỀU TRỊ VÀ CẢNH BÁO
            </h3>
            <p className="text-green-700 text-sm">
              Nhấn nút "Gợi ý Thuốc" để nhận thông tin về thuốc điều trị ban đầu và các cảnh báo liên quan.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-gray-500 text-sm">
          <p>🚑 Ứng dụng hỗ trợ y tế - Phiên bản 1.0</p>
        </div>
      </div>
    </div>
  );
}

export default App;