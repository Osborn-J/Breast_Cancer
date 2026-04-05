import { useState, useMemo } from 'react';
import { getPrediction } from './api';
import { FEATURE_NAMES } from './constants';
import { 
  Activity, 
  Beaker, 
  AlertCircle, 
  CheckCircle, 
  BarChart3, 
  ShieldCheck, 
  Microscope 
} from 'lucide-react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  ResponsiveContainer 
} from 'recharts';

const App = () => {
  // 1. STATE MANAGEMENT
  // Initialize with 30 zeros for the Wisconsin Breast Cancer Dataset
  const [formData, setFormData] = useState<number[]>(new Array(30).fill(0));
  const [result, setResult] = useState<{
    result: string, 
    confidence: string, 
    is_malignant: boolean
  } | null>(null);
  const [loading, setLoading] = useState(false);

  // 2. DYNAMIC CHART DATA
  // We scale features so they appear balanced on the Radar Chart
  const chartData = useMemo(() => [
    { subject: 'Radius', A: formData[0] || 0, fullMark: 30 },
    { subject: 'Texture', A: formData[1] || 0, fullMark: 40 },
    { subject: 'Perimeter', A: formData[2] || 0, fullMark: 180 },
    { subject: 'Area', A: (formData[3] || 0) / 10, fullMark: 250 }, 
    { subject: 'Smoothness', A: (formData[4] || 0) * 100, fullMark: 20 },
    { subject: 'Concavity', A: (formData[6] || 0) * 100, fullMark: 50 },
  ], [formData]);

  // 3. HANDLERS
  const handleInputChange = (idx: number, value: string) => {
    const val = parseFloat(value);
    const newForm = [...formData];
    // Keep 0 if empty/NaN to prevent backend crashes
    newForm[idx] = isNaN(val) ? 0 : val;
    setFormData(newForm);
  };

  const runAnalysis = async () => {
    setLoading(true);
    try {
      const data = await getPrediction(formData);
      setResult(data);
    } catch (err) {
      alert("Backend connection failed. Please check if FastAPI is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-900">
      
      {/* --- PROFESSIONAL HEADER --- */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-red-600 p-2 rounded-xl text-white shadow-lg shadow-red-200">
              <Activity size={24} />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight text-slate-800 uppercase">
                Breast Cancer <span className="text-red-600">Diagnostic System</span>
              </h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                <Microscope size={12} /> 
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 px-3 py-1 bg-green-50 rounded-full border border-green-100">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-bold text-green-700">SYSTEM READY</span>
             </div>
             <ShieldCheck size={20} className="text-slate-300" />
          </div>
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="max-w-7xl mx-auto p-4 md:p-8">
        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* LEFT: INPUTS */}
          <div className="lg:col-span-7 bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/60 border border-white p-8">
            <div className="flex items-center justify-between mb-8">
               <div className="flex items-center gap-2">
                 <Beaker className="text-blue-500" size={20} />
                 <h2 className="font-bold text-slate-700">Clinical Feature Metrics</h2>
               </div>
               <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter italic">
                 Decimal input enabled
               </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 h-[52vh] overflow-y-auto pr-4 custom-scrollbar">
              {FEATURE_NAMES.map((name, idx) => (
                <div key={idx} className="group">
                  <label className="text-[9px] font-black text-slate-400 uppercase mb-1.5 ml-1 block group-focus-within:text-blue-600 transition-colors">
                    {name}
                  </label>
                  <input
                    type="number"
                    step="any"
                    inputMode="decimal"
                    value={formData[idx] === 0 ? "" : formData[idx]}
                    onChange={(e) => handleInputChange(idx, e.target.value)}
                    placeholder="0.000"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-sm font-semibold focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all shadow-inner"
                  />
                </div>
              ))}
            </div>

            <button 
              onClick={runAnalysis}
              disabled={loading}
              className="w-full mt-10 bg-slate-900 hover:bg-red-600 text-white font-bold py-5 rounded-2xl transition-all shadow-2xl active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? "PROCESSING NEURAL NETWORK..." : "GENERATE DIAGNOSTIC REPORT"}
            </button>
          </div>

          {/* RIGHT: VISUALS & RESULTS */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/60 border border-white p-8 flex-1 flex flex-col">
              <div className="flex items-center gap-2 mb-6">
                <BarChart3 className="text-purple-500" size={20} />
                <h2 className="font-bold text-slate-700">Morphological Visualization</h2>
              </div>

              {/* RADAR CHART COMPONENT */}
              <div className="h-72 w-full mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                    <PolarGrid stroke="#f1f5f9" strokeWidth={2} />
                    <PolarAngleAxis 
                      dataKey="subject" 
                      tick={{fontSize: 10, fontWeight: 800, fill: '#94a3b8'}} 
                    />
                    <Radar
                      name="Sample"
                      dataKey="A"
                      stroke="#ef4444"
                      fill="#ef4444"
                      fillOpacity={0.5}
                      animationDuration={500}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              {/* DYNAMIC RESULT BOX */}
              <div className="mt-auto border-t border-slate-100 pt-6">
                {!result ? (
                  <div className="text-center py-10 px-4 border-2 border-dashed border-slate-100 rounded-[2rem] bg-slate-50/50">
                    <p className="text-slate-400 text-sm font-semibold uppercase tracking-wide">
                      Awaiting Biometric Data
                    </p>
                  </div>
                ) : (
                  <div className="animate-in fade-in zoom-in duration-300">
                    <div className={`p-6 rounded-[2rem] mb-4 flex items-center gap-5 ${result.is_malignant ? 'bg-red-50 text-red-900' : 'bg-green-50 text-green-900'}`}>
                      <div className={`p-4 rounded-2xl shadow-lg ${result.is_malignant ? 'bg-red-600 text-white' : 'bg-green-600 text-white'}`}>
                        {result.is_malignant ? <AlertCircle size={32} /> : <CheckCircle size={32} />}
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50">Diagnostic Result</p>
                        <h3 className="text-3xl font-black">{result.result}</h3>
                      </div>
                    </div>
                    
                    <div className="bg-slate-900 p-5 rounded-[1.5rem] shadow-xl">
                      <div className="flex justify-between items-end mb-3">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Model Certainty</span>
                        <span className="text-xl font-black text-white">{result.confidence}</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-1000 ease-out ${result.is_malignant ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]' : 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)]'}`}
                          style={{ width: result.confidence }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default App;