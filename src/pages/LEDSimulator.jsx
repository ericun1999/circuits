import React, { useState, useEffect } from 'react';

const LEDSimulator = () => {
  // State variables for the circuit
  const [sourceVoltage, setSourceVoltage] = useState(9); // in Volts
  const [resistance, setResistance] = useState(330); // in Ohms
  
  // Constants for a typical red LED
  const LED_FORWARD_VOLTAGE = 2.0; // Volts
  const LED_MAX_CURRENT_MA = 30; // Milliamps (burnout threshold)
  const OPTIMAL_CURRENT_MA = 20; // Milliamps

  // Calculated values
  const [resistorVoltage, setResistorVoltage] = useState(0);
  const [current, setCurrent] = useState(0);
  const [currentMA, setCurrentMA] = useState(0);
  const [ledStatus, setLedStatus] = useState('off'); // 'off', 'on', 'blown'

  // Update calculations whenever inputs change
  useEffect(() => {
    // 1. Calculate voltage across the resistor
    // If source is less than LED forward voltage, no current flows.
    let vr = sourceVoltage - LED_FORWARD_VOLTAGE;
    if (vr < 0) vr = 0;
    
    // 2. Calculate current using Ohm's Law (I = V / R)
    let i = 0;
    if (resistance > 0) {
      i = vr / resistance;
    }

    // 3. Convert to milliamps
    let i_mA = i * 1000;

    // 4. Determine LED status
    let status = 'on';
    if (i_mA === 0) {
      status = 'off';
    } else if (i_mA > LED_MAX_CURRENT_MA) {
      status = 'blown';
    }

    setResistorVoltage(vr);
    setCurrent(i);
    setCurrentMA(i_mA);
    setLedStatus(status);
  }, [sourceVoltage, resistance]);

  // Calculate dynamic styling for LED glow
  const getLedGlow = () => {
    if (ledStatus === 'blown') return 'none';
    if (ledStatus === 'off') return 'none';
    
    // Cap brightness visual at 100% (around 20mA)
    const brightness = Math.min(1, currentMA / OPTIMAL_CURRENT_MA);
    return `drop-shadow(0 0 ${brightness * 15}px rgba(239, 68, 68, ${brightness}))`;
  };

  const getLedColor = () => {
    if (ledStatus === 'blown') return '#1f2937'; // Dark gray/burnt
    if (ledStatus === 'off') return '#7f1d1d'; // Very dark red
    
    // Brighten the red as current increases
    const brightness = Math.min(1, currentMA / OPTIMAL_CURRENT_MA);
    const red = Math.floor(127 + (128 * brightness));
    return `rgb(${red}, 0, 0)`;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans text-gray-800">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">LED Circuit Simulator</h1>
          <p className="text-gray-600">
            Adjust the voltage and resistance to see how they affect the current flowing through an LED. 
            Learn how to use Ohm's Law to prevent the LED from blowing up!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Left Column: Visual Simulator */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200 flex flex-col items-center justify-center relative">
            <h2 className="text-xl font-bold mb-6 self-start w-full border-b pb-2">Live Circuit</h2>
            
            {/* Warning Banner */}
            {ledStatus === 'blown' && (
              <div className="absolute top-20 bg-red-100 text-red-700 px-4 py-2 rounded-lg font-bold flex items-center shadow-md z-10 animate-bounce">
                <span className="text-2xl mr-2">💥</span> LED Destroyed! Current exceeded {LED_MAX_CURRENT_MA}mA
              </div>
            )}

            {/* SVG Circuit Diagram */}
            <div className="w-full max-w-md aspect-video relative my-8">
              <svg viewBox="0 0 400 300" className="w-full h-full stroke-gray-800 drop-shadow-sm">
                {/* Wires */}
                <path d="M 50,50 L 160,50" fill="none" strokeWidth="4" />
                <path d="M 240,50 L 350,50 L 350,130" fill="none" strokeWidth="4" />
                <path d="M 350,160 L 350,250 L 50,250 L 50,175" fill="none" strokeWidth="4" />
                <path d="M 50,50 L 50,130" fill="none" strokeWidth="4" />

                {/* Battery Component */}
                <g className="battery">
                  <line x1="25" y1="130" x2="75" y2="130" strokeWidth="4" /> {/* Positive (Long) */}
                  <line x1="35" y1="145" x2="65" y2="145" strokeWidth="6" /> {/* Negative (Short) */}
                  <line x1="25" y1="160" x2="75" y2="160" strokeWidth="4" /> {/* Positive (Long) */}
                  <line x1="35" y1="175" x2="65" y2="175" strokeWidth="6" /> {/* Negative (Short) */}
                  
                  <text x="-10" y="158" className="text-lg font-bold stroke-none fill-blue-600">{sourceVoltage}V</text>
                  <text x="35" y="120" className="text-xl font-bold stroke-none fill-gray-800">+</text>
                  <text x="38" y="200" className="text-xl font-bold stroke-none fill-gray-800">-</text>
                </g>

                {/* Resistor Component */}
                <g className="resistor">
                  <path d="M 160,50 L 168,30 L 184,70 L 200,30 L 216,70 L 232,30 L 240,50" fill="none" strokeWidth="4" strokeLinejoin="round"/>
                  <text x="200" y="20" className="text-lg font-bold stroke-none fill-green-600" textAnchor="middle">{resistance} Ω</text>
                </g>

                {/* LED Component */}
                <g className="led" style={{ filter: getLedGlow() }}>
                  <polygon points="330,130 370,130 350,160" fill={getLedColor()} strokeWidth="2" />
                  <line x1="330" y1="160" x2="370" y2="160" strokeWidth="4" />
                  
                  {/* Light Rays */}
                  {ledStatus === 'on' && (
                    <>
                      <line x1="375" y1="120" x2="395" y2="100" stroke="#fca5a5" strokeWidth="3" strokeLinecap="round" />
                      <line x1="385" y1="140" x2="410" y2="130" stroke="#fca5a5" strokeWidth="3" strokeLinecap="round" />
                    </>
                  )}
                  {/* Shatter marks if blown */}
                  {ledStatus === 'blown' && (
                    <>
                      <line x1="340" y1="140" x2="360" y2="155" stroke="white" strokeWidth="2" />
                      <line x1="360" y1="135" x2="345" y2="150" stroke="white" strokeWidth="2" />
                    </>
                  )}
                  
                  <text x="310" y="190" className="text-sm font-bold stroke-none fill-red-600" textAnchor="end">Vf: {LED_FORWARD_VOLTAGE}V</text>
                </g>

                {/* Current Flow Indicator (Animated Dots) */}
                {currentMA > 0 && ledStatus !== 'blown' && (
                  <circle cx="200" cy="250" r="4" fill="currentColor" className="text-orange-500 animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite]" />
                )}
                {currentMA > 0 && ledStatus !== 'blown' && (
                  <text x="200" y="275" className="text-base font-bold stroke-none fill-orange-600" textAnchor="middle">
                    I = {currentMA.toFixed(1)} mA
                  </text>
                )}
              </svg>
            </div>
          </div>

          {/* Right Column: Controls & Math */}
          <div className="space-y-6 flex flex-col">
            
            {/* Controls */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
              <h2 className="text-xl font-bold mb-4 border-b pb-2">Circuit Controls</h2>
              
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <label className="font-semibold text-gray-700">Source Voltage (Vs)</label>
                  <span className="font-bold text-blue-600">{sourceVoltage} V</span>
                </div>
                <input 
                  type="range" 
                  min="0" max="24" step="0.5" 
                  value={sourceVoltage} 
                  onChange={(e) => setSourceVoltage(Number(e.target.value))}
                  className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>0V</span>
                  <span>12V</span>
                  <span>24V</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="font-semibold text-gray-700">Resistance (R)</label>
                  <span className="font-bold text-green-600">{resistance} Ω</span>
                </div>
                <input 
                  type="range" 
                  min="1" max="2000" step="10" 
                  value={resistance} 
                  onChange={(e) => setResistance(Number(e.target.value))}
                  className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>1Ω</span>
                  <span>1000Ω</span>
                  <span>2000Ω</span>
                </div>
              </div>
            </div>

            {/* Educational Math Panel */}
            <div className="bg-slate-800 text-white rounded-2xl shadow-sm p-6 flex-grow">
              <h2 className="text-xl font-bold mb-4 border-b border-slate-600 pb-2 flex items-center">
                <span className="mr-2">🧮</span> Ohm's Law Calculator
              </h2>
              
              <div className="space-y-4 text-sm md:text-base">
                <div className="bg-slate-700 rounded-lg p-3">
                  <p className="text-slate-300 font-semibold mb-1">Step 1: Find Voltage across Resistor</p>
                  <p className="font-mono">Vr = V_source - V_led</p>
                  <p className="font-mono text-blue-300 mt-1">
                    Vr = {sourceVoltage}V - {LED_FORWARD_VOLTAGE}V = 
                    <span className="font-bold text-white bg-blue-600/30 px-1 ml-1 rounded">
                      {resistorVoltage.toFixed(2)}V
                    </span>
                  </p>
                </div>

                <div className="bg-slate-700 rounded-lg p-3">
                  <p className="text-slate-300 font-semibold mb-1">Step 2: Calculate Current (Amps)</p>
                  <p className="font-mono">I = Vr / R</p>
                  {sourceVoltage < LED_FORWARD_VOLTAGE ? (
                    <p className="font-mono text-gray-400 mt-1 italic">Voltage too low to turn on LED.</p>
                  ) : (
                    <p className="font-mono text-green-300 mt-1">
                      I = {resistorVoltage.toFixed(2)}V / {resistance}Ω = 
                      <span className="font-bold text-white bg-green-600/30 px-1 ml-1 rounded">
                        {current.toFixed(4)} A
                      </span>
                    </p>
                  )}
                </div>

                <div className="bg-slate-700 rounded-lg p-3">
                  <p className="text-slate-300 font-semibold mb-1">Step 3: Convert to Milliamps (mA)</p>
                  <p className="font-mono">I(mA) = I(A) × 1000</p>
                  <p className="font-mono text-orange-300 mt-1">
                    I(mA) = {current.toFixed(4)}A × 1000 = 
                    <span className={`font-bold px-1 ml-1 rounded ${ledStatus === 'blown' ? 'bg-red-600 text-white' : 'bg-orange-600/30 text-white'}`}>
                      {currentMA.toFixed(1)} mA
                    </span>
                  </p>
                </div>
                
                {/* Conclusion Text */}
                <div className="mt-4 pt-4 border-t border-slate-600">
                  {ledStatus === 'off' && (
                    <p className="text-gray-400">💡 The LED is off. The source voltage must be higher than the LED's forward voltage ({LED_FORWARD_VOLTAGE}V).</p>
                  )}
                  {ledStatus === 'on' && currentMA < 10 && (
                    <p className="text-yellow-200">💡 The LED is quite dim. Try increasing voltage or decreasing resistance.</p>
                  )}
                  {ledStatus === 'on' && currentMA >= 10 && currentMA <= LED_MAX_CURRENT_MA && (
                    <p className="text-green-300">✅ Perfect! The LED is operating safely in its optimal range (10-30mA).</p>
                  )}
                  {ledStatus === 'blown' && (
                    <p className="text-red-400 font-bold">⚠️ BOOM! The current exceeded {LED_MAX_CURRENT_MA}mA. You need a higher value resistor to protect the LED!</p>
                  )}
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default LEDSimulator;