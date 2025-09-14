import React from 'react';
import { useSimulation } from '../context/SimulationContext';
import { Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const AttackTimeline: React.FC = () => {
  const { state } = useSimulation();

  const getResultIcon = (result: string) => {
    switch (result) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-emerald-400" />;
      case 'failure':
        return <XCircle className="h-5 w-5 text-red-400" />;
      case 'partial':
        return <AlertCircle className="h-5 w-5 text-yellow-400" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getPhaseColor = (phase: string) => {
    const colors = {
      reconnaissance: 'text-blue-400',
      exploitation: 'text-orange-400',
      privilege_escalation: 'text-purple-400',
      lateral_movement: 'text-pink-400',
      persistence: 'text-red-400',
    };
    return colors[phase as keyof typeof colors] || 'text-gray-400';
  };

  const getPhaseBadgeColor = (phase: string) => {
    const colors = {
      reconnaissance: 'bg-blue-900 border-blue-400',
      exploitation: 'bg-orange-900 border-orange-400',
      privilege_escalation: 'bg-purple-900 border-purple-400',
      lateral_movement: 'bg-pink-900 border-pink-400',
      persistence: 'bg-red-900 border-red-400',
    };
    return colors[phase as keyof typeof colors] || 'bg-gray-900 border-gray-400';
  };

  const groupedSteps = state.attackSteps.reduce((acc, step) => {
    const date = step.timestamp.toDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(step);
    return acc;
  }, {} as Record<string, typeof state.attackSteps>);

  return (
    <div className="space-y-6">
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h2 className="text-xl font-bold mb-4 text-white flex items-center space-x-2">
          <Clock className="h-6 w-6 text-emerald-400" />
          <span>Attack Timeline</span>
        </h2>
        
        {/* Timeline Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-slate-900 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-emerald-400">{state.attackSteps.length}</p>
            <p className="text-sm text-slate-400">Total Steps</p>
          </div>
          <div className="bg-slate-900 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-emerald-400">
              {state.attackSteps.filter(s => s.result === 'success').length}
            </p>
            <p className="text-sm text-slate-400">Successful</p>
          </div>
          <div className="bg-slate-900 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-red-400">
              {state.attackSteps.filter(s => s.result === 'failure').length}
            </p>
            <p className="text-sm text-slate-400">Failed</p>
          </div>
          <div className="bg-slate-900 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-yellow-400">
              {state.attackSteps.filter(s => s.result === 'partial').length}
            </p>
            <p className="text-sm text-slate-400">Partial</p>
          </div>
        </div>

        {/* Phase Progress */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3 text-emerald-400">Attack Phase Progress</h3>
          <div className="bg-slate-900 rounded-lg p-4">
            <div className="flex flex-wrap gap-2">
              {['reconnaissance', 'exploitation', 'privilege_escalation', 'lateral_movement', 'persistence'].map((phase) => {
                const isActive = state.currentPhase === phase;
                const hasSteps = state.attackSteps.some(s => s.phase === phase);
                return (
                  <span
                    key={phase}
                    className={`px-3 py-1 rounded-full text-xs font-medium border ${
                      isActive 
                        ? 'bg-emerald-900 border-emerald-400 text-emerald-400' 
                        : hasSteps
                        ? getPhaseBadgeColor(phase) + ' ' + getPhaseColor(phase)
                        : 'bg-gray-900 border-gray-600 text-gray-400'
                    }`}
                  >
                    {phase.replace('_', ' ').toUpperCase()}
                    {isActive && ' (CURRENT)'}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Timeline Events */}
      <div className="space-y-4">
        {Object.keys(groupedSteps).length === 0 ? (
          <div className="bg-slate-800 rounded-lg p-8 border border-slate-700 text-center">
            <Clock className="h-12 w-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-400 mb-2">No Timeline Events Yet</h3>
            <p className="text-slate-500">Start a simulation to see AI attack steps appear here in real-time.</p>
          </div>
        ) : (
          Object.entries(groupedSteps)
            .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
            .map(([date, steps]) => (
              <div key={date} className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                <h3 className="text-lg font-bold mb-4 text-white">{date}</h3>
                <div className="space-y-4">
                  {steps
                    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
                    .map((step, index) => (
                      <div
                        key={step.id}
                        className="bg-slate-900 rounded-lg p-4 border-l-4 border-slate-600"
                        style={{
                          borderLeftColor: 
                            step.result === 'success' ? '#10B981' :
                            step.result === 'failure' ? '#EF4444' : '#F59E0B'
                        }}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            {getResultIcon(step.result)}
                            <div>
                              <span className={`text-sm font-medium ${getPhaseColor(step.phase)}`}>
                                {step.phase.replace('_', ' ').toUpperCase()}
                              </span>
                              <h4 className="text-white font-medium">{step.action}</h4>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-slate-400">
                              {step.timestamp.toLocaleTimeString()}
                            </p>
                            {step.mitreId && (
                              <p className="text-xs text-blue-400 font-mono">{step.mitreId}</p>
                            )}
                          </div>
                        </div>
                        
                        <p className="text-sm text-slate-300 mb-3">{step.details}</p>
                        
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-400">Target: {step.target}</span>
                          <span className={`px-2 py-1 rounded-full font-medium ${
                            step.result === 'success' 
                              ? 'bg-emerald-900 text-emerald-400' 
                              : step.result === 'failure'
                              ? 'bg-red-900 text-red-400'
                              : 'bg-yellow-900 text-yellow-400'
                          }`}>
                            {step.result.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
};

export default AttackTimeline;