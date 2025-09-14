import { useState } from 'react';
import Dashboard from './components/Dashboard';
import SimulationEngine from './components/SimulationEngine';
import AttackTimeline from './components/AttackTimeline';
import NetworkTopology from './components/NetworkTopology';
import ThreatReport from './components/ThreatReport';
import { SimulationProvider } from './context/SimulationContext';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '🛡️' },
    { id: 'simulation', label: 'AI Simulation', icon: '🤖' },
    { id: 'timeline', label: 'Attack Timeline', icon: '⏱️' },
    { id: 'network', label: 'Network Map', icon: '🌐' },
    { id: 'report', label: 'Threat Report', icon: '📊' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'simulation':
        return <SimulationEngine />;
      case 'timeline':
        return <AttackTimeline />;
      case 'network':
        return <NetworkTopology />;
      case 'report':
        return <ThreatReport />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <SimulationProvider>
      <div className="min-h-screen bg-slate-900 text-white">
        {/* Header */}
        <header className="bg-slate-800 border-b border-slate-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-2xl font-bold text-emerald-400">🛡️ CyberK</div>
              <div className="text-sm text-slate-400">
                The Red Team Simulation — v1.0
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-slate-300">Educational Mode</div>
              <div className="h-3 w-3 bg-emerald-400 rounded-full animate-pulse"></div>
            </div>
          </div>
        </header>

        {/* Navigation */}
        <nav className="bg-slate-800 border-b border-slate-700 px-6 py-2">
          <div className="flex space-x-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <span>{tab.icon}</span>
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </nav>

        {/* Content */}
        <main className="p-6">
          {renderContent()}
        </main>

        {/* Disclaimer Footer */}
        <footer className="bg-slate-800 border-t border-slate-700 px-6 py-4 mt-8">
          <div className="text-center text-sm text-slate-400">
            <p className="mb-2 text-yellow-400 font-medium">
              ⚠️ Educational Purposes Only - All Targets and Attacks Are Simulated
            </p>
            <p>
              This simulator demonstrates cybersecurity concepts in a safe environment. 
              Do not attempt to use these techniques against real systems.
            </p>
          </div>
        </footer>
      </div>
    </SimulationProvider>
  );
}

export default App;