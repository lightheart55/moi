import React, { useState } from 'react';
import { Stethoscope, Pill, Home, ClipboardList, Brain, AlertTriangle, Sparkles } from 'lucide-react';

function App() {
  const [symptoms, setSymptoms] = useState('');
  const [apiKey, setApiKey] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-100 py-6 px-4">
      <div className="max-w-2xl mx-auto">
        
        {/* Header với hiệu ứng đẹp */}
        <div className="text-center mb-8 bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20">
          <div className="flex justify-center items-center mb-3">
            <Sparkles className="w-8 h-8 text-blue-500 mr-3" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              CÔNG CỤ HỖ TRỢ CHẨN ĐOÁN VÀ CẤP CỨU
            </h1>
          </div>
          <p className="text-gray-600 text-lg font-medium">
            Sử dụng trí tuệ nhân tạo để lập kế hoạch, phân loại cấp cứu và chẩn đoán
          </p>
        </div>

        {/* Lý do đến trạm */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border border-blue-100/50 backdrop-blur-sm">
          <label className="block text-xl font-bold text-gray-800 mb-4 flex items-center">
            <Stethoscope className="w-6 h-6 mr-3 text-blue-500" />
            Lý do đến trạm (Triệu chứng / Chấn thương)
          </label>
          <textarea
            className="w-full h-32 p-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-400 resize-none text-gray-700 placeholder-gray-400 text-lg transition-all duration-300 bg-gray-50/50"
            placeholder="Ví dụ: Bệnh nhân bị sốt cao 39.5°C kèm đau đầu và nôn ói. Hoặc: Bị té xe, chấn thương cẳng chân phải, đang chảy máu."
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
          />
        </div>

        {/* API Key */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border border-orange-100/50 backdrop-blur-sm">
          <label className="block text-xl font-bold text-gray-800 mb-4 flex items-center">
            <Brain className="w-6 h-6 mr-3 text-orange-500" />
            Gemini API Key (Bắt buộc khi triển khai ngoài)
          </label>
          <input
            type="password"
            className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-orange-200 focus:border-orange-400 text-gray-700 placeholder-gray-400 text-lg transition-all duration-300 bg-gray-50/50"
            placeholder="Nhập API Key của bạn tại đây..."
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
        </div>

        {/* Canvas Area */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border border-purple-100/50 backdrop-blur-sm">
          <div className="border-2 border-dashed border-gray-300 rounded-2xl h-40 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 transition-all duration-300 hover:border-purple-300">
            <p className="text-gray-500 text-center text-lg">
              🎨 <span className="font-semibold">Canvas tại đây...</span><br/>
              <span className="text-sm">(Khu vực vẽ hoặc hiển thị hình ảnh)</span>
            </p>
          </div>
        </div>

        {/* Action Buttons Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <button className="bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-5 px-2 rounded-2xl shadow-xl transition-all duration-300 transform hover:scale-105 flex flex-col items-center justify-center border border-blue-400/20">
            <ClipboardList className="w-8 h-8 mb-2" />
            <span className="font-bold text-lg">HD Tại nhà</span>
          </button>
          <button className="bg-gradient-to-br from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white py-5 px-2 rounded-2xl shadow-xl transition-all duration-300 transform hover:scale-105 flex flex-col items-center justify-center border border-emerald-400/20">
            <Pill className="w-8 h-8 mb-2" />
            <span className="font-bold text-lg">Gợi ý Thuốc</span>
          </button>
          <button className="bg-gradient-to-br from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700 text-white py-5 px-2 rounded-2xl shadow-xl transition-all duration-300 transform hover:scale-105 flex flex-col items-center justify-center border border-violet-400/20">
            <Stethoscope className="w-8 h-8 mb-2" />
            <span className="font-bold text-lg">Chẩn đoán PB</span>
          </button>
          <button className="bg-gradient-to-br from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white py-5 px-2 rounded-2xl shadow-xl transition-all duration-300 transform hover:scale-105 flex flex-col items-center justify-center border border-rose-400/20">
            <Home className="w-8 h-8 mb-2" />
            <span className="font-bold text-lg">Lập KẾ HOẠCH</span>
          </button>
        </div>

        {/* Information Cards */}
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-200/50 rounded-2xl p-6 shadow-lg backdrop-blur-sm">
            <h3 className="font-bold text-blue-800 text-xl mb-3 flex items-center">
              <AlertTriangle className="w-6 h-6 mr-3" />
              GỢI Ý CHẨN ĐOÁN PHÂN BIỆT
            </h3>
            <p className="text-blue-700 text-base leading-relaxed">
              Nhấn nút <span className="font-semibold">"Chẩn đoán Phân biệt"</span> để nhận gợi ý chẩn đoán dựa trên triệu chứng.
            </p>
          </div>

          <div className="bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-200/50 rounded-2xl p-6 shadow-lg backdrop-blur-sm">
            <h3 className="font-bold text-emerald-800 text-xl mb-3 flex items-center">
              <Pill className="w-6 h-6 mr-3" />
              GỢI Ý THUỐC ĐIỀU TRỊ VÀ CẢNH BÁO
            </h3>
            <p className="text-emerald-700 text-base leading-relaxed">
              Nhấn nút <span className="font-semibold">"Gợi ý Thuốc"</span> để nhận thông tin về thuốc điều trị ban đầu và các cảnh báo liên quan.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 text-base bg-white/60 backdrop-blur-sm rounded-2xl p-4 shadow-inner">
          <p className="font-medium">🚑 Ứng dụng hỗ trợ y tế - Phiên bản 1.0</p>
        </div>
      </div>
    </div>
  );
}

export default App;