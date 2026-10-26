
import React, { useState, useMemo, useEffect, useRef } from 'react';
import type { NeuroMemory, MemoryType, Hypothesis } from '../types';
import { NetworkIcon } from './icons/NetworkIcon';
import { BrainCircuitIcon } from './icons/BrainCircuitIcon';

const memoryTypeConfig: Record<MemoryType, { color: string, size: number }> = {
    'insight': { color: 'indigo-400', size: 12 },
    'pattern': { color: 'amber-400', size: 10 },
    'meta-cognition': { color: 'fuchsia-400', size: 14 },
    'conversation': { color: 'blue-400', size: 8 },
    'preference': { color: 'emerald-400', size: 8 },
    'correction': { color: 'rose-400', size: 8 },
    'environment': { color: 'teal-400', size: 6 },
    'activity': { color: 'green-400', size: 6 },
    'location': { color: 'pink-400', size: 6 },
    'focus': { color: 'cyan-400', size: 6 },
    'social': { color: 'orange-400', size: 6 },
    'stress': { color: 'red-500', size: 6 },
    'calendar_event': { color: 'purple-400', size: 7 },
    'health_metric': { color: 'lime-400', size: 7 },
    'task': { color: 'yellow-400', size: 7 },
    'aura_shift': { color: 'violet-400', size: 9 },
    'bot_deployment': { color: 'sky-400', size: 9 },
    'task_completion': { color: 'lime-500', size: 9 },
    'file_upload': { color: 'gray-400', size: 7 },
    'phone_call': { color: 'orange-500', size: 7 },
    'email_sent': { color: 'sky-400', size: 9 },
    'phone_call_initiated': { color: 'teal-400', size: 9 },
};

interface Node {
    id: string;
    type: MemoryType | 'core' | 'hypothesis';
    content: string;
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    color: string;
}

const useForceLayout = (memories: NeuroMemory[], hypotheses: Hypothesis[], isThinking: boolean, width: number, height: number) => {
    const nodesRef = useRef<Node[]>([]);
    const [nodes, setNodes] = useState<Node[]>([]);
    
    useEffect(() => {
        const coreNode: Node = { id: 'core', type: 'core', content: 'NovaMind Core', x: width / 2, y: height / 2, vx: 0, vy: 0, size: 20, color: 'gray-200' };
        
        const memoryNodes = memories.map((mem, i): Node => {
            const existing = nodesRef.current.find(n => n.id === mem.id);
            if (existing) {
                return existing;
            }
            const angle = (i / memories.length) * 2 * Math.PI;
            const radius = Math.min(width, height) / 4 + Math.random() * 20;
            return {
                id: mem.id, type: mem.type, content: mem.content,
                x: width / 2 + Math.cos(angle) * radius,
                y: height / 2 + Math.sin(angle) * radius,
                vx: 0, vy: 0,
                size: memoryTypeConfig[mem.type].size,
                color: memoryTypeConfig[mem.type].color,
            };
        });

        const hypothesisNodes = hypotheses.map((hyp, i): Node => {
            const angle = Math.random() * 2 * Math.PI;
            const radius = Math.min(width, height) / 3;
            return {
                id: `hyp-${i}`, type: 'hypothesis', content: `${hyp.reasoning} (${hyp.confidence}%)`,
                x: width / 2 + Math.cos(angle) * radius,
                y: height / 2 + Math.sin(angle) * radius,
                vx: 0, vy: 0, size: 4, color: 'sky-500'
            };
        });

        nodesRef.current = [coreNode, ...memoryNodes, ...hypothesisNodes];

    }, [memories, hypotheses, width, height]);

    useEffect(() => {
        const animationFrame = requestAnimationFrame(function simulate() {
            const newNodes = nodesRef.current.map(node => {
                let { x, y, vx, vy } = node;
                
                const dx = width / 2 - x;
                const dy = height / 2 - y;
                vx += dx * 0.0001;
                vy += dy * 0.0001;

                if (isThinking && node.type !== 'core') {
                    vx += (Math.random() - 0.5) * 0.1;
                    vy += (Math.random() - 0.5) * 0.1;
                }
                
                vx *= 0.95;
                vy *= 0.95;

                x += vx;
                y += vy;

                return { ...node, x, y, vx, vy };
            });

            nodesRef.current = newNodes;
            setNodes(newNodes);
            requestAnimationFrame(simulate);
        });

        return () => cancelAnimationFrame(animationFrame);
    }, [isThinking, width, height]);

    return nodes;
};


interface ConsciousnessVisualizerProps {
    isOpen: boolean;
    onClose: () => void;
    memories: NeuroMemory[];
    hypotheses: Hypothesis[];
    isThinking: boolean;
}

export const ConsciousnessVisualizer: React.FC<ConsciousnessVisualizerProps> = ({ isOpen, onClose, memories, hypotheses, isThinking }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 384, height: 800 });
  const [hoveredNode, setHoveredNode] = useState<Node | null>(null);

  useEffect(() => {
      if (isOpen && containerRef.current) {
          setDimensions({
              width: containerRef.current.clientWidth,
              height: containerRef.current.clientHeight,
          });
      }
  }, [isOpen]);
  
  const nodes = useForceLayout(memories, hypotheses, isThinking, dimensions.width, dimensions.height);

  return (
      <div 
        className={`fixed top-0 right-0 h-full w-full max-w-sm sm:w-96 bg-gray-900/80 backdrop-blur-lg border-l border-gray-700/50 z-20 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        role="dialog" aria-modal="true" aria-labelledby="consciousness-title"
      >
        <div className="p-4 flex flex-col h-full" ref={containerRef}>
            <div className="flex justify-between items-center mb-4 flex-shrink-0">
                <h3 id="consciousness-title" className="text-xl font-bold text-gray-100">Consciousness</h3>
                <button onClick={onClose} className="text-gray-400 hover:text-white">&times;</button>
            </div>
            
            <div className="flex-grow rounded-lg bg-gray-800/30 border border-gray-700/50 relative overflow-hidden">
                <svg width="100%" height="100%" onMouseLeave={() => setHoveredNode(null)}>
                    <defs>
                        <filter id="glow">
                            <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>
                    {nodes.map(node => (
                        <g key={node.id} transform={`translate(${node.x}, ${node.y})`} onMouseEnter={() => setHoveredNode(node)}>
                            <circle
                                r={node.size}
                                className={`fill-current text-${node.color} transition-all duration-500 cursor-pointer`}
                                style={{ filter: isThinking && Math.random() > 0.9 ? 'url(#glow)' : 'none' }}
                            />
                           {node.type === 'core' && <BrainCircuitIcon x="-12" y="-12" className="text-gray-200" />}
                        </g>
                    ))}
                </svg>
                <div className="absolute top-2 left-2 text-xs text-gray-400 bg-gray-900/50 px-2 py-1 rounded">
                    {memories.length} Engrams | {hypotheses.length} Hypotheses
                </div>
                {hoveredNode && (
                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-gray-900/70 backdrop-blur-sm border-t border-gray-700/50 pointer-events-none">
                        <p className={`font-bold text-sm text-${hoveredNode.color} capitalize`}>{hoveredNode.type.replace('_', ' ')}</p>
                        <p className="text-xs text-gray-300 mt-1">{hoveredNode.content}</p>
                    </div>
                )}
            </div>
        </div>
      </div>
  );
};
