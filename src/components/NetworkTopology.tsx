import React from 'react';
import { useSimulation } from '../context/SimulationContext';
import { Server, Wifi, Shield, AlertTriangle } from 'lucide-react';

const NetworkTopology: React.FC = () => {
  const { state } = useSimulation();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'border-emerald-400 bg-emerald-900';
      case 'compromised':
        return 'border-red-400 bg-red-900';
      case 'offline':
        return 'border-gray-400 bg-gray-900';
      default:
        return 'border-gray-400 bg-gray-900';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <Server className="h-6 w-6 text-emerald-400" />;
      case 'compromised':
        return <AlertTriangle className="h-6 w-6 text-red-400" />;
      case 'offline':
        return <Server className="h-6 w-6 text-gray-400" />;
      default:
        return <Server className="h-6 w-6 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h2 className="text-xl font-bold mb-4 text-white flex items-center space-x-2">
          <Wifi className="h-6 w-6 text-emerald-400" />
          <span>Network Topology</span>
        </h2>
        
        {/* Network Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-900 rounded-lg p-4">
            <h3 className="font-medium text-emerald-400 mb-2">Network Segment</h3>
            <p className="text-white">192.168.1.0/24</p>
            <p className="text-sm text-slate-400">Internal Corporate Network</p>
          </div>
          <div className="bg-slate-900 rounded-lg p-4">
            <h3 className="font-medium text-emerald-400 mb-2">Total Hosts</h3>
            <p className="text-white text-2xl font-bold">{state.targets.length}</p>
            <p className="text-sm text-slate-400">Simulated Targets</p>
          </div>
          <div className="bg-slate-900 rounded-lg p-4">
            <h3 className="font-medium text-emerald-400 mb-2">Security Status</h3>
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-red-400" />
              <p className="text-white">
                {state.targets.filter(t => t.status === 'compromised').length} Compromised
              </p>
            </div>
          </div>
        </div>

        {/* Network Diagram */}
        <div className="bg-slate-900 rounded-lg p-8">
          <h3 className="text-lg font-medium mb-6 text-emerald-400">Simulated Network Layout</h3>
          
          {/* Internet/Gateway */}
          <div className="flex flex-col items-center space-y-8">
            <div className="flex items-center justify-center w-32 h-16 bg-blue-900 border-2 border-blue-400 rounded-lg">
              <div className="text-center">
                <Wifi className="h-6 w-6 text-blue-400 mx-auto mb-1" />
                <p className="text-xs text-blue-400 font-medium">INTERNET</p>
              </div>
            </div>
            
            {/* Connection Line */}
            <div className="w-1 h-8 bg-slate-600"></div>
            
            {/* Firewall/Router */}
            <div className="flex items-center justify-center w-32 h-16 bg-orange-900 border-2 border-orange-400 rounded-lg">
              <div className="text-center">
                <Shield className="h-6 w-6 text-orange-400 mx-auto mb-1" />
                <p className="text-xs text-orange-400 font-medium">FIREWALL</p>
              </div>
            </div>
            
            {/* Connection Line */}
            <div className="w-1 h-8 bg-slate-600"></div>
            
            {/* Internal Network Switch */}
            <div className="flex items-center justify-center w-32 h-16 bg-purple-900 border-2 border-purple-400 rounded-lg">
              <div className="text-center">
                <Wifi className="h-6 w-6 text-purple-400 mx-auto mb-1" />
                <p className="text-xs text-purple-400 font-medium">SWITCH</p>
                <p className="text-xs text-purple-300">192.168.1.1</p>
              </div>
            </div>
            
            {/* Connection Lines to Targets */}
            <div className="flex space-x-16">
              {state.targets.map((target, index) => (
                <div key={target.id} className="flex flex-col items-center">
                  <div className="w-1 h-8 bg-slate-600 mb-4"></div>
                  
                  {/* Target Node */}
                  <div className={`relative w-40 h-32 border-2 rounded-lg p-4 ${getStatusColor(target.status)}`}>
                    <div className="flex items-center justify-between mb-2">
                      {getStatusIcon(target.status)}
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        target.status === 'online' 
                          ? 'bg-emerald-800 text-emerald-400' 
                          : target.status === 'compromised'
                          ? 'bg-red-800 text-red-400'
                          : 'bg-gray-800 text-gray-400'
                      }`}>
                        {target.status.toUpperCase()}
                      </span>
                    </div>
                    
                    <h4 className="text-white text-sm font-medium mb-1">{target.name}</h4>
                    <p className="text-xs text-slate-300 mb-1">{target.ip}</p>
                    <p className="text-xs text-slate-400">{target.os}</p>
                    
                    <div className="absolute bottom-2 right-2">
                      <div className="flex space-x-1">
                        {target.services.slice(0, 3).map((service) => (
                          <div
                            key={service.port}
                            className="w-2 h-2 bg-emerald-400 rounded-full"
                            title={`Port ${service.port} - ${service.name}`}
                          ></div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Attack Indicator */}
                    {state.attackSteps.some(step => step.target.includes(target.name)) && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                        <span className="text-xs text-white font-bold">!</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Target Information */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {state.targets.map((target) => (
          <div key={target.id} className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-white">{target.name}</h3>
              <span className={`text-sm px-2 py-1 rounded-full font-medium ${
                target.status === 'online' 
                  ? 'bg-emerald-900 text-emerald-400' 
                  : target.status === 'compromised'
                  ? 'bg-red-900 text-red-400'
                  : 'bg-gray-900 text-gray-400'
              }`}>
                {target.status.toUpperCase()}
              </span>
            </div>
            
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-slate-400">IP Address:</p>
                <p className="text-white font-mono">{target.ip}</p>
              </div>
              
              <div>
                <p className="text-slate-400">Operating System:</p>
                <p className="text-white">{target.os}</p>
              </div>
              
              <div>
                <p className="text-slate-400">Open Ports:</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {target.services.map((service) => (
                    <span
                      key={service.port}
                      className="text-xs px-2 py-1 bg-slate-900 text-emerald-400 rounded-full font-mono"
                    >
                      {service.port}/{service.name}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <p className="text-slate-400">Vulnerabilities:</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {target.vulnerabilities.map((vuln) => (
                    <span
                      key={vuln.id}
                      className={`text-xs px-2 py-1 rounded-full font-medium ${
                        vuln.severity === 'critical' 
                          ? 'bg-red-900 text-red-400'
                          : vuln.severity === 'high'
                          ? 'bg-orange-900 text-orange-400'
                          : vuln.severity === 'medium'
                          ? 'bg-yellow-900 text-yellow-400'
                          : 'bg-blue-900 text-blue-400'
                      }`}
                    >
                      {vuln.severity.toUpperCase()}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Recent Attack Activity */}
              {state.attackSteps.filter(step => step.target.includes(target.name)).length > 0 && (
                <div>
                  <p className="text-slate-400">Recent Activity:</p>
                  <div className="text-xs text-red-400 mt-1">
                    {state.attackSteps.filter(step => step.target.includes(target.name)).length} attack steps detected
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NetworkTopology;