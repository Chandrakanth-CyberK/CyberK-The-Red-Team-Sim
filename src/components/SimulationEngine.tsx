import React, { useState, useEffect } from 'react';
import { useSimulation, AttackStep } from '../context/SimulationContext';
import { Play, Pause, RotateCcw, Brain, Zap } from 'lucide-react';

const SimulationEngine: React.FC = () => {
  const { state, dispatch } = useSimulation();
  const [autoMode, setAutoMode] = useState(false);
  const [stepDelay, setStepDelay] = useState(3000);

  // AI Decision Engine - Educational simulation logic
  const generateAIDecision = (): { action: string; phase: string; reasoning: string } => {
    const phases = ['reconnaissance', 'exploitation', 'privilege_escalation', 'lateral_movement', 'persistence'];
    const currentPhaseIndex = phases.indexOf(state.currentPhase);
    
    // Simulate AI decision-making based on current state
    if (state.currentPhase === 'reconnaissance') {
      const onlineTargets = state.targets.filter(t => t.status === 'online');
      if (onlineTargets.length > 0) {
        const target = onlineTargets[Math.floor(Math.random() * onlineTargets.length)];
        return {
          action: `Port scan and service enumeration on ${target.name}`,
          phase: 'reconnaissance',
          reasoning: `AI identified ${target.name} as an accessible target. Gathering information about open services and potential attack vectors.`
        };
      }
    } else if (state.currentPhase === 'exploitation') {
      const vulnerableTargets = state.targets.filter(t => 
        t.status === 'online' && t.vulnerabilities.some(v => v.severity === 'high' || v.severity === 'critical')
      );
      if (vulnerableTargets.length > 0) {
        const target = vulnerableTargets[Math.floor(Math.random() * vulnerableTargets.length)];
        const vuln = target.vulnerabilities.find(v => v.severity === 'high' || v.severity === 'critical');
        return {
          action: `Exploit ${vuln?.cve} on ${target.name}`,
          phase: 'exploitation',
          reasoning: `AI detected critical vulnerability ${vuln?.cve} on ${target.name}. Attempting simulated exploitation to gain initial foothold.`
        };
      }
    } else if (state.currentPhase === 'privilege_escalation') {
      const compromisedTargets = state.targets.filter(t => t.status === 'compromised');
      if (compromisedTargets.length > 0) {
        const target = compromisedTargets[Math.floor(Math.random() * compromisedTargets.length)];
        return {
          action: `Local privilege escalation on ${target.name}`,
          phase: 'privilege_escalation',
          reasoning: `AI gained initial access to ${target.name}. Now attempting to escalate privileges to gain administrative control.`
        };
      }
    } else if (state.currentPhase === 'lateral_movement') {
      return {
        action: 'Network discovery and credential harvesting',
        phase: 'lateral_movement',
        reasoning: 'AI is exploring the network topology, looking for additional targets and harvesting credentials for lateral movement.'
      };
    } else if (state.currentPhase === 'persistence') {
      return {
        action: 'Install backdoor and maintain access',
        phase: 'persistence',
        reasoning: 'AI is establishing persistence mechanisms to maintain long-term access to compromised systems.'
      };
    }

    // Default fallback
    return {
      action: 'Analyzing current state and planning next move',
      phase: state.currentPhase,
      reasoning: 'AI is evaluating available options and formulating the optimal attack strategy.'
    };
  };

  const executeSimulationStep = () => {
    const decision = generateAIDecision();
    dispatch({ type: 'SET_AI_DECISION', payload: decision.reasoning });

    // Simulate attack execution with randomized outcomes
    const success = Math.random() > 0.3; // 70% success rate for demonstration
    const result = success ? 'success' : 'failure';

    const attackStep: AttackStep = {
      id: `step-${Date.now()}`,
      timestamp: new Date(),
      phase: decision.phase as any,
      action: decision.action,
      target: 'Simulated Target',
      result: result as any,
      details: `${decision.reasoning} Result: ${result === 'success' ? 'Successful execution' : 'Attack failed, adapting strategy'}`,
      mitreId: `T${Math.floor(Math.random() * 9000) + 1000}`, // Simulated MITRE ID
    };

    dispatch({ type: 'ADD_ATTACK_STEP', payload: attackStep });

    // Update simulation state based on success
    if (success && decision.phase === 'exploitation') {
      const targetToCompromise = state.targets.find(t => t.status === 'online');
      if (targetToCompromise) {
        dispatch({ type: 'UPDATE_TARGET_STATUS', payload: { targetId: targetToCompromise.id, status: 'compromised' } });
        dispatch({ type: 'COMPROMISE_TARGET', payload: targetToCompromise.id });
      }
    }

    // Advance phase after successful steps
    if (success) {
      const phases = ['reconnaissance', 'exploitation', 'privilege_escalation', 'lateral_movement', 'persistence'];
      const currentIndex = phases.indexOf(state.currentPhase);
      if (currentIndex < phases.length - 1) {
        dispatch({ type: 'SET_CURRENT_PHASE', payload: phases[currentIndex + 1] });
      }
    }
  };

  const startSimulation = () => {
    dispatch({ type: 'START_SIMULATION' });
    setAutoMode(true);
  };

  const stopSimulation = () => {
    dispatch({ type: 'STOP_SIMULATION' });
    setAutoMode(false);
  };

  const resetSimulation = () => {
    window.location.reload(); // Simple reset for demo purposes
  };

  // Auto-execution effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (autoMode && state.isRunning) {
      interval = setInterval(() => {
        executeSimulationStep();
      }, stepDelay);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoMode, state.isRunning, stepDelay, state.currentPhase]);

  return (
    <div className="space-y-6">
      {/* Control Panel */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h2 className="text-xl font-bold mb-4 text-white flex items-center space-x-2">
          <Brain className="h-6 w-6 text-emerald-400" />
          <span>AI Simulation Engine</span>
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-3 text-emerald-400">Simulation Controls</h3>
            <div className="space-y-4">
              <div className="flex space-x-3">
                <button
                  onClick={startSimulation}
                  disabled={state.isRunning}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    state.isRunning
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                >
                  <Play className="h-4 w-4" />
                  <span>Start Auto Simulation</span>
                </button>
                
                <button
                  onClick={stopSimulation}
                  disabled={!state.isRunning}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    !state.isRunning
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      : 'bg-red-600 hover:bg-red-700 text-white'
                  }`}
                >
                  <Pause className="h-4 w-4" />
                  <span>Stop Simulation</span>
                </button>
                
                <button
                  onClick={resetSimulation}
                  className="flex items-center space-x-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-medium transition-all duration-200"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>Reset</span>
                </button>
              </div>
              
              <button
                onClick={executeSimulationStep}
                disabled={state.isRunning}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  state.isRunning
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                <Zap className="h-4 w-4" />
                <span>Execute Single Step</span>
              </button>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Auto Step Delay (ms)
                </label>
                <input
                  type="range"
                  min="1000"
                  max="10000"
                  step="500"
                  value={stepDelay}
                  onChange={(e) => setStepDelay(Number(e.target.value))}
                  className="w-full"
                />
                <p className="text-xs text-slate-400 mt-1">{stepDelay}ms between steps</p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-3 text-emerald-400">Current AI State</h3>
            <div className="bg-slate-900 rounded-lg p-4 space-y-3">
              <div>
                <p className="text-sm text-slate-400">Phase:</p>
                <p className="text-lg font-medium text-white capitalize">{state.currentPhase.replace('_', ' ')}</p>
              </div>
              <div>
                <p className="text-sm text-slate-400">Status:</p>
                <div className="flex items-center space-x-2">
                  <div className={`h-2 w-2 rounded-full ${state.isRunning ? 'bg-emerald-400 animate-pulse' : 'bg-gray-400'}`}></div>
                  <p className="text-sm text-white">{state.isRunning ? 'Processing' : 'Idle'}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-slate-400">Compromised Targets:</p>
                <p className="text-lg font-medium text-red-400">{state.compromisedTargets.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Decision Display */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h2 className="text-xl font-bold mb-4 text-white">AI Decision Engine Output</h2>
        <div className="bg-slate-900 rounded-lg p-4 border border-slate-700">
          <div className="flex items-start space-x-3">
            <Brain className="h-6 w-6 text-emerald-400 mt-1 flex-shrink-0" />
            <div>
              <p className="text-emerald-400 font-medium mb-2">Current AI Analysis:</p>
              <p className="text-white leading-relaxed">{state.aiDecision}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Educational Information */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h2 className="text-xl font-bold mb-4 text-white">Educational Context</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-3 text-blue-400">Attack Phases</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-300">Reconnaissance:</span>
                <span className="text-slate-400">Information gathering</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Exploitation:</span>
                <span className="text-slate-400">Initial compromise</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Privilege Escalation:</span>
                <span className="text-slate-400">Gaining higher access</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Lateral Movement:</span>
                <span className="text-slate-400">Expanding access</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Persistence:</span>
                <span className="text-slate-400">Maintaining access</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-3 text-blue-400">AI Decision Logic</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              The AI simulation engine makes decisions based on the current environment state, 
              available vulnerabilities, and the success/failure of previous actions. It follows 
              real-world attack methodologies but executes them in a completely safe, simulated environment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimulationEngine;