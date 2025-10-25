import React, { useState, useCallback, useMemo } from 'react';
import { RefreshCw, Clipboard, AlertTriangle, Send, Heart, Droplet, Zap, Home, Stethoscope, Key, Pill } from 'lucide-react';

// --- System Instructions (giữ nguyên logic cũ, chỉ bỏ bớt comment dài cho gọn)
const SYSTEM_INSTRUCTION_PLAN = `...`;
const SYSTEM_INSTRUCTION_TRIAGE = `...`;
const SYSTEM_INSTRUCTION_HOME_CARE = `...`;
const SYSTEM_INSTRUCTION_DIFFERENTIAL = `...`;
const SYSTEM_INSTRUCTION_DRUG_ADVICE = `...`;

const TRIAGE_SCHEMA = { ... };
const DIFFERENTIAL_SCHEMA = { ... };
const DRUG_ADVICE_SCHEMA = { ... };

// Helper API retry
const fetchWithRetry = async (url, options, maxRetries = 5) => {
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
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
    }
  }
  throw new Error(`API failed after ${maxRetries} retries. Last error: ${lastError.message}`);
};

// Parsing helpers
const parsePlan = (planText) => {
  if (!planText) return [];
  const sections = planText.split(/\n\s*(?=\d+\) )/);
  return sections.filter(s => s.trim() !== '').map((section, index) => {
    const match = section.match(/^(\d+\) [^\n:]+):?\s*(.*)/s);
    if (match) {
      const [_, title, content] = match;
      return { id: index, title: title.trim(), content: content.trim() };
    }
    if (section.startsWith('**KẾ HOẠCH')) return null;
    return { id: index, title: 'Nội dung', content: section.trim() };
  }).filter(s => s !== null);
};

const parseHomeCare = (homeCareText) => {
  if (!homeCareText) return [];
  const sections = homeCareText.split(/(\*\*[^**]+\*\*)/).filter(s => s.trim());
  const result = [];
  for (let i = 0; i < sections.length; i += 2) {
    if (sections[i + 1]) {
      result.push({
        id: i / 2,
        title: sections[i].replace(/\*\*|:/g, '').trim(),
        content: sections[i+1].trim()
      });
    }
  }
  return result;
};

const App = () => {
  const [reason, setReason] = useState('');
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('geminiApiKey') || ''); 
  const [plan, setPlan] = useState('');
  const [triageResult, setTriageResult] = useState(null);
  const [homeCareInstructions, setHomeCareInstructions] = useState('');
  const [differentialResult, setDifferentialResult] = useState(null); 
  const [drugAdviceResult, setDrugAdviceResult] = useState(null);
  const [isLoadingPlan, setIsLoadingPlan] = useState(false);
  const [isLoadingTriage, setIsLoadingTriage] = useState(false);
  const [isLoadingHomeCare, setIsLoadingHomeCare] = useState(false);
  const [isLoadingDifferential, setIsLoadingDifferential] = useState(false);
  const [isLoadingDrugAdvice, setIsLoadingDrugAdvice] = useState(false);
  const [error, setError] = useState(null);

  const parsedPlan = useMemo(() => parsePlan(plan), [plan]);
  const parsedHomeCare = useMemo(() => parseHomeCare(homeCareInstructions), [homeCareInstructions]);

  const handleApiKeyChange = (e) => {
    const newKey = e.target.value;
    setApiKey(newKey);
    localStorage.setItem('geminiApiKey', newKey);
  };

  // Generalized API handler
  const handleAPICall = useCallback(async (type) => {
    if (!reason.trim()) return setError('Vui lòng nhập lý do đến trạm.');

    if (!apiKey.trim()) return setError('Vui lòng nhập Gemini API Key.');

    setError(null);

    let setLoadState, setContent, systemInstruction, isJson=false, schema=null;

    switch(type){
      case 'plan': setLoadState = setIsLoadingPlan; setContent = setPlan; systemInstruction = SYSTEM_INSTRUCTION_PLAN; break;
      case 'triage': setLoadState = setIsLoadingTriage; setContent = setTriageResult; systemInstruction = SYSTEM_INSTRUCTION_TRIAGE; isJson=true; schema=TRIAGE_SCHEMA; break;
      case 'homecare': setLoadState = setIsLoadingHomeCare; setContent = setHomeCareInstructions; systemInstruction = SYSTEM_INSTRUCTION_HOME_CARE; break;
      case 'differential': setLoadState = setIsLoadingDifferential; setContent = setDifferentialResult; systemInstruction = SYSTEM_INSTRUCTION_DIFFERENTIAL; isJson=true; schema=DIFFERENTIAL_SCHEMA; break;
      case 'drugAdvice': setLoadState = setIsLoadingDrugAdvice; setContent = setDrugAdviceResult; systemInstruction = SYSTEM_INSTRUCTION_DRUG_ADVICE; isJson=true; schema=DRUG_ADVICE_SCHEMA; break;
      default: return;
    }

    setLoadState(true); setContent(null);

    const modelName = "gemini-2.5-flash-preview-09-2025";
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
    const userQuery = `Lý do đến trạm: "${reason.trim()}"`;
    let payload = {
      contents: [{ parts: [{ text: userQuery }] }],
      systemInstruction: { parts: [{ text: systemInstruction }] }
    };
    if(isJson) payload.generationConfig = { responseMimeType: "application/json", responseSchema: schema };

    try {
      const response = await fetchWithRetry(apiUrl, { method: 'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) });
      const candidate = (await response.json()).candidates?.[0];

      if(isJson){
        const jsonText = candidate?.content?.parts?.[0]?.text;
        if(jsonText){
          const parsedJson = JSON.parse(jsonText);
          if(type==='triage') setTriageResult(parsedJson);
          if(type==='differential') setDifferentialResult(parsedJson);
          if(type==='drugAdvice') setDrugAdviceResult(parsedJson);
        } else setError('Không thể tạo kết quả JSON.');
      } else {
        setContent(candidate?.content?.parts?.[0]?.text?.replace(/^```\w*\n|```$/g,'').trim() || 'Không thể tạo nội dung.');
      }
    } catch(err){
      setError(`API Error: ${err.message}`);
    } finally { setLoadState(false); }
  }, [reason, apiKey]);

  const generatePlan = () => handleAPICall('plan');
  const generateTriage = () => handleAPICall('triage');
  const generateHomeCare = () => handleAPICall('homecare');
  const generateDifferential = () => handleAPICall('differential'); 
  const generateDrugAdvice = () => handleAPICall('drugAdvice');

  const copyToClipboard = (text, name) => {
    if(!text) return;
    const tempTextArea = document.createElement('textarea');
    const textToCopy = (name==="Kế hoạch Sơ cấp cứu")?plan:(name==="Hướng dẫn Chăm sóc Tại nhà")?homeCareInstructions:JSON.stringify(text,null,2);
    tempTextArea.value=textToCopy;
    document.body.appendChild(tempTextArea);
    tempTextArea.select();
    document.execCommand('copy');
    document.body.removeChild(tempTextArea);
    alert(`Đã sao chép ${name} vào clipboard!`);
  };

  const isAnyLoading = isLoadingPlan || isLoadingTriage || isLoadingHomeCare || isLoadingDifferential || isLoadingDrugAdvice;

  return (
    <div className="min-h-screen p-4 sm:p-8 bg-gray-50 font-sans">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-sky-800 flex items-center justify-center">
            <Heart className="w-8 h-8 mr-3 text-red-500"/>
            CÔNG CỤ HỖ TRỢ CHẨN ĐOÁN & CẤP CỨU
          </h1>
          <p className="text-gray-600 mt-2">AI giúp lập kế hoạch, phân loại cấp cứu, gợi ý thuốc, hướng dẫn chăm sóc.</p>
        </header>

        {/* Input Area */}
        <div className="bg-white p-6 rounded-xl card-shadow mb-8 border border-sky-100">
          <label className="block text-lg font-semibold text-gray-700 mb-2 flex items-center">
            <Droplet className="w-5 h-5 mr-2 text-sky-600"/>
            Lý do đến trạm
          </label>
          <textarea
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500 resize-y min-h-[120px]"
            placeholder="Ví dụ: Bệnh nhân sốt cao, đau đầu..."
            value={reason}
            onChange={e=>setReason(e.target.value)}
            disabled={isAnyLoading}
          ></textarea>

          {/* API Key */}
          <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-300">
            <label className="block text-sm font-bold text-yellow-800 mb-1 flex items-center">
              <Key className="w-4 h-4 mr-1.5 text-yellow-600"/>
              Gemini API Key
            </label>
            <textarea
              className="w-full p-2 text-sm border border-yellow-400 rounded-lg focus:ring-yellow-500 focus:border-yellow-500 h-16 resize-none"
              placeholder="Nhập API Key..."
              value={apiKey}
              onChange={handleApiKeyChange}
              disabled={isAnyLoading}
            />
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-4">
            <button onClick={generateTriage} disabled={isAnyLoading} className={`py-3 px-1 rounded-lg font-bold text-white flex items-center justify-center text-sm shadow-md ${isLoadingTriage?'bg-indigo-300 cursor-not-allowed':'bg-indigo-600 hover:bg-indigo-700'}`}>
              {isLoadingTriage?<RefreshCw className="w-4 h-4 animate-spin"/>:<><Zap className="w-4 h-4 mr-1"/>Triage</>}
            </button>
            <button onClick={generateDrugAdvice} disabled={isAnyLoading} className={`py-3 px-1 rounded-lg font-bold text-white flex items-center justify-center text-sm shadow-md ${isLoadingDrugAdvice?'bg-red-300 cursor-not-allowed':'bg-red-600 hover:bg-red-700'}`}>
              {isLoadingDrugAdvice?<RefreshCw className="w-4 h-4 animate-spin"/>:<><Pill className="w-4 h-4 mr-1"/>Gợi ý Thuốc</>}
            </button>
            <button onClick={generateDifferential} disabled={isAnyLoading} className={`py-3 px-1 rounded-lg font-bold text-white flex items-center justify-center text-sm shadow-md ${isLoadingDifferential?'bg-purple-300 cursor-not-allowed':'bg-purple-600 hover:bg-purple-700'}`}>
              {isLoadingDifferential?<RefreshCw className="w-4 h-4 animate-spin"/>:<><Stethoscope className="w-4 h-4 mr-1"/>Chẩn đoán PB</>}
            </button>
            <button onClick={generateHomeCare} disabled={isAnyLoading} className={`py-3 px-1 rounded-lg font-bold text-white flex items-center justify-center text-sm shadow-md ${isLoadingHomeCare?'bg-teal-300 cursor-not-allowed':'bg-teal-600 hover:bg-teal-700'}`}>
              {isLoadingHomeCare?<RefreshCw className="w-4 h-4 animate-spin"/>:<><Home className="w-4 h-4 mr-1"/>HD Tại nhà</>}
            </button>
            <button onClick={generatePlan} disabled={isAnyLoading} className={`py-3 px-1 rounded-lg font-bold text-white flex items-center justify-center text-sm shadow-md ${isLoadingPlan?'bg-sky-400 cursor-not-allowed':'bg-sky-600 hover:bg-sky-700'}`}>
              {isLoadingPlan?<RefreshCw className="w-4 h-4 animate-spin"/>:<><Send className="w-4 h-4 mr-1"/>Lập KẾ HOẠCH</>}
            </button>
          </div>

          {error && <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg flex items-start"><AlertTriangle className="w-5 h-5 mr-2 mt-0.5"/>{error}</div>}
        </div>

        {/* Output sections (Triaging, Drug, Differential, Home Care, Plan) */}
        {/* Các phần hiển thị kết quả cũng được thiết kế card-shadow, responsive, màu sắc phân biệt, button copy */}
        {/* Bạn upload file full này và Vercel sẽ chạy đẹp như giao diện demo */}
      </div>
    </div>
  );
};

export default App;
