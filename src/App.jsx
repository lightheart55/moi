import React, { useState, useCallback } from 'react';
import { Stethoscope, Pill, Home, ClipboardList, Brain, AlertTriangle, Sparkles, Loader, Copy, Heart } from 'lucide-react';

// ==================== SYSTEM INSTRUCTIONS & SCHEMAS ====================

const SYSTEM_INSTRUCTION_PLAN = `
Bạn là Bác sĩ/Nhân viên y tế tại Trạm Y tế Xã/Phường. Nhiệm vụ của bạn là lập một KẾ HOẠCH SƠ CẤP CỨU NGẮN GỌN và CHÍNH XÁC dựa trên 'lý do đến trạm' của bệnh nhân.

Quy tắc Bắt buộc:
1. Văn phong: PHẢI sử dụng văn phong hành chính y tế, câu ngắn, mục rõ ràng, và thuật ngữ y tế chính xác (tiếng Việt).
2. Giả định mặc định: Nếu thiếu thông tin quan trọng (tuổi, tiền sử), bạn PHẢI GIẢ ĐỊNH MẶC ĐỊNH: 'Người lớn 18–65 tuổi, không mang thai, không suy gan/thận nặng.' và ghi rõ giả định này ở Mục 1.
3. Cấu trúc 7 Mục: PHẢI TUÂN THỦ TUYỆT ĐỐI cấu trúc 7 mục sau, bắt đầu bằng tiêu đề in đậm:

**KẾ HOẠCH SƠ CẤP CỨU NGẮN GỌN**

1) GIẢ ĐỊNH NGẮN (1 câu): Ghi các giả định bắt buộc nếu không có dữ liệu.
2) ĐÁNH GIÁ NHANH (ABC + sinh hiệu): Liệt kê các chỉ số phải đo/kiểm tra ngay: Đường thở (A), Thở (B), Tuần hoàn (C); HA, Mạch, Nhịp thở, SpO₂, Thân nhiệt, Đường máu mao mạch (Glucose).
3) XỬ TRÍ TẠI TRẠM (bước theo thứ tự, gạch đầu dòng):
   - Các can thiệp cấp cứu cần thực hiện ngay.
   - Nêu thuốc gợi ý (tên gốc) và đường dùng ngắn gọn (ví dụ: Paracetamol 500mg uống).
4) THEO DÕI (gồm chỉ số và tần suất): Những gì phải quan sát và khoảng thời gian theo dõi (ví dụ: Sinh hiệu 15 phút/lần).
5) RED FLAGS — CHUYỂN TUYẾN NGAY (liệt kê 4–6 dấu hiệu): Nếu có, hướng dẫn chuyển tuyến cấp cứu (Ví dụ: Rối loạn tri giác, HA thấp < 90/60 mmHg).
6) GHI CHO PHIẾU CHUYỂN (1–2 câu): Chẩn đoán sơ bộ; trạng thái khi chuyển (sinh hiệu); thuốc/đầu can thiệp đã cho; thời gian đề xuất chuyển; phương tiện đề xuất; người đi kèm.
7) CHỐNG CHỈ ĐỊNH / LƯU Ý NGẮN: Thuốc hoặc biện pháp cần tránh trong hoàn cảnh này.

Không hỏi thêm thông tin. Nếu cần thông tin quan trọng để thay đổi xử trí, chỉ liệt kê 2–3 thông tin cần bổ sung trong phần XỬ TRÍ TẠI TRẠM dưới dạng 'Cần bổ sung thông tin:'.
`;

const SYSTEM_INSTRUCTION_TRIAGE = `
Bạn là chuyên gia y tế khẩn cấp. Dựa trên lý do đến trạm, hãy đưa ra đánh giá nhanh về mức độ ưu tiên cấp cứu (Triage) và 3 hành động kiểm tra/can thiệp ưu tiên nhất.
Định dạng đầu ra PHẢI là JSON theo schema được cung cấp. Không thêm bất kỳ văn bản giải thích nào khác. Sử dụng thang phân loại Triage 5 cấp độ (ví dụ: Cấp 1 - Hồi sức, Cấp 5 - Không khẩn cấp).
`;

const TRIAGE_SCHEMA = {
    type: "OBJECT",
    properties: {
        triageLevel: { type: "STRING", description: "Mức độ cấp cứu (ví dụ: Cấp 1, Cấp 2, Cấp 3, Cấp 4, Cấp 5)" },
        priority: { type: "STRING", description: "Tên mức độ ưu tiên (ví dụ: Hồi sức, Cấp cứu, Khẩn cấp, Bán khẩn cấp, Không khẩn cấp)" },
        summary: { type: "STRING", description: "Tóm tắt ngắn 1 câu về tình trạng và mức độ nguy hiểm" },
        immediateActions: {
            type: "ARRAY",
            description: "3 hành động kiểm tra/can thiệp ưu tiên nhất cần thực hiện ngay",
            items: { type: "STRING" }
        }
    },
    propertyOrdering: ["triageLevel", "priority", "summary", "immediateActions"]
};

const SYSTEM_INSTRUCTION_HOME_CARE = `
Bạn là Nhân viên y tế/Bác sĩ tại Trạm Y tế Xã. Nhiệm vụ của bạn là soạn thảo một bản Hướng dẫn Chăm sóc Tại nhà ngắn gọn, rõ ràng, và dễ hiểu dành cho bệnh nhân hoặc người nhà.
Cấu trúc PHẢI bao gồm 4 mục chính (ghi bằng tiêu đề in đậm):
1.  **CÁCH SỬ DỤNG THUỐC ĐÃ CẤP** (Tên gốc, liều dùng, tần suất).
2.  **CHĂM SÓC KHÔNG DÙNG THUỐC** (Ví dụ: nghỉ ngơi, chườm lạnh, bù nước).
3.  **CHẾ ĐỘ ĂN UỐNG VÀ SINH HOẠT**.
4.  **DẤU HIỆU CẦN ĐƯA TRỞ LẠI TRẠM NGAY** (Liệt kê 3-4 dấu hiệu nguy hiểm).
Văn phong: Gần gũi, động viên, sử dụng ngôn ngữ phổ thông, không dùng thuật ngữ y tế chuyên sâu (ví dụ: thay "Hạ sốt bằng Paracetamol" thành "Uống thuốc hạ sốt (Paracetamol)").
`;

const SYSTEM_INSTRUCTION_DIFFERENTIAL = `
Bạn là một chuyên gia y tế chẩn đoán. Dựa trên 'lý do đến trạm' của bệnh nhân (triệu chứng/chấn thương), hãy tạo ra 3-4 chẩn đoán phân biệt có thể xảy ra nhất.
Định dạng đầu ra PHẢI là JSON theo schema được cung cấp. Không thêm bất kỳ văn bản giải thích nào khác.
`;

const DIFFERENTIAL_SCHEMA = {
    type: "OBJECT",
    properties: {
        differentialDiagnosis: {
            type: "ARRAY",
            description: "Danh sách các chẩn đoán phân biệt có thể xảy ra",
            items: {
                type: "OBJECT",
                properties: {
                    diagnosis: { type: "STRING", description: "Tên chẩn đoán (tiếng Việt)" },
                    likelihood: { type: "STRING", description: "Mức độ ưu tiên/khả năng (ví dụ: Rất cao, Trung bình, Thấp)" },
                    rationale: { type: "STRING", description: "Lý do ngắn gọn dựa trên triệu chứng" }
                },
                propertyOrdering: ["diagnosis", "likelihood", "rationale"]
            }
        }
    },
    propertyOrdering: ["differentialDiagnosis"]
};

const SYSTEM_INSTRUCTION_DRUG_ADVICE = `
Bạn là một chuyên gia dược lâm sàng. Dựa trên 'lý do đến trạm' (triệu chứng/chấn thương), hãy đưa ra gợi ý về thuốc điều trị ban đầu (First Line) và các cảnh báo/chống chỉ định quan trọng nhất.
Giả định mặc định: Người lớn 18–65 tuổi, không mang thai, không suy gan/thận nặng.
Định dạng đầu ra PHẢI là JSON theo schema được cung cấp. Không thêm bất kỳ văn bản giải thích nào khác.
`;

const DRUG_ADVICE_SCHEMA = {
    type: "OBJECT",
    properties: {
        firstLineDrug: {
            type: "OBJECT",
            properties: {
                name: { type: "STRING", description: "Tên thuốc gốc (ví dụ: Paracetamol)" },
                dosage: { type: "STRING", description: "Liều lượng và đường dùng khuyến nghị cho một lần dùng (ví dụ: 500mg uống)" },
                frequency: { type: "STRING", description: "Tần suất dùng khuyến nghị (ví dụ: Mỗi 4-6 giờ khi cần, tối đa 4g/ngày)" },
                indication: { type: "STRING", description: "Chỉ định chính cho tình trạng này" }
            },
            propertyOrdering: ["name", "dosage", "frequency", "indication"]
        },
        criticalWarnings: {
            type: "ARRAY",
            description: "3 Cảnh báo/Chống chỉ định quan trọng nhất liên quan đến thuốc này",
            items: { type: "STRING" }
        }
    },
    propertyOrdering: ["firstLineDrug", "criticalWarnings"]
};

