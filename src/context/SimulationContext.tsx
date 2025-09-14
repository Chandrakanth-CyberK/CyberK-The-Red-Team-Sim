import React, { createContext, useContext, useReducer, ReactNode } from 'react';

export interface Target {
  id: string;
  name: string;
  ip: string;
  os: string;
  services: Service[];
  status: 'online' | 'compromised' | 'offline';
  vulnerabilities: Vulnerability[];
}

export interface Service {
  port: number;
  name: string;
  version: string;
  status: 'open' | 'closed' | 'filtered';
}

export interface Vulnerability {
  id: string;
  cve: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
}

export interface AttackStep {
  id: string;
  timestamp: Date;
  phase: 'reconnaissance' | 'exploitation' | 'privilege_escalation' | 'lateral_movement' | 'persistence';
  action: string;
  target: string;
  result: 'success' | 'failure' | 'partial';
  details: string;
  mitreId?: string;
}

export interface SimulationState {
  targets: Target[];
  attackSteps: AttackStep[];
  currentPhase: string;
  isRunning: boolean;
  aiDecision: string;
  compromisedTargets: string[];
}

type SimulationAction =
  | { type: 'START_SIMULATION' }
  | { type: 'STOP_SIMULATION' }
  | { type: 'ADD_ATTACK_STEP'; payload: AttackStep }
  | { type: 'UPDATE_TARGET_STATUS'; payload: { targetId: string; status: Target['status'] } }
  | { type: 'SET_AI_DECISION'; payload: string }
  | { type: 'SET_CURRENT_PHASE'; payload: string }
  | { type: 'COMPROMISE_TARGET'; payload: string };

const initialTargets: Target[] = [
  {
    id: 'target-1',
    name: 'Web Server (DMZ)',
    ip: '192.168.1.10',
    os: 'Ubuntu 20.04',
    status: 'online',
    services: [
      { port: 80, name: 'HTTP', version: 'Apache 2.4.41', status: 'open' },
      { port: 443, name: 'HTTPS', version: 'Apache 2.4.41', status: 'open' },
      { port: 22, name: 'SSH', version: 'OpenSSH 8.2', status: 'open' },
    ],
    vulnerabilities: [
      {
        id: 'vuln-1',
        cve: 'CVE-2023-1234',
        severity: 'high',
        description: 'Simulated Apache vulnerability for educational purposes',
      },
    ],
  },
  {
    id: 'target-2',
    name: 'Database Server',
    ip: '192.168.1.20',
    os: 'CentOS 7',
    status: 'online',
    services: [
      { port: 3306, name: 'MySQL', version: '5.7.32', status: 'open' },
      { port: 22, name: 'SSH', version: 'OpenSSH 7.4', status: 'open' },
    ],
    vulnerabilities: [
      {
        id: 'vuln-2',
        cve: 'CVE-2023-5678',
        severity: 'critical',
        description: 'Simulated MySQL privilege escalation vulnerability',
      },
    ],
  },
  {
    id: 'target-3',
    name: 'Domain Controller',
    ip: '192.168.1.5',
    os: 'Windows Server 2019',
    status: 'online',
    services: [
      { port: 389, name: 'LDAP', version: 'Active Directory', status: 'open' },
      { port: 3389, name: 'RDP', version: 'Terminal Services', status: 'open' },
      { port: 445, name: 'SMB', version: 'SMB 3.1.1', status: 'open' },
    ],
    vulnerabilities: [
      {
        id: 'vuln-3',
        cve: 'CVE-2023-9999',
        severity: 'high',
        description: 'Simulated Active Directory vulnerability',
      },
    ],
  },
];

const initialState: SimulationState = {
  targets: initialTargets,
  attackSteps: [],
  currentPhase: 'reconnaissance',
  isRunning: false,
  aiDecision: 'Initializing AI simulation engine...',
  compromisedTargets: [],
};

function simulationReducer(state: SimulationState, action: SimulationAction): SimulationState {
  switch (action.type) {
    case 'START_SIMULATION':
      return { ...state, isRunning: true };
    case 'STOP_SIMULATION':
      return { ...state, isRunning: false };
    case 'ADD_ATTACK_STEP':
      return { ...state, attackSteps: [...state.attackSteps, action.payload] };
    case 'UPDATE_TARGET_STATUS':
      return {
        ...state,
        targets: state.targets.map(target =>
          target.id === action.payload.targetId
            ? { ...target, status: action.payload.status }
            : target
        ),
      };
    case 'SET_AI_DECISION':
      return { ...state, aiDecision: action.payload };
    case 'SET_CURRENT_PHASE':
      return { ...state, currentPhase: action.payload };
    case 'COMPROMISE_TARGET':
      return {
        ...state,
        compromisedTargets: [...state.compromisedTargets, action.payload],
      };
    default:
      return state;
  }
}

const SimulationContext = createContext<{
  state: SimulationState;
  dispatch: React.Dispatch<SimulationAction>;
} | null>(null);

export function SimulationProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(simulationReducer, initialState);

  return (
    <SimulationContext.Provider value={{ state, dispatch }}>
      {children}
    </SimulationContext.Provider>
  );
}

export function useSimulation() {
  const context = useContext(SimulationContext);
  if (!context) {
    throw new Error('useSimulation must be used within a SimulationProvider');
  }
  return context;
}