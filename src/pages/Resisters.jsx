import React, { useState, useMemo } from 'react';

const Resisters = () => {
  const [circuitType, setCircuitType] = useState('series'); // 'series' or 'parallel'
  const [resistors, setResistors] = useState([
    { id: 1, value: 100 },
    { id: 2, value: 220 }
  ]);
  const maxResistors = 5;

  const addResistor = () => {
    if (resistors.length < maxResistors) {
      const newId = Math.max(...resistors.map(r => r.id), 0) + 1;
      setResistors([...resistors, { id: newId, value: 100 }]);
    }
  };

  const removeResistor = (id) => {
    if (resistors.length > 1) {
      setResistors(resistors.filter(r => r.id !== id));
    }
  };

  const updateResistor = (id, newValue) => {
    const val = Math.max(1, Number(newValue)); // Prevent 0 or negative resistance
    setResistors(resistors.map(r => r.id === id ? { ...r, value: val } : r));
  };

  // Calculate equivalent resistance
  const totalResistance = useMemo(() => {
    if (resistors.length === 0) return 0;
    if (circuitType === 'series') {
      return resistors.reduce((sum, r) => sum + r.value, 0);
    } else {
      const sumInverse = resistors.reduce((sum, r) => sum + (1 / r.value), 0);
      return sumInverse === 0 ? 0 : 1 / sumInverse;
    }
  }, [resistors, circuitType]);

  // Renders a horizontal resistor symbol
  const renderHorizontalResistor = (x, y, label) => (
    <g transform={`translate(${x}, ${y})`} className="resistor-group" key={label}>
      {/* Background wire to fill the gap behind the zigzag */}
      <line x1="-40" y1="0" x2="-24" y2="0" stroke="currentColor" strokeWidth="3" className="text-gray-800" />
      <line x1="24" y1="0" x2="40" y2="0" stroke="currentColor" strokeWidth="3" className="text-gray-800" />
      {/* Zigzag path */}
      <path 
        d="M -24,0 L -18,-12 L -6,12 L 6,-12 L 18,12 L 24,0" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="3" 
        strokeLinejoin="round"
        className="text-blue-600"
      />
      <text x="0" y="-20" className="text-sm font-bold fill-blue-700" textAnchor="middle">{label}</text>
    </g>
  );

  // Renders a vertical resistor symbol
  const renderVerticalResistor = (x, y, label) => (
    <g transform={`translate(${x}, ${y})`} className="resistor-group" key={label}>
      <line x1="0" y1="-40" x2="0" y2="-24" stroke="currentColor" strokeWidth="3" className="text-gray-800" />
      <line x1="0" y1="24" x2="0" y2="40" stroke="currentColor" strokeWidth="3" className="text-gray-800" />
      {/* Zigzag path */}
      <path 
        d="M 0,-24 L -12,-18 L 12,-6 L -12,6 L 12,18 L 0,24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="3" 
        strokeLinejoin="round"
        className="text-green-600"
      />
      <text x="20" y="5" className="text-sm font-bold fill-green-700" textAnchor="start">{label}</text>
    </g>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 font-sans text-gray-800">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Resistor Network Simulator</h1>
          <p className="text-gray-600">
            Switch between Series and Parallel circuits, add multiple resistors, and learn how to calculate the Total Equivalent Resistance (R<sub>eq</sub>).
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Circuit Visual & Settings */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Circuit Diagram */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
              <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h2 className="text-xl font-bold">Circuit Diagram</h2>
                
                {/* Circuit Type Toggle */}
                <div className="flex bg-gray-100 p-1 rounded-lg">
                  <button 
                    onClick={() => setCircuitType('series')}
                    className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${circuitType === 'series' ? 'bg-white shadow-sm text-blue-700' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    Series
                  </button>
                  <button 
                    onClick={() => setCircuitType('parallel')}
                    className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${circuitType === 'parallel' ? 'bg-white shadow-sm text-green-700' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    Parallel
                  </button>
                </div>
              </div>

              {/* Dynamic SVG Visual */}
              <div className="w-full aspect-[16/9] bg-gray-50 rounded-xl flex items-center justify-center overflow-hidden border border-gray-100">
                <svg viewBox="0 0 600 300" className="w-full h-full">
                  {/* Battery/Power Source (Common to both) */}
                  <g transform="translate(50, 150)">
                    <line x1="-20" y1="0" x2="-20" y2="-100" stroke="currentColor" strokeWidth="3" className="text-gray-800" />
                    <line x1="-20" y1="0" x2="-20" y2="100" stroke="currentColor" strokeWidth="3" className="text-gray-800" />
                    
                    {/* Battery Symbol */}
                    <line x1="-40" y1="-20" x2="0" y2="-20" stroke="currentColor" strokeWidth="3" className="text-gray-800" />
                    <line x1="-30" y1="-5" x2="-10" y2="-5" stroke="currentColor" strokeWidth="6" className="text-gray-800" />
                    <line x1="-40" y1="10" x2="0" y2="10" stroke="currentColor" strokeWidth="3" className="text-gray-800" />
                    <line x1="-30" y1="25" x2="-10" y2="25" stroke="currentColor" strokeWidth="6" className="text-gray-800" />
                    
                    <text x="-50" y="-30" className="text-lg font-bold fill-gray-600">+</text>
                    <text x="-50" y="40" className="text-lg font-bold fill-gray-600">-</text>
                    <text x="-35" y="60" className="text-md font-bold fill-red-600">Vs</text>
                  </g>

                  {circuitType === 'series' && (
                    <g>
                      {/* Top wire spanning to the first resistor and after the last */}
                      <path d="M 30,50 L 550,50 L 550,250 L 30,250" fill="none" stroke="currentColor" strokeWidth="3" className="text-gray-800" />
                      
                      {/* Place resistors evenly along the top wire */}
                      {resistors.map((resistor, index) => {
                        const spacing = 500 / (resistors.length + 1);
                        const x = 30 + spacing * (index + 1);
                        return renderHorizontalResistor(x, 50, `R${index + 1}`);
                      })}
                    </g>
                  )}

                  {circuitType === 'parallel' && (
                    <g>
                      {/* Top and Bottom Main Rails */}
                      {/* Calculate width based on number of branches */}
                      <line x1="30" y1="50" x2={30 + (80 * resistors.length)} y2="50" stroke="currentColor" strokeWidth="3" className="text-gray-800" />
                      <line x1="30" y1="250" x2={30 + (80 * resistors.length)} y2="250" stroke="currentColor" strokeWidth="3" className="text-gray-800" />
                      
                      {/* Place vertical branches for resistors */}
                      {resistors.map((resistor, index) => {
                        const x = 30 + 80 * (index + 1);
                        return (
                          <g key={`branch-${resistor.id}`}>
                            <line x1={x} y1="50" x2={x} y2="110" stroke="currentColor" strokeWidth="3" className="text-gray-800" />
                            <line x1={x} y1="190" x2={x} y2="250" stroke="currentColor" strokeWidth="3" className="text-gray-800" />
                            <circle cx={x} cy="50" r="4" fill="currentColor" className="text-gray-800" />
                            <circle cx={x} cy="250" r="4" fill="currentColor" className="text-gray-800" />
                            {renderVerticalResistor(x, 150, `R${index + 1}`)}
                          </g>
                        );
                      })}
                    </g>
                  )}
                </svg>
              </div>
            </div>

            {/* Resistor Controls */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
              <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h2 className="text-xl font-bold">Resistors</h2>
                <button 
                  onClick={addResistor}
                  disabled={resistors.length >= maxResistors}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors flex items-center"
                >
                  <span className="mr-1">+</span> Add Resistor
                </button>
              </div>

              <div className="space-y-4">
                {resistors.map((resistor, index) => (
                  <div key={resistor.id} className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center font-bold text-gray-700 shadow-sm border border-gray-200 shrink-0">
                      R{index + 1}
                    </div>
                    
                    <div className="flex-grow">
                      <div className="flex justify-between mb-2">
                        <label className="text-sm font-semibold text-gray-600">Value (Ohms)</label>
                        <span className="font-bold text-gray-900">{resistor.value} Ω</span>
                      </div>
                      <input 
                        type="range" 
                        min="1" max="1000" step="1" 
                        value={resistor.value} 
                        onChange={(e) => updateResistor(resistor.id, e.target.value)}
                        className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${circuitType === 'series' ? 'bg-blue-200 accent-blue-600' : 'bg-green-200 accent-green-600'}`}
                      />
                    </div>

                    <div className="w-24 shrink-0">
                       <input 
                        type="number" 
                        min="1"
                        value={resistor.value} 
                        onChange={(e) => updateResistor(resistor.id, e.target.value)}
                        className="w-full text-center font-mono border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <button 
                      onClick={() => removeResistor(resistor.id)}
                      disabled={resistors.length <= 1}
                      className="p-2 text-gray-400 hover:text-red-500 disabled:opacity-30 transition-colors"
                      title="Remove resistor"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Calculations */}
          <div className="lg:col-span-5 flex flex-col h-full">
            <div className="bg-slate-800 text-white rounded-2xl shadow-sm flex-grow flex flex-col overflow-hidden border border-slate-700">
              
              <div className="p-6 bg-slate-900 border-b border-slate-700">
                <h2 className="text-2xl font-bold flex items-center">
                  <span className="mr-3">🧮</span> Calculation
                </h2>
              </div>
              
              <div className="p-6 space-y-8 flex-grow">
                
                {/* Result Highlight */}
                <div className="bg-slate-700/50 rounded-xl p-6 text-center border border-slate-600">
                  <p className="text-slate-400 font-semibold mb-2 uppercase tracking-wider text-sm">Total Equivalent Resistance</p>
                  <p className="text-5xl font-bold text-white flex items-center justify-center gap-2">
                    {totalResistance < 1 ? totalResistance.toFixed(3) : totalResistance.toFixed(1)} <span className="text-3xl text-yellow-400">Ω</span>
                  </p>
                </div>

                {/* Formula Breakdown */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-300 mb-4 border-b border-slate-600 pb-2">Formula Breakdown</h3>
                  
                  {circuitType === 'series' ? (
                    <div className="space-y-4 font-mono text-sm sm:text-base bg-slate-900/50 p-4 rounded-lg">
                      <p className="text-blue-300">R<sub>eq</sub> = R<sub>1</sub> + R<sub>2</sub> + ... + R<sub>n</sub></p>
                      
                      <div className="text-slate-300 mt-4 overflow-x-auto whitespace-nowrap pb-2">
                        R<sub>eq</sub> = {resistors.map(r => r.value).join(' + ')}
                      </div>
                      
                      <p className="text-white font-bold text-lg mt-2 pt-2 border-t border-slate-700">
                        R<sub>eq</sub> = {totalResistance.toFixed(1)} Ω
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4 font-mono text-sm sm:text-base bg-slate-900/50 p-4 rounded-lg">
                      <p className="text-green-300">1/R<sub>eq</sub> = 1/R<sub>1</sub> + 1/R<sub>2</sub> + ... + 1/R<sub>n</sub></p>
                      
                      <div className="text-slate-300 mt-4 overflow-x-auto whitespace-nowrap pb-2 flex items-center gap-2">
                        <span>1/R<sub>eq</sub> = </span>
                        {resistors.map((r, i) => (
                          <span key={i}>
                            1/{r.value} {i < resistors.length - 1 ? '+' : ''}
                          </span>
                        ))}
                      </div>

                      <div className="text-slate-400 mt-2 overflow-x-auto whitespace-nowrap pb-2 flex items-center gap-2">
                        <span>1/R<sub>eq</sub> ≈ </span>
                        {resistors.map((r, i) => (
                          <span key={i}>
                            {(1/r.value).toFixed(4)} {i < resistors.length - 1 ? '+' : ''}
                          </span>
                        ))}
                      </div>

                      <div className="text-slate-300 mt-2 overflow-x-auto whitespace-nowrap pb-2 flex items-center gap-2">
                        <span>1/R<sub>eq</sub> ≈ </span>
                        <span>{resistors.reduce((sum, r) => sum + (1/r.value), 0).toFixed(4)}</span>
                      </div>
                      
                      <div className="text-white font-bold text-lg mt-2 pt-2 border-t border-slate-700">
                        R<sub>eq</sub> = 1 / {resistors.reduce((sum, r) => sum + (1/r.value), 0).toFixed(4)} ≈ {totalResistance.toFixed(2)} Ω
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Educational Note */}
                <div className="bg-slate-700 rounded-lg p-4 text-sm text-slate-300">
                  <span className="font-bold text-white mb-1 block">Did you know?</span>
                  {circuitType === 'series' 
                    ? "In a series circuit, resistors are connected end-to-end. The total resistance is always GREATER than any individual resistor."
                    : "In a parallel circuit, resistors are connected across the same two points. The total resistance is always LESS than the smallest individual resistor."}
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Resisters;