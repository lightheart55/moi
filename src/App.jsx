import React, { useState } from 'react';
import { Stethoscope, Pill, Home, ClipboardList, Brain, AlertTriangle, Sparkles, Loader } from 'lucide-react';

function App() {
  const [symptoms, setSymptoms] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [activeTab, setActiveTab] = useState('');

  // Mock functions - thay bằng API call thật sau
  const handleFunctionCall = async (functionName) => {
    if (!symptoms.trim()) {
      setResult('⚠️ Vui lòng nhập triệu chứng trước!');
      return;
    }
    
    if (!apiKey.trim()) {
      setResult('⚠️ Vui lòng nhập API Key!');
      return;
    }

    setLoading(true);
    setActiveTab(functionName);
    
    // Giả lập API call
    setTimeout(() => {
      const responses = {
        'diagnosis': `🔍 CHẨN ĐOÁN PHÂN BIỆT:\n\nDựa trên triệu chứng "${symptoms}", có thể:\n1. Nhiễm virus đường hô hấp\n2. Sốt xuất huyết\n3. COVID-19\n\n→ Cần đo nhiệt độ, xét nghiệm máu.`,
        'medicine': `💊 GỢI Ý THUỐC:\n\n- Hạ sốt: Paracetamol 500mg\n- Giảm đau: Ibuprofen\n- Bù nước: Oresol\n\n⚠️ CẢNH BÁO: Tư vấn bác sĩ trước khi dùng!`,
        'home': `🏠 HƯỚNG DẪN TẠI NHÀ:\n\n1. Nghỉ ngơi, uống nhiều nước\n2. Theo dõi nhiệt độ 4h/lần\n3. Đến bệnh viện nếu sốt > 39°C`,
        'plan': `📋 KẾ HOẠCH CẤP CỨU:\n\n1. Đánh giá ABC (Airway, Breathing, Circulation)\n2. Đo dấu hiệu sinh tồn\n3. Phân loại mức độ ưu tiên`
      };
      
      setResult(responses[functionName]);
      setLoading(false);
    }, 1500);
  };

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

        {/* Action Buttons Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <button 
            onClick={() => handleFunctionCall('home')}
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white py-4 px-2 rounded-xl shadow-md transition-all duration-200 flex flex-col items-center justify-center"
          >
            <ClipboardList className="w-8 h-8 mb-2" />
            <span className="font-semibold text-lg">HD Tại nhà</span>
          </button>
          <button 
            onClick={() => handleFunctionCall('medicine')}
            disabled={loading}
            className="bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white py-4 px-2 rounded-xl shadow-md transition-all duration-200 flex flex-col items-center justify-center"
          >
            <Pill className="w-8 h-8 mb-2" />
            <span className="font-semibold text-lg">Gợi ý Thuốc</span>
          </button>
          <button 
            onClick={() => handleFunctionCall('diagnosis')}
            disabled={loading}
            className="bg-purple-500 hover:bg-purple-600 disabled:bg-purple-300 text-white py-4 px-2 rounded-xl shadow-md transition-all duration-200 flex flex-col items-center justify-center"
          >
            <Stethoscope className="w-8 h-8 mb-2" />
            <span className="font-semibold text-lg">Chẩn đoán PB</span>
          </button>
          <button 
            onClick={() => handleFunctionCall('plan')}
            disabled={loading}
            className="bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white py-4 px-2 rounded-xl shadow-md transition-all duration-200 flex flex-col items-center justify-center"
          >
            <Home className="w-8 h-8 mb-2" />
            <span className="font-semibold text-lg">Lập KẾ HOẠCH</span>
          </button>
        </div>

        {/* Kết quả hiển thị */}
        {loading && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-6 text-center">
            <Loader className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
            <p className="text-gray-600 text-lg">Đang xử lý với AI...</p>
          </div>
        )}

        {result && !loading && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex items-center mb-4">
              {activeTab === 'diagnosis' && <AlertTriangle className="w-6 h-6 text-purple-500 mr-3" />}
              {activeTab === 'medicine' && <Pill className="w-6 h-6 text-green-500 mr-3" />}
              {activeTab === 'home' && <ClipboardList className="w-6 h-6 text-blue-500 mr-3" />}
              {activeTab === 'plan' && <Home className="w-6 h-6 text-red-500 mr-3" />}
              <h3 className="text-xl font-bold text-gray-800">
                {activeTab === 'diagnosis' && 'CHẨN ĐOÁN PHÂN BIỆT'}
                {activeTab === 'medicine' && 'GỢI Ý THUỐC'}
                {activeTab === 'home' && 'HƯỚNG DẪN TẠI NHÀ'}
                {activeTab === 'plan' && 'KẾ HOẠCH CẤP CỨU'}
              </h3>
            </div>
            <div className="text-gray-700 whitespace-pre-line bg-gray-50 p-4 rounded-lg">
              {result}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500">
          <p>🚑 Ứng dụng hỗ trợ y tế - Phiên bản 1.0</p>
        </div>
      </div>
    </div>
  );
}

export default App;