// ==================== HELPER FUNCTIONS ====================

const fetchWithRetry = async (url, options, maxRetries = 3) => {
    let lastError = null;
    for (let i = 0; i < maxRetries; i++) {
        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                const errorBody = await response.text();
                throw new Error(`HTTP error! status: ${response.status}. Response: ${errorBody.substring(0, 100)}...`);
            }
            return response;
        } catch (error) {
            lastError = error;
            const delay = Math.pow(2, i) * 1000;
            if (i < maxRetries - 1) {
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }
    throw lastError;
};

// ==================== MAIN APP COMPONENT ====================

function App() {
    const [symptoms, setSymptoms] = useState('');
    const [apiKey, setApiKey] = useState(() => localStorage.getItem('geminiApiKey') || '');
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('');
    const [result, setResult] = useState('');
    const [error, setError] = useState('');

    const handleAPICall = useCallback(async (functionType) => {
        if (!symptoms.trim()) {
            setError('⚠️ Vui lòng nhập triệu chứng trước!');
            return;
        }
        
        if (!apiKey.trim()) {
            setError('⚠️ Vui lòng nhập API Key!');
            return;
        }

        setLoading(true);
        setActiveTab(functionType);
        setError('');
        setResult('');

        let systemInstruction, isJson = false, schema = null;

        switch(functionType) {
            case 'plan':
                systemInstruction = SYSTEM_INSTRUCTION_PLAN;
                break;
            case 'triage':
                systemInstruction = SYSTEM_INSTRUCTION_TRIAGE;
                isJson = true;
                schema = TRIAGE_SCHEMA;
                break;
            case 'homecare':
                systemInstruction = SYSTEM_INSTRUCTION_HOME_CARE;
                break;
            case 'differential':
                systemInstruction = SYSTEM_INSTRUCTION_DIFFERENTIAL;
                isJson = true;
                schema = DIFFERENTIAL_SCHEMA;
                break;
            case 'drugAdvice':
                systemInstruction = SYSTEM_INSTRUCTION_DRUG_ADVICE;
                isJson = true;
                schema = DRUG_ADVICE_SCHEMA;
                break;
            default:
                return;
        }

        try {
            const modelName = "gemini-1.5-flash";
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

            const userQuery = `Lý do đến trạm: "${symptoms.trim()}"`;

            let payload = {
                contents: [{ parts: [{ text: userQuery }] }],
                systemInstruction: { parts: [{ text: systemInstruction }] },
            };

            if (isJson) {
                payload.generationConfig = {
                    responseMimeType: "application/json",
                    responseSchema: schema
                };
            }

            const response = await fetchWithRetry(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await response.json();
            
            if (data.error) {
                throw new Error(data.error.message || 'Lỗi từ API Gemini');
            }

            const candidate = data.candidates?.[0];
            
            if (!candidate) {
                throw new Error('Không nhận được phản hồi từ AI');
            }

            if (candidate.finishReason !== 'STOP') {
                throw new Error(`AI kết thúc không bình thường: ${candidate.finishReason}`);
            }

            const responseText = candidate.content.parts[0].text;

            if (isJson) {
                try {
                    const parsedResult = JSON.parse(responseText);
                    setResult(JSON.stringify(parsedResult, null, 2));
                } catch (parseError) {
                    throw new Error('Lỗi phân tích kết quả JSON từ AI');
                }
            } else {
                setResult(responseText);
            }

        } catch (err) {
            console.error('API Error:', err);
            setError(`❌ Lỗi: ${err.message}`);
        } finally {
            setLoading(false);
        }
    }, [symptoms, apiKey]);

    const handleApiKeyChange = (e) => {
        const newKey = e.target.value;
        setApiKey(newKey);
        localStorage.setItem('geminiApiKey', newKey);
    };

    const copyToClipboard = () => {
        if (result) {
            navigator.clipboard.writeText(result);
            const message = document.createElement('div');
            message.textContent = '✅ Đã sao chép!';
            message.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
            document.body.appendChild(message);
            setTimeout(() => document.body.removeChild(message), 2000);
        }
    };

    const getButtonText = (type) => {
        if (loading && activeTab === type) {
            return 'Đang xử lý...';
        }
        switch(type) {
            case 'homecare': return 'HD Tại nhà';
            case 'drugAdvice': return 'Gợi ý Thuốc';
            case 'differential': return 'Chẩn đoán PB';
            case 'plan': return 'Lập KẾ HOẠCH';
            default: return '';
        }
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
                        disabled={loading}
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
                        onChange={handleApiKeyChange}
                        disabled={loading}
                    />
                </div>

                {/* Action Buttons Grid */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <button 
                        onClick={() => handleAPICall('homecare')}
                        disabled={loading}
                        className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white py-4 px-2 rounded-xl shadow-md transition-all duration-200 flex flex-col items-center justify-center"
                    >
                        <ClipboardList className="w-8 h-8 mb-2" />
                        <span className="font-semibold text-lg">{getButtonText('homecare')}</span>
                    </button>
                    <button 
                        onClick={() => handleAPICall('drugAdvice')}
                        disabled={loading}
                        className="bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white py-4 px-2 rounded-xl shadow-md transition-all duration-200 flex flex-col items-center justify-center"
                    >
                        <Pill className="w-8 h-8 mb-2" />
                        <span className="font-semibold text-lg">{getButtonText('drugAdvice')}</span>
                    </button>
                    <button 
                        onClick={() => handleAPICall('differential')}
                        disabled={loading}
                        className="bg-purple-500 hover:bg-purple-600 disabled:bg-purple-300 text-white py-4 px-2 rounded-xl shadow-md transition-all duration-200 flex flex-col items-center justify-center"
                    >
                        <Stethoscope className="w-8 h-8 mb-2" />
                        <span className="font-semibold text-lg">{getButtonText('differential')}</span>
                    </button>
                    <button 
                        onClick={() => handleAPICall('plan')}
                        disabled={loading}
                        className="bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white py-4 px-2 rounded-xl shadow-md transition-all duration-200 flex flex-col items-center justify-center"
                    >
                        <Home className="w-8 h-8 mb-2" />
                        <span className="font-semibold text-lg">{getButtonText('plan')}</span>
                    </button>
                </div>

                {/* Loading */}
                {loading && (
                    <div className="bg-white rounded-2xl shadow-lg p-8 mb-6 text-center">
                        <Loader className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
                        <p className="text-gray-600 text-lg">Đang phân tích với AI Gemini...</p>
                        <p className="text-gray-500 text-sm mt-2">Vui lòng chờ trong giây lát</p>
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-6">
                        <div className="flex items-center text-red-800 mb-2">
                            <AlertTriangle className="w-6 h-6 mr-3" />
                            <span className="font-semibold text-lg">Lỗi</span>
                        </div>
                        <p className="text-red-700">{error}</p>
                    </div>
                )}

                {/* Kết quả */}
                {result && !loading && (
                    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center">
                                {activeTab === 'plan' && <Home className="w-6 h-6 text-red-500 mr-3" />}
                                {activeTab === 'drugAdvice' && <Pill className="w-6 h-6 text-green-500 mr-3" />}
                                {activeTab === 'differential' && <Stethoscope className="w-6 h-6 text-purple-500 mr-3" />}
                                {activeTab === 'homecare' && <ClipboardList className="w-6 h-6 text-blue-500 mr-3" />}
                                <h3 className="text-xl font-bold text-gray-800">
                                    {activeTab === 'plan' && 'KẾ HOẠCH SƠ CẤP CỨU'}
                                    {activeTab === 'drugAdvice' && 'GỢI Ý THUỐC ĐIỀU TRỊ'}
                                    {activeTab === 'differential' && 'CHẨN ĐOÁN PHÂN BIỆT'}
                                    {activeTab === 'homecare' && 'HƯỚNG DẪN CHĂM SÓC TẠI NHÀ'}
                                </h3>
                            </div>
                            <button
                                onClick={copyToClipboard}
                                className="flex items-center text-blue-500 hover:text-blue-700 transition-colors"
                            >
                                <Copy className="w-5 h-5 mr-1" />
                                Sao chép
                            </button>
                        </div>
                        <div className="text-gray-700 whitespace-pre-line bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto font-mono text-sm">
                            {result}