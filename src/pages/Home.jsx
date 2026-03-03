import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans text-slate-900">
      {/* Header Section */}
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-800 sm:text-5xl">
          Lab Workbench
        </h1>
        <p className="mt-4 text-lg text-slate-600">
          Precision calculators and simulators for your next circuit.
        </p>
      </header>

      {/* Navigation Grid */}
      <main className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
        {/* LED Simulator Card */}
        <Link
          to="/led"
          className="group relative flex flex-col rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md active:scale-95"
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-red-100 text-2xl group-hover:bg-red-500 group-hover:animate-pulse">
            💡
          </div>
          <h2 className="mb-2 text-2xl font-bold text-slate-800">LED Simulator</h2>
          <p className="mb-6 flex-grow text-slate-600">
            Calculate the current-limiting resistor needed for your LEDs to prevent burnout.
          </p>
          <div className="text-sm font-semibold text-red-600">
            Launch Simulator →
          </div>
        </Link>

        {/* LED Simulator 2 Card */}
        <Link
          to="/led2"
          className="group relative flex flex-col rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md active:scale-95"
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-amber-100 text-2xl group-hover:bg-amber-500">
            ⚡
          </div>
          <h2 className="mb-2 text-2xl font-bold text-slate-800">LED Simulator 2.0</h2>
          <p className="mb-6 flex-grow text-slate-600">
            Advanced simulation featuring multi-LED arrays and power dissipation analysis.
          </p>
          <div className="text-sm font-semibold text-amber-600">
            Try v2.0 Beta →
          </div>
        </Link>

        {/* Resistor Guide Card */}
        <Link
          to="/resisters"
          className="group relative flex flex-col rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md active:scale-95"
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-2xl group-hover:bg-blue-500">
            🚥
          </div>
          <h2 className="mb-2 text-2xl font-bold text-slate-800">Resistor Guide</h2>
          <p className="mb-6 flex-grow text-slate-600">
            Decode 4-band and 5-band resistor color codes or calculate series/parallel values.
          </p>
          <div className="text-sm font-semibold text-blue-600">
            Open Calculator →
          </div>
        </Link>

        {/* Practice / Lab Exercises Card - NEW */}
        <Link
          to="/practice"
          className="group relative flex flex-col rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md active:scale-95"
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 text-2xl group-hover:bg-green-500">
            🛠️
          </div>
          <h2 className="mb-2 text-2xl font-bold text-slate-800">Practice & Labs</h2>
          <p className="mb-6 flex-grow text-slate-600">
            Hands-on exercises, circuit challenges, and lab simulations to build your skills.
          </p>
          <div className="text-sm font-semibold text-green-600">
            Start Practicing →
          </div>
        </Link>
      </main>

      {/* Simple Footer */}
      <footer className="mt-16 text-center text-sm text-slate-400">
        © {new Date().getFullYear()} Electronic Tools Inc.
      </footer>
    </div>
  );
};

export default Home;