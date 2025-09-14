import React from 'react';
import { useSimulation } from '../context/SimulationContext';
import { Shield, Server, AlertTriangle, Target } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { state } = useSimulation();

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-red-400';
      case 'high':
        return 'text-orange-400';
      case 'medium':
        return 'text-yellow-400';
      case 'low':
        return 'text-blue-400';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'text-emerald-400';
      case 'compromised':
        return 'text-red-400';
      case 'offline':
        return 'text-gray-400';
      default:
        return 'text-gray-400';
    }
  };

  const stats = {
    totalTargets: state.targets.length,
    compromisedTargets: state.targets.filter(t => t.status === 'compromised').length,
    totalVulnerabilities: state.targets.reduce((acc, t) => acc + t.vulnerabilities.length, 0),
    attackSteps: state.attackSteps.length,
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Total Targets</p>
              <p className="text-2xl font-bold text-white">{stats.totalTargets}</p>
            </div>
            <Target className="h-8 w-8 text-blue-400" />
          </div>
        </div>

        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Compromised</p>
              <p className="text-2xl font-bold text-red-400">{stats.compromisedTargets}</p>
            </div>
            <Shield className="h-8 w-8 text-red-400" />
          </div>
        </div>

        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Vulnerabilities</p>
              <p className="text-2xl font-bold text-orange-400">{stats.totalVulnerabilities}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-orange-400" />
          </div>
        </div>

        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Attack Steps</p>
              <p className="text-2xl font-bold text-emerald-400">{stats.attackSteps}</p>
            </div>
            <Server className="h-8 w-8 text-emerald-400" />
          </div>
        </div>
      </div>

      {/* Current Status */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h2 className="text-xl font-bold mb-4 text-white">Current Simulation Status</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-3 text-emerald-400">Current Phase</h3>
            <div className="bg-slate-900 rounded-lg p-4">
              <p className="text-lg font-medium text-white capitalize">{state.currentPhase}</p>
              <p className="text-sm text-slate-400 mt-1">
                AI is currently executing {state.currentPhase} activities
              </p>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-3 text-emerald-400">Simulation Status</h3>
            <div className="bg-slate-900 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <div className={`h-3 w-3 rounded-full ${state.isRunning ? 'bg-emerald-400 animate-pulse' : 'bg-gray-400'}`}></div>
                <p className="text-lg font-medium text-white">
                  {state.isRunning ? 'Active' : 'Paused'}
                </p>
              </div>
              <p className="text-sm text-slate-400 mt-1">
                {state.isRunning ? 'AI is actively making decisions' : 'Simulation is paused'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Targets Overview */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h2 className="text-xl font-bold mb-4 text-white">Simulated Targets</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {state.targets.map((target) => (
            <div key={target.id} className="bg-slate-900 rounded-lg p-4 border border-slate-700">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-white">{target.name}</h3>
                <span className={`text-sm font-medium ${getStatusColor(target.status)}`}>
                  {target.status.toUpperCase()}
                </span>
              </div>
              <div className="space-y-2 text-sm">
                <p className="text-slate-400">IP: <span className="text-white">{target.ip}</span></p>
                <p className="text-slate-400">OS: <span className="text-white">{target.os}</span></p>
                <p className="text-slate-400">Services: <span className="text-emerald-400">{target.services.length}</span></p>
                <p className="text-slate-400">
                  Vulnerabilities: 
                  <span className="text-red-400 ml-1">{target.vulnerabilities.length}</span>
                </p>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-700">
                <div className="flex flex-wrap gap-2">
                  {target.vulnerabilities.map((vuln) => (
                    <span
                      key={vuln.id}
                      className={`text-xs px-2 py-1 rounded-full bg-slate-800 ${getSeverityColor(vuln.severity)}`}
                    >
                      {vuln.severity.toUpperCase()}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h2 className="text-xl font-bold mb-4 text-white">Recent Simulation Activity</h2>
        <div className="space-y-3">
          {state.attackSteps.slice(-5).reverse().map((step) => (
            <div key={step.id} className="bg-slate-900 rounded-lg p-4 border border-slate-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`h-3 w-3 rounded-full ${
                    step.result === 'success' ? 'bg-emerald-400' :
                    step.result === 'failure' ? 'bg-red-400' : 'bg-yellow-400'
                  }`}></div>
                  <span className="text-sm font-medium text-white capitalize">{step.phase.replace('_', ' ')}</span>
                  <span className="text-sm text-slate-400">{step.action}</span>
                </div>
                <span className="text-xs text-slate-500">{step.timestamp.toLocaleTimeString()}</span>
              </div>
              <p className="text-sm text-slate-300 mt-2">{step.details}</p>
            </div>
          ))}
          {state.attackSteps.length === 0 && (
            <p className="text-slate-400 text-center py-4">No simulation activity yet. Start a simulation to see AI decisions here.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;