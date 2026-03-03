import React, { useState } from 'react';
import { Link } from 'react-router'; // or 'react-router-dom'

// CONSTANTS - Specs for a standard Red LED
const LED_Vf = 2.0; // Forward Voltage (Volts)
const LED_If = 0.020; // Forward Current (20mA -> Amps)

export default function LEDSimulator2() {
  const [batteryVoltage, setBatteryVoltage] = useState(9);
  const [wiringType, setWiringType] = useState('series'); // 'series' or 'parallel'
  const [ledCount, setLedCount] = useState(1); // 1 or 2

  // --- Core Calculation Logic ---
  
  // 1. Calculate the Voltage and Current requirement of the LED setup
  let requiredVoltage = 0;
  let requiredCurrent = 0;

  if (ledCount === 1) {
    requiredVoltage = LED_Vf;
    requiredCurrent = LED_If;
  } else {
    if (wiringType === 'series') {
      // Series: Voltages add up, Current stays same
      requiredVoltage = LED_Vf * 2;
      requiredCurrent = LED_If;
    } else {
      // Parallel: Voltage stays same, Currents add up
      requiredVoltage = LED_Vf;
      requiredCurrent = LED_If * 2;
    }
  }

  // 2. Calculate the limiting resistor using Ohm's Law: R = (Vbatt - Vled) / I
  const voltageDrop = batteryVoltage - requiredVoltage;
  
  let suggestedResistor = null;
  let status = 'ok';

  if (voltageDrop <= 0) {
    suggestedResistor = 0;
    status = 'insufficient_voltage';
  } else {
    // Current limiting resistor in Ohms (Ω)
    suggestedResistor = voltageDrop / requiredCurrent;
  }

  // Define dynamic display states
  const totalAmps = suggestedResistor > 0 ? requiredCurrent : 0;
  const totalMilliAmps = (totalAmps * 1000).toFixed(0);
  const isSetupValid = status === 'ok';

  // --- Helper UI components for the "Circuit Diagram" ---
  const BatteryIcon = () => (
    <div className="flex flex-col items-center border-2 border-slate-700 rounded-md p-2 w-16 bg-slate-100">
      <div className="text-sm font-bold text-slate-900">{batteryVoltage}V</div>
      <div className="text-xs text-slate-600">Power</div>
    </div>
  );

  const ResistorIcon = ({ value }) => (
    <div className="flex items-center gap-1">
      <div className="w-6 h-1 bg-slate-500"></div>
      <div className="w-12 h-6 border-2 border-slate-600 rounded bg-amber-100 flex items-center justify-center font-mono text-[11px] font-bold text-slate-800 shadow-inner">
        {status === 'ok' ? `${value.toFixed(0)}Ω` : 'ERR'}
      </div>
      <div className="w-6 h-1 bg-slate-500"></div>
    </div>
  );

  const LedIcon = ({ label }) => (
    <div className="flex flex-col items-center group relative">
      <div className={`w-8 h-8 rounded-full border-2 border-slate-700 flex items-center justify-center transition-colors ${isSetupValid ? 'bg-red-500 shadow-lg shadow-red-300' : 'bg-red-200'}`}>
        <span className="text-xl">💡</span>
      </div>
      <div className="text-[10px] text-slate-500 mt-1">{label} (2V)</div>
    </div>
  );

  const Wire = ({ className }) => <div className={`bg-slate-500 rounded ${className}`}></div>;


  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10 font-sans text-slate-900">
      
      {/* Navigation Header */}
      <header className="mb-10 flex items-center justify-between border-b border-slate-200 pb-5">
        <Link to="/" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition">
          &larr; Back to Workbench
        </Link>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-950">
          LED Wizard <span className="text-slate-400 font-light">Sim</span>
        </h1>
        <div className="w-24"></div> {/* Spacer for symmetry */}
      </header>

      <main className="grid gap-8 md:grid-cols-[340px,1fr]">
        
        {/* --- Left Column: Controls --- */}
        <section className="space-y-8 rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-3">1. Power Source (Battery Voltage)</label>
            <div className="flex items-center gap-4">
              <input 
                type="range" 
                min="1" max="24" step="0.5" 
                value={batteryVoltage} 
                onChange={(e) => setBatteryVoltage(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <span className="text-2xl font-bold tabular-nums text-blue-700 w-16 text-right">{batteryVoltage.toFixed(1)}V</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-3">2. Choose LED Count</label>
            <div className="grid grid-cols-2 gap-3">
              {[1, 2].map(count => (
                <button 
                  key={count}
                  onClick={() => setLedCount(count)}
                  className={`flex items-center justify-center gap-2 px-4 py-3 border rounded-xl text-sm font-medium transition ${ledCount === count ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300'}`}
                >
                  <span className="text-lg">💡</span> {count} LED{count > 1 ? 's' : ''}
                </button>
              ))}
            </div>
          </div>

          {ledCount === 2 && (
            <div className="animate-fade-in">
              <label className="block text-sm font-semibold text-slate-900 mb-3">3. Define Wiring Configuration</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'series', name: 'Series (Add V)' },
                  { id: 'parallel', name: 'Parallel (Add A)' }
                ].map(type => (
                  <button 
                    key={type.id}
                    onClick={() => setWiringType(type.id)}
                    className={`px-4 py-3 border rounded-xl text-sm font-medium transition ${wiringType === type.id ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300'}`}
                  >
                    {type.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* --- Right Column: Results & Visualization --- */}
        <section className="space-y-8">
          
          {/* Results Cards */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-full text-blue-700 text-xl">💧</div>
              <div>
                <p className="text-xs text-slate-500 font-medium tracking-wide uppercase">Total Requirement</p>
                <p className="text-2xl font-bold tabular-nums text-slate-950">{requiredVoltage.toFixed(1)}V <span className="text-sm font-medium text-slate-500">at {requiredCurrent * 1000}mA</span></p>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-amber-100 rounded-full text-amber-700 text-xl">🚧</div>
              <div>
                <p className="text-xs text-slate-500 font-medium tracking-wide uppercase">Limiting Resistor</p>
                <p className={`text-2xl font-bold tabular-nums ${suggestedResistor > 0 ? 'text-slate-950' : 'text-red-600'}`}>
                  {suggestedResistor > 0 ? `${suggestedResistor.toFixed(0)} Ω` : 'N/A'}
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4 sm:col-span-2 lg:col-span-1">
              <div className="p-3 bg-emerald-100 rounded-full text-emerald-700 text-xl">⚡</div>
              <div>
                <p className="text-xs text-slate-500 font-medium tracking-wide uppercase">Total Circuit Current</p>
                <p className="text-2xl font-bold tabular-nums text-slate-950">{totalMilliAmps} mA</p>
              </div>
            </div>
          </div>

          {/* Visualization / Feedback area */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
            <h3 className="text-lg font-bold text-slate-950 mb-6">Interactive Circuit Feedback</h3>
            
            <div className="flex flex-col items-center min-h-[160px] justify-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 p-6 transition-all">
              
              {status === 'insufficient_voltage' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/95 backdrop-blur-sm rounded-2xl z-10 text-center p-6 border-2 border-red-200">
                  <span className="text-4xl mb-3">⚠️</span>
                  <h4 className="text-lg font-bold text-red-700">Voltage Too Low!</h4>
                  <p className="text-sm text-red-900 max-w-sm">The battery ({batteryVoltage.toFixed(1)}V) doesn't provide enough voltage to power this LED configuration ({requiredVoltage.toFixed(1)}V needed). Increase battery voltage or change the wiring.</p>
                </div>
              )}

              {/* Simplified Breadboard View */}
              <div className="relative flex items-center gap-0 w-full max-w-lg justify-center scale-90 sm:scale-100 mb-8">
                <BatteryIcon />
                <Wire className="w-12 h-1 mx-0" /> {/* Wire from Batt+ to Resistor */}

                {/* Main Circuit Path */}
                <div className="flex items-center">
                  <ResistorIcon value={suggestedResistor} />

                  {ledCount === 1 ? (
                    // Single LED layout
                    <div className="flex items-center">
                      <Wire className="w-12 h-1" />
                      <LedIcon label="LED 1" />
                      <Wire className="w-12 h-1" />
                    </div>
                  ) : wiringType === 'series' ? (
                    // Series layout
                    <div className="flex items-center">
                      <Wire className="w-10 h-1" />
                      <LedIcon label="LED 1" />
                      <Wire className="w-10 h-1" />
                      <LedIcon label="LED 2" />
                      <Wire className="w-10 h-1" />
                    </div>
                  ) : (
                    // Parallel layout
                    <div className="flex items-center gap-0">
                        <Wire className="w-6 h-1" />
                        
                        {/* Parallel Junction */}
                        <div className="relative flex items-center justify-center h-28 w-28">
                            <Wire className="absolute h-1 w-28 top-1/2 -translate-y-1/2 left-0"/> {/* Main horizontal junction */}
                            <div className="relative flex flex-col items-center justify-between h-full">
                                <LedIcon label="LED A" />
                                <LedIcon label="LED B" />
                            </div>
                        </div>
                        <Wire className="w-6 h-1" />
                    </div>
                  )}
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-1 h-6 bg-slate-500 rounded-t"></div>
                  <div className="text-[10px] font-bold text-slate-500 bg-slate-200 px-2 py-0.5 rounded">GND</div>
                </div>
              </div>

              <hr className="w-full border-slate-200 mb-8" />

              {/* --- NEW SECTION: Detailed Calculations --- */}
              {isSetupValid && (
                  <div className="w-full max-w-lg space-y-4 font-mono text-xs bg-white p-5 rounded-xl border border-slate-100 text-slate-700 shadow-inner">
                      <div className="text-sm font-semibold text-slate-900 font-sans">Calculation steps:</div>
                      <div>
                          <span className="text-slate-500">1. Setup Specifics:</span> Single Red LED <br/> (V<sub>f</sub> = {LED_Vf}V, I<sub>f</sub> = {LED_If*1000}mA)
                      </div>
                      
                      <div>
                          <span className="text-slate-500">2. Determine Required Voltage (V<sub>req</sub>):</span>
                          {ledCount === 1 ? (
                              <p>V<sub>req</sub> = {LED_Vf}V</p>
                          ) : wiringType === 'series' ? (
                              <p>V<sub>req</sub> = 2.0V (V<sub>f</sub>) × 2 (LEDs) = <span className="text-slate-900 font-semibold">{requiredVoltage.toFixed(1)}V</span></p>
                          ) : (
                              <p>V<sub>req</sub> = 2.0V (V<sub>f</sub> stays same in parallel)</p>
                          )}
                      </div>

                      <div>
                          <span className="text-slate-500">3. Determine Required Current (I<sub>req</sub>):</span>
                          {ledCount === 1 ? (
                              <p>I<sub>req</sub> = {LED_If*1000}mA</p>
                          ) : wiringType === 'series' ? (
                              <p>I<sub>req</sub> = 20mA (I<sub>f</sub> stays same in series)</p>
                          ) : (
                              <p>I<sub>req</sub> = 20mA (I<sub>f</sub>) × 2 (LEDs) = <span className="text-slate-900 font-semibold">{requiredCurrent * 1000}mA</span></p>
                          )}
                      </div>

                      <div className="bg-amber-50 p-3 rounded-lg border border-amber-100 text-amber-950">
                          <span className="text-amber-800 font-sans font-semibold">4. Ohm's Law (R = ΔV / I):</span>
                          <div className="mt-1">R = (V<sub>batt</sub> - V<sub>req</sub>) / I<sub>req</sub> (amps)</div>
                          <div>R = ({batteryVoltage.toFixed(1)}V - {requiredVoltage.toFixed(1)}V) / {requiredCurrent.toFixed(3)}A</div>
                          <div>R = {(batteryVoltage - requiredVoltage).toFixed(1)}V / {requiredCurrent.toFixed(3)}A</div>
                          <div className="text-sm font-bold mt-1 text-slate-950">R = {suggestedResistor.toFixed(1)} Ω</div>
                      </div>
                  </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <footer className="mt-16 text-center text-xs text-slate-400 border-t border-slate-100 pt-8">
        Calculation assumes standard Red LEDs (V<sub>f</sub>=2.0V, I<sub>f</sub>=20mA). Ideal components used.
      </footer>
    </div>
  );
}