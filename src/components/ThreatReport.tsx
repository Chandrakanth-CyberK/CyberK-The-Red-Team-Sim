import React from 'react';
import { useSimulation } from '../context/SimulationContext';
import { FileText, TrendingUp, Shield, AlertTriangle, Download } from 'lucide-react';

const ThreatReport: React.FC = () => {
  const { state } = useSimulation();

  const generateReport = () => {
    const successfulSteps = state.attackSteps.filter(s => s.result === 'success');
    const failedSteps = state.attackSteps.filter(s => s.result === 'failure');
    const compromisedTargets = state.targets.filter(t => t.status === 'compromised');
    
    const attackPhases = {
      reconnaissance: state.attackSteps.filter(s => s.phase === 'reconnaissance'),
      exploitation: state.attackSteps.filter(s => s.phase === 'exploitation'),
      privilege_escalation: state.attackSteps.filter(s => s.phase === 'privilege_escalation'),
      lateral_movement: state.attackSteps.filter(s => s.phase === 'lateral_movement'),
      persistence: state.attackSteps.filter(s => s.phase === 'persistence'),
    };

    return {
      successfulSteps,
      failedSteps,
      compromisedTargets,
      attackPhases,
      totalVulnerabilities: state.targets.reduce((acc, t) => acc + t.vulnerabilities.length, 0),
      criticalVulns: state.targets.reduce((acc, t) => 
        acc + t.vulnerabilities.filter(v => v.severity === 'critical').length, 0
      ),
      highVulns: state.targets.reduce((acc, t) => 
        acc + t.vulnerabilities.filter(v => v.severity === 'high').length, 0
      ),
    };
  };

  const report = generateReport();

  const downloadReport = () => {
    const reportData = {
      timestamp: new Date().toISOString(),
      summary: {
        totalTargets: state.targets.length,
        compromisedTargets: report.compromisedTargets.length,
        totalAttackSteps: state.attackSteps.length,
        successfulAttacks: report.successfulSteps.length,
        failedAttacks: report.failedSteps.length,
        vulnerabilities: report.totalVulnerabilities,
      },
      attackTimeline: state.attackSteps,
      compromisedAssets: report.compromisedTargets,
      recommendations: [
        "Implement network segmentation to limit lateral movement",
        "Patch critical and high severity vulnerabilities immediately",
        "Deploy endpoint detection and response (EDR) solutions",
        "Enhance monitoring and logging capabilities",
        "Conduct regular security assessments and penetration testing",
      ],
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
  a.download = `cyberk-report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getPhaseStatus = (phase: keyof typeof report.attackPhases) => {
    const steps = report.attackPhases[phase];
    if (steps.length === 0) return 'not-started';
    if (steps.some(s => s.result === 'success')) return 'success';
    if (steps.some(s => s.result === 'partial')) return 'partial';
    return 'failed';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-emerald-400';
      case 'partial':
        return 'text-yellow-400';
      case 'failed':
        return 'text-red-400';
      case 'not-started':
        return 'text-gray-400';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return '✅';
      case 'partial':
        return '⚠️';
      case 'failed':
        return '❌';
      case 'not-started':
        return '⏳';
      default:
        return '⏳';
    }
  };

  const getRiskLevel = () => {
    if (report.compromisedTargets.length > 1 || report.criticalVulns > 0) return 'HIGH';
    if (report.compromisedTargets.length === 1 || report.highVulns > 0) return 'MEDIUM';
    return 'LOW';
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'HIGH':
        return 'text-red-400 bg-red-900';
      case 'MEDIUM':
        return 'text-orange-400 bg-orange-900';
      case 'LOW':
        return 'text-emerald-400 bg-emerald-900';
      default:
        return 'text-gray-400 bg-gray-900';
    }
  };

  return (
    <div className="space-y-6">
      {/* Report Header */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <FileText className="h-6 w-6 text-emerald-400" />
            <span>Cybersecurity Threat Assessment Report</span>
          </h2>
          <button
            onClick={downloadReport}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all duration-200"
          >
            <Download className="h-4 w-4" />
            <span>Download Report</span>
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900 rounded-lg p-4">
            <p className="text-slate-400 text-sm">Report Generated</p>
            <p className="text-white font-medium">{new Date().toLocaleString()}</p>
          </div>
          <div className="bg-slate-900 rounded-lg p-4">
            <p className="text-slate-400 text-sm">Simulation Duration</p>
            <p className="text-white font-medium">
              {state.attackSteps.length > 0 ? `${state.attackSteps.length} Steps` : 'Not Started'}
            </p>
          </div>
          <div className="bg-slate-900 rounded-lg p-4">
            <p className="text-slate-400 text-sm">Overall Risk Level</p>
            <span className={`text-sm px-3 py-1 rounded-full font-medium ${getRiskColor(getRiskLevel())}`}>
              {getRiskLevel()}
            </span>
          </div>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h3 className="text-lg font-bold mb-4 text-emerald-400">Executive Summary</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-slate-900 rounded-lg p-4">
              <h4 className="font-medium text-white mb-2">Attack Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Attack Steps:</span>
                  <span className="text-white font-medium">{state.attackSteps.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Successful Attacks:</span>
                  <span className="text-emerald-400 font-medium">{report.successfulSteps.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Failed Attempts:</span>
                  <span className="text-red-400 font-medium">{report.failedSteps.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Compromised Assets:</span>
                  <span className="text-red-400 font-medium">{report.compromisedTargets.length}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="bg-slate-900 rounded-lg p-4">
              <h4 className="font-medium text-white mb-2">Vulnerability Analysis</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Vulnerabilities:</span>
                  <span className="text-white font-medium">{report.totalVulnerabilities}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Critical Severity:</span>
                  <span className="text-red-400 font-medium">{report.criticalVulns}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">High Severity:</span>
                  <span className="text-orange-400 font-medium">{report.highVulns}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Success Rate:</span>
                  <span className="text-emerald-400 font-medium">
                    {state.attackSteps.length > 0 
                      ? `${Math.round((report.successfulSteps.length / state.attackSteps.length) * 100)}%`
                      : '0%'
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MITRE ATT&CK Mapping */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h3 className="text-lg font-bold mb-4 text-emerald-400">MITRE ATT&CK Framework Analysis</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-white mb-3">Attack Phase Status</h4>
            <div className="space-y-3">
              {Object.entries(report.attackPhases).map(([phase, steps]) => {
                const status = getPhaseStatus(phase as keyof typeof report.attackPhases);
                return (
                  <div key={phase} className="bg-slate-900 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-lg">{getStatusIcon(status)}</span>
                        <span className="text-white font-medium capitalize">
                          {phase.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-medium ${getStatusColor(status)}`}>
                          {status.replace('_', ' ').toUpperCase()}
                        </p>
                        <p className="text-xs text-slate-400">{steps.length} attempts</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-white mb-3">Techniques Observed</h4>
            <div className="bg-slate-900 rounded-lg p-4 space-y-2">
              {state.attackSteps.slice(0, 5).map((step) => (
                <div key={step.id} className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">{step.action}</span>
                  {step.mitreId && (
                    <span className="text-xs text-blue-400 font-mono bg-slate-800 px-2 py-1 rounded">
                      {step.mitreId}
                    </span>
                  )}
                </div>
              ))}
              {state.attackSteps.length === 0 && (
                <p className="text-slate-400 text-sm">No techniques observed yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h3 className="text-lg font-bold mb-4 text-emerald-400 flex items-center space-x-2">
          <Shield className="h-5 w-5" />
          <span>Security Recommendations</span>
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-white mb-3">Immediate Actions</h4>
            <div className="space-y-3">
              <div className="bg-red-900/30 border border-red-700 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-red-400" />
                  <span className="text-red-400 font-medium">Critical Priority</span>
                </div>
                <ul className="text-sm text-slate-300 space-y-1">
                  <li>• Isolate compromised systems immediately</li>
                  <li>• Patch all critical and high severity vulnerabilities</li>
                  <li>• Reset credentials for affected accounts</li>
                </ul>
              </div>
              
              <div className="bg-orange-900/30 border border-orange-700 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-orange-400" />
                  <span className="text-orange-400 font-medium">High Priority</span>
                </div>
                <ul className="text-sm text-slate-300 space-y-1">
                  <li>• Implement network segmentation</li>
                  <li>• Deploy additional monitoring tools</li>
                  <li>• Conduct forensic analysis</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-white mb-3">Long-term Improvements</h4>
            <div className="bg-slate-900 rounded-lg p-4">
              <ul className="text-sm text-slate-300 space-y-2">
                <li className="flex items-start space-x-2">
                  <span className="text-emerald-400 mt-1">•</span>
                  <span>Implement zero-trust architecture principles</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-emerald-400 mt-1">•</span>
                  <span>Regular penetration testing and red team exercises</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-emerald-400 mt-1">•</span>
                  <span>Enhanced employee security awareness training</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-emerald-400 mt-1">•</span>
                  <span>Implement advanced threat detection systems</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-emerald-400 mt-1">•</span>
                  <span>Establish incident response procedures</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-emerald-400 mt-1">•</span>
                  <span>Regular security posture assessments</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Educational Insights */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h3 className="text-lg font-bold mb-4 text-emerald-400">Educational Insights</h3>
        <div className="bg-slate-900 rounded-lg p-4">
          <p className="text-slate-300 leading-relaxed mb-4">
            This simulated attack demonstrates how modern adversaries operate in real-world scenarios. 
            The AI-driven approach showcases the adaptive nature of sophisticated threat actors who 
            continuously assess and modify their tactics based on environmental responses.
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="bg-slate-800 rounded-lg p-4">
              <h4 className="font-medium text-blue-400 mb-2">Key Learning Points</h4>
              <ul className="text-sm text-slate-300 space-y-1">
                <li>• Attack progression methodology</li>
                <li>• Decision-making processes</li>
                <li>• Adaptation to failures</li>
              </ul>
            </div>
            
            <div className="bg-slate-800 rounded-lg p-4">
              <h4 className="font-medium text-blue-400 mb-2">Defense Strategies</h4>
              <ul className="text-sm text-slate-300 space-y-1">
                <li>• Layered security approach</li>
                <li>• Monitoring and detection</li>
                <li>• Incident response planning</li>
              </ul>
            </div>
            
            <div className="bg-slate-800 rounded-lg p-4">
              <h4 className="font-medium text-blue-400 mb-2">Best Practices</h4>
              <ul className="text-sm text-slate-300 space-y-1">
                <li>• Regular vulnerability assessments</li>
                <li>• Security awareness training</li>
                <li>• Continuous improvement</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThreatReport;