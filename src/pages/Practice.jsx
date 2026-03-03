import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, RefreshCw, Calculator, HelpCircle, Award } from 'lucide-react';

const Practice = () => {
  const [problem, setProblem] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState(null); // 'correct', 'incorrect', null
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [difficulty, setDifficulty] = useState('beginner');

  // LED Constant
  const LED_VF = 2.0; 

  const generateProblem = () => {
    setUserAnswer('');
    setFeedback(null);
    setShowHint(false);

    // Randomize which variable to solve for: 0=Voltage(Vs), 1=Resistance(R), 2=Current(I)
    const type = Math.floor(Math.random() * 3);
    
    // Generate base values based on difficulty
    let R, I_mA, Vs;
    
    if (difficulty === 'beginner') {
      R = [100, 200, 300, 400, 500][Math.floor(Math.random() * 5)];
      I_mA = [10, 20, 25][Math.floor(Math.random() * 3)];
    } else {
      R = Math.floor(Math.random() * 900) + 100;
      I_mA = Math.floor(Math.random() * 25) + 5;
    }

    // Calculate Vs based on R and I (Vs = I*R + Vf)
    const I_A = I_mA / 1000;
    const Vr = I_A * R;
    Vs = parseFloat((Vr + LED_VF).toFixed(1));

    setProblem({
      type,
      Vs: type === 0 ? null : Vs,
      R: type === 1 ? null : R,
      I_mA: type === 2 ? null : I_mA,
      answer: type === 0 ? Vs : (type === 1 ? R : I_mA),
      Vr: Vr.toFixed(2)
    });
  };

  useEffect(() => {
    generateProblem();
  }, [difficulty]);

  const checkAnswer = (e) => {
    e.preventDefault();
    const numericAnswer = parseFloat(userAnswer);
    const tolerance = problem.type === 2 ? 0.5 : 0.2; // Higher tolerance for mA

    if (Math.abs(numericAnswer - problem.answer) <= tolerance) {
      setFeedback('correct');
      setScore(s => s + 10);
      setStreak(s => s + 1);
    } else {
      setFeedback('incorrect');
      setStreak(0);
    }
  };

  if (!problem) return null;

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-800">
      <div className="max-w-4xl mx-auto">
        {/* Header & Stats */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Calculator className="text-indigo-600" /> Ohm's Law Master
            </h1>
            <p className="text-slate-500 text-sm">Solve for the missing circuit component</p>
          </div>
          
          <div className="flex gap-4 mt-4 md:mt-0">
            <div className="text-center px-4 py-2 bg-indigo-50 rounded-xl border border-indigo-100">
              <p className="text-xs text-indigo-600 font-bold uppercase tracking-wider">Score</p>
              <p className="text-xl font-black text-indigo-700">{score}</p>
            </div>
            <div className="text-center px-4 py-2 bg-orange-50 rounded-xl border border-orange-100">
              <p className="text-xs text-orange-600 font-bold uppercase tracking-wider">Streak</p>
              <p className="text-xl font-black text-orange-700">{streak} 🔥</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Main Challenge Area */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex justify-between items-start mb-6">
                <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold uppercase">
                  Problem Type: {['Find Source Voltage', 'Find Resistance', 'Find Current'][problem.type]}
                </span>
                <select 
                  value={difficulty} 
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="text-xs border-none bg-slate-100 rounded-lg p-1 font-bold focus:ring-0"
                >
                  <option value="beginner">Beginner</option>
                  <option value="expert">Expert</option>
                </select>
              </div>

              {/* Circuit SVG Visualization */}
              <div className="w-full aspect-video bg-slate-900 rounded-xl mb-6 relative overflow-hidden flex items-center justify-center">
                 <svg viewBox="0 0 400 240" className="w-full h-full stroke-white fill-none">
                    {/* Wire Path */}
                    <path d="M 80,60 L 160,60 M 240,60 L 320,60 L 320,100 M 320,140 L 320,180 L 80,180 L 80,140 M 80,100 L 80,60" strokeWidth="3" />
                    
                    {/* Battery */}
                    <g className="stroke-indigo-400">
                        <line x1="60" y1="110" x2="100" y2="110" strokeWidth="3" />
                        <line x1="70" y1="120" x2="90" y2="120" strokeWidth="5" />
                        <line x1="60" y1="130" x2="100" y2="130" strokeWidth="3" />
                        <line x1="70" y1="140" x2="90" y2="140" strokeWidth="5" />
                        <text x="40" y="125" className="fill-indigo-400 text-sm font-bold stroke-none" textAnchor="end">
                            {problem.type === 0 ? '?? V' : `${problem.Vs}V`}
                        </text>
                    </g>

                    {/* Resistor */}
                    <g className="stroke-emerald-400">
                        <path d="M 160,60 L 168,45 L 184,75 L 200,45 L 216,75 L 232,45 L 240,60" strokeWidth="3" strokeLinejoin="round"/>
                        <text x="200" y="30" className="fill-emerald-400 text-sm font-bold stroke-none" textAnchor="middle">
                            {problem.type === 1 ? '?? Ω' : `${problem.R}Ω`}
                        </text>
                    </g>

                    {/* LED */}
                    <g className="stroke-rose-400 fill-rose-900/30">
                        <polygon points="305,100 335,100 320,130" strokeWidth="2" />
                        <line x1="305" y1="130" x2="335" y2="130" strokeWidth="3" />
                        <text x="345" y="120" className="fill-rose-400 text-[10px] font-bold stroke-none italic">
                            Vf = {LED_VF}V
                        </text>
                    </g>

                    {/* Current Text */}
                    <text x="200" y="210" className="fill-orange-400 text-sm font-bold stroke-none" textAnchor="middle">
                        I = {problem.type === 2 ? '?? mA' : `${problem.I_mA}mA`}
                    </text>
                 </svg>
              </div>

              <form onSubmit={checkAnswer} className="space-y-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-slate-600">
                    Your Answer ({['Volts', 'Ohms', 'mA'][problem.type]}):
                  </label>
                  <div className="flex gap-2">
                    <input 
                      type="number" 
                      step="0.01"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      placeholder="Enter value..."
                      disabled={feedback === 'correct'}
                      className="flex-grow p-3 rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:outline-none transition-colors font-mono text-lg"
                      required
                    />
                    <button 
                      type="submit"
                      disabled={feedback === 'correct'}
                      className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50"
                    >
                      Check
                    </button>
                  </div>
                </div>
              </form>

              {feedback && (
                <div className={`mt-6 p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300 ${
                  feedback === 'correct' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}>
                  {feedback === 'correct' ? (
                    <>
                      <CheckCircle className="shrink-0" />
                      <div>
                        <p className="font-bold">Excellent! That's correct.</p>
                        <p className="text-sm">You've mastered this {difficulty} circuit.</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <XCircle className="shrink-0" />
                      <div>
                        <p className="font-bold">Not quite right.</p>
                        <p className="text-sm">Remember to account for the LED's forward voltage ({LED_VF}V)!</p>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
            
            <button 
              onClick={generateProblem}
              className="w-full py-4 bg-white border-2 border-slate-200 rounded-2xl flex items-center justify-center gap-2 font-bold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <RefreshCw size={20} /> Next Problem
            </button>
          </div>

          {/* Sidebar / Instructions */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-800 text-white p-6 rounded-2xl shadow-lg border border-slate-700">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <HelpCircle className="text-indigo-400" /> Need Help?
              </h2>
              
              <div className="space-y-4 text-sm">
                <div className="p-3 bg-slate-700 rounded-lg border border-slate-600">
                  <p className="text-indigo-300 font-bold mb-1 underline">Formula 1: Resistor Voltage</p>
                  <p className="font-mono">$V_r = V_s - V_f$</p>
                  <p className="text-slate-400 text-xs mt-1">First, subtract the LED voltage ($2.0V$) from the battery.</p>
                </div>

                <div className="p-3 bg-slate-700 rounded-lg border border-slate-600">
                  <p className="text-emerald-300 font-bold mb-1 underline">Formula 2: Ohm's Law</p>
                  <p className="font-mono">$V_r = I \times R$</p>
                  <p className="font-mono">$I = V_r / R$</p>
                  <p className="font-mono">$R = V_r / I$</p>
                </div>

                <div className="p-3 bg-slate-700 rounded-lg border border-slate-600">
                  <p className="text-orange-300 font-bold mb-1 underline">Conversion</p>
                  <p className="font-mono">Current in mA = $Amps \times 1000$</p>
                </div>

                <button 
                  onClick={() => setShowHint(!showHint)}
                  className="w-full py-2 bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 rounded-lg font-bold hover:bg-indigo-500/30 transition-all"
                >
                  {showHint ? "Hide Detailed Solution" : "Show Step-by-Step"}
                </button>

                {showHint && (
                  <div className="mt-4 p-4 bg-slate-900 rounded-lg border border-indigo-500/50 animate-in fade-in zoom-in duration-200">
                    <p className="text-xs font-bold text-indigo-400 mb-2 uppercase tracking-tighter">Solution Walkthrough:</p>
                    <div className="space-y-2 font-mono text-xs leading-relaxed">
                      {problem.type === 0 && (
                        <>
                          <p>1. $Vr = I \times R$</p>
                          <p>2. $Vr = {problem.I_mA/1000}A \times {problem.R}Ω = {problem.Vr}V$</p>
                          <p>3. $Vs = Vr + Vf$</p>
                          <p>4. $Vs = {problem.Vr}V + {LED_VF}V = \text{bold}({problem.answer}V)$</p>
                        </>
                      )}
                      {problem.type === 1 && (
                        <>
                          <p>1. $Vr = Vs - Vf$</p>
                          <p>2. $Vr = {problem.Vs}V - {LED_VF}V = {problem.Vr}V$</p>
                          <p>3. $R = Vr / I$</p>
                          <p>4. $R = {problem.Vr}V / {problem.I_mA/1000}A = \text{bold}({problem.answer}Ω)$</p>
                        </>
                      )}
                      {problem.type === 2 && (
                        <>
                          <p>1. $Vr = Vs - Vf$</p>
                          <p>2. $Vr = {problem.Vs}V - {LED_VF}V = {problem.Vr}V$</p>
                          <p>3. $I = Vr / R$</p>
                          <p>4. $I = {problem.Vr}V / {problem.R}Ω = {(problem.I_mA/1000).toFixed(4)}A$</p>
                          <p>5. $I(mA) = I \times 1000 = \text{bold}({problem.answer}mA)$</p>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Achievement / Stats */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Milestones</h2>
              <div className="space-y-3">
                <div className={`flex items-center justify-between p-2 rounded-lg ${score >= 50 ? 'bg-emerald-50' : 'bg-slate-50 opacity-50'}`}>
                   <div className="flex items-center gap-2">
                     <Award size={18} className={score >= 50 ? 'text-emerald-500' : 'text-slate-400'} />
                     <span className="text-sm font-semibold">Circuit Apprentice</span>
                   </div>
                   <span className="text-xs font-bold">{score}/50</span>
                </div>
                <div className={`flex items-center justify-between p-2 rounded-lg ${score >= 200 ? 'bg-indigo-50' : 'bg-slate-50 opacity-50'}`}>
                   <div className="flex items-center gap-2">
                     <Award size={18} className={score >= 200 ? 'text-indigo-500' : 'text-slate-400'} />
                     <span className="text-sm font-semibold">Ohm's Expert</span>
                   </div>
                   <span className="text-xs font-bold">{score}/200</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Practice;