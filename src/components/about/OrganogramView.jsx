import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  useReactFlow,
  ReactFlowProvider
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import {
  Download, ZoomIn, ZoomOut, Maximize2, Minimize2, Building2,
  Layers, Image as ImageIcon, X, User, ShieldCheck, ChevronRight,
  Info, AlertCircle, RefreshCw, FileText
} from 'lucide-react';

import OrganogramCustomNode from '../organogram/OrganogramCustomNode';
import OrganogramOfficialPoster from '../organogram/OrganogramOfficialPoster';
import { getLayoutedHierarchy } from '../organogram/organogramLayout';

const nodeTypes = {
  organogramNode: OrganogramCustomNode,
};

function OrganogramFlowContent({
  rawNodes,
  collapsedNodes,
  onToggleCollapse,
  onNodeClick,
  isFullscreen,
  toggleFullscreen
}) {
  const { fitView, zoomIn, zoomOut, getZoom } = useReactFlow();
  const [currentZoom, setCurrentZoom] = useState(1);

  // Compute layout with Dagre
  const { layoutedNodes, layoutedEdges, graphDimensions } = useMemo(() => {
    return getLayoutedHierarchy(rawNodes, collapsedNodes, {
      direction: 'TB',
      nodeSep: 45,
      rankSep: 75
    });
  }, [rawNodes, collapsedNodes]);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Bind layouted elements and attach interactive callbacks to node data
  useEffect(() => {
    const nodesWithCallbacks = layoutedNodes.map(n => ({
      ...n,
      data: {
        ...n.data,
        isEditable: false,
        onToggleCollapse,
        onNodeClick
      }
    }));
    setNodes(nodesWithCallbacks);
    setEdges(layoutedEdges);

    // Automatically fit complete hierarchy into viewport
    const timer = setTimeout(() => {
      fitView({
        padding: 0.15,
        minZoom: 0.25,
        maxZoom: 1.0,
        duration: 400
      });
      setCurrentZoom(getZoom());
    }, 120);

    return () => clearTimeout(timer);
  }, [layoutedNodes, layoutedEdges, fitView, getZoom, onToggleCollapse, onNodeClick, setNodes, setEdges]);

  // Handle container resize when fullscreen changes
  useEffect(() => {
    const timer = setTimeout(() => {
      fitView({
        padding: 0.15,
        minZoom: 0.25,
        maxZoom: 1.0,
        duration: 300
      });
      setCurrentZoom(getZoom());
    }, 200);
    return () => clearTimeout(timer);
  }, [isFullscreen, fitView, getZoom]);

  const handleFitScreen = () => {
    fitView({
      padding: 0.15,
      minZoom: 0.25,
      maxZoom: 1.0,
      duration: 400
    });
    setTimeout(() => setCurrentZoom(getZoom()), 450);
  };

  const handleZoomIn = () => {
    zoomIn({ duration: 250 });
    setTimeout(() => setCurrentZoom(getZoom()), 260);
  };

  const handleZoomOut = () => {
    zoomOut({ duration: 250 });
    setTimeout(() => setCurrentZoom(getZoom()), 260);
  };

  return (
    <div className="w-full h-full relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        minZoom={0.2}
        maxZoom={1.8}
        defaultViewport={{ x: 0, y: 0, zoom: 0.85 }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={true}
        fitViewOptions={{ padding: 0.15 }}
        proOptions={{ hideAttribution: true }}
        className="bg-[#FAFAFA]"
      >
        <Background color="#CBD5E1" gap={24} size={1} />
      </ReactFlow>

      {/* Floating HUD Controls: Zoom, Fit, Fullscreen */}
      <div className="absolute top-4 right-4 z-20 flex items-center bg-white/95 backdrop-blur-md rounded-xl border border-slate-300 shadow-md p-1 space-x-1">
        <button
          type="button"
          onClick={handleZoomOut}
          className="p-1.5 text-slate-700 hover:text-[#0B1F4E] hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>

        <span className="text-xs font-mono font-bold text-slate-700 px-2 min-w-[50px] text-center select-none">
          {Math.round(currentZoom * 100)}%
        </span>

        <button
          type="button"
          onClick={handleZoomIn}
          className="p-1.5 text-slate-700 hover:text-[#0B1F4E] hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-slate-300 mx-0.5" />

        <button
          type="button"
          onClick={handleFitScreen}
          className="px-2.5 py-1 text-xs font-semibold text-[#0B1F4E] hover:bg-slate-100 rounded-lg cursor-pointer transition-colors flex items-center space-x-1"
          title="Fit Complete Chart to Viewport"
        >
          <Maximize2 className="w-3.5 h-3.5 text-[#C9A84C]" />
          <span className="hidden sm:inline">Fit to Screen</span>
        </button>

        <div className="w-px h-5 bg-slate-300 mx-0.5" />

        <button
          type="button"
          onClick={toggleFullscreen}
          className="p-1.5 text-[#0B1F4E] hover:bg-[#0B1F4E] hover:text-white rounded-lg cursor-pointer transition-colors flex items-center space-x-1"
          title={isFullscreen ? "Exit Fullscreen (Esc)" : "Enter Genuine Fullscreen"}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4 text-[#C9A84C]" /> : <Maximize2 className="w-4 h-4 text-[#C9A84C]" />}
          <span className="text-xs font-semibold hidden md:inline">{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</span>
        </button>
      </div>

      {/* Helpful Hint HUD (Bottom Left) */}
      <div className="absolute bottom-3 left-4 z-20 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-300 text-[11px] text-slate-600 shadow-2xs pointer-events-none flex items-center space-x-2">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span>Click any node to view official duties &amp; jurisdiction &bull; Drag canvas to pan</span>
      </div>
    </div>
  );
}

export default function OrganogramView() {
  const [organogramData, setOrganogramData] = useState(null);
  const [rawNodes, setRawNodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeTab, setActiveTab] = useState('poster'); // 'poster' | 'chart'
  const [selectedNode, setSelectedNode] = useState(null);
  const [collapsedNodes, setCollapsedNodes] = useState(new Set());
  const [showPosterModal, setShowPosterModal] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const workspaceRef = useRef(null);

  // Load published organogram from authoritative backend
  const fetchPublishedData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/v1/organogram/published');
      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }
      const json = await res.json();
      if (json && json.success && json.data) {
        setOrganogramData(json.data);
        setRawNodes(json.data.nodes || []);
      } else {
        throw new Error(json.message || 'Invalid organogram data structure.');
      }
    } catch (err) {
      console.error('Failed to load published organogram:', err);
      setError(err.message || 'Could not load official organogram from the college server.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPublishedData();
  }, [fetchPublishedData]);

  // Fullscreen Change Event Listeners & Handlers
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
      );
      setIsFullscreen(isCurrentlyFullscreen);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = () => {
    if (!workspaceRef.current) return;

    if (!isFullscreen) {
      const el = workspaceRef.current;
      if (el.requestFullscreen) {
        el.requestFullscreen();
      } else if (el.webkitRequestFullscreen) {
        el.webkitRequestFullscreen();
      } else if (el.mozRequestFullScreen) {
        el.mozRequestFullScreen();
      } else if (el.msRequestFullscreen) {
        el.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  };

  // Toggle Branch Collapse
  const handleToggleCollapse = useCallback((nodeId) => {
    setCollapsedNodes(prev => {
      const next = new Set(prev);
      if (next.has(nodeId)) next.delete(nodeId);
      else next.add(nodeId);
      return next;
    });
  }, []);

  // Node Click: Open Details Panel
  const handleNodeClick = useCallback((nodeData) => {
    setSelectedNode(nodeData);
  }, []);

  // Download High-Resolution Vector/Canvas PNG
  const handleDownloadPNG = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 2400;
    canvas.height = 1500;
    const ctx = canvas.getContext('2d');

    // Clean neutral background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Title Banner
    ctx.fillStyle = '#0B1F4E';
    ctx.font = 'bold 36px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText("ST. PHILOMENA'S COLLEGE (AUTONOMOUS), MYSURU", canvas.width / 2, 70);

    ctx.fillStyle = '#058270';
    ctx.font = 'bold 22px sans-serif';
    ctx.fillText("College Administrative & Academic Organogram", canvas.width / 2, 110);

    ctx.fillStyle = '#64748B';
    ctx.font = 'normal 15px sans-serif';
    ctx.fillText(`Official Published Baseline (v${organogramData?.version?.version_number || '1.0'})`, canvas.width / 2, 140);

    // Generate Layout for all nodes
    const { layoutedNodes, layoutedEdges } = getLayoutedHierarchy(rawNodes, new Set(), {
      direction: 'TB',
      nodeSep: 40,
      rankSep: 70
    });

    // Find bounding box to scale onto export canvas
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    layoutedNodes.forEach(n => {
      if (n.position.x < minX) minX = n.position.x;
      if (n.position.x > maxX) maxX = n.position.x;
      if (n.position.y < minY) minY = n.position.y;
      if (n.position.y > maxY) maxY = n.position.y;
    });

    const graphW = (maxX - minX) + 320;
    const graphH = (maxY - minY) + 160;
    const scale = Math.min((canvas.width - 120) / graphW, (canvas.height - 240) / graphH);
    const offsetX = (canvas.width - graphW * scale) / 2 - minX * scale;
    const offsetY = 200 - minY * scale;

    // Draw Connectors
    ctx.strokeStyle = '#64748B';
    ctx.lineWidth = 2.5;
    layoutedEdges.forEach(edge => {
      const sNode = layoutedNodes.find(n => n.id === edge.source);
      const tNode = layoutedNodes.find(n => n.id === edge.target);
      if (sNode && tNode) {
        const sx = (sNode.position.x + 130) * scale + offsetX;
        const sy = (sNode.position.y + 92) * scale + offsetY;
        const tx = (tNode.position.x + 130) * scale + offsetX;
        const ty = (tNode.position.y) * scale + offsetY;
        const midY = sy + (ty - sy) / 2;

        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(sx, midY);
        ctx.lineTo(tx, midY);
        ctx.lineTo(tx, ty);
        ctx.stroke();
      }
    });

    // Draw Nodes
    layoutedNodes.forEach(node => {
      const nx = (node.position.x) * scale + offsetX;
      const ny = (node.position.y) * scale + offsetY;
      const nw = 260 * scale;
      const nh = 92 * scale;

      const meta = node.data.node_metadata || {};
      ctx.fillStyle = meta.bg_color || (node.data.parent_id ? '#FFFFFF' : '#0B1F4E');
      ctx.strokeStyle = meta.border_color || '#CBD5E1';
      ctx.lineWidth = 2;

      ctx.beginPath();
      ctx.roundRect(nx, ny, nw, nh, 8);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = meta.text_color || (node.data.parent_id ? '#0B1F4E' : '#FFFFFF');
      ctx.font = `bold ${Math.max(10, 12.5 * scale)}px Georgia, serif`;
      ctx.textAlign = 'center';
      const title = node.data.title.length > 32 ? node.data.title.substring(0, 30) + '...' : node.data.title;
      ctx.fillText(title, nx + nw / 2, ny + nh / 2 - 4);

      if (node.data.designation) {
        ctx.fillStyle = meta.text_color === '#FFFFFF' ? '#E2E8F0' : '#475569';
        ctx.font = `normal ${Math.max(8.5, 10.5 * scale)}px sans-serif`;
        ctx.fillText(node.data.designation, nx + nw / 2, ny + nh / 2 + 14);
      }
    });

    const link = document.createElement('a');
    link.download = `St_Philomenas_College_Organogram_${organogramData?.version?.version_number || 'v1'}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* -----------------------------------------------------------------------
          TOP INSTITUTIONAL HEADER & VIEW CONTROLS
          ----------------------------------------------------------------------- */}
      <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-[#C9A84C]" />
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#a88530]">
              Institutional Governance
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#C9A84C]/15 text-[#8c6c1d] border border-[#C9A84C]/30">
              v{organogramData?.version?.version_number || '1.0'} Published
            </span>
          </div>
          <h2 className="font-serif font-extrabold text-2xl sm:text-3xl text-[#0B1F4E]">
            College Administrative Organogram
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Official organizational hierarchy of St. Philomena's College (Autonomous), Bannimantap, Mysuru.
          </p>
        </div>

        {/* View Actions */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          
          {/* View Tab Switch */}
          <div className="bg-slate-100 p-1 rounded-xl flex items-center space-x-1 border border-slate-200">
            <button
              type="button"
              onClick={() => setActiveTab('poster')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                activeTab === 'poster'
                  ? 'bg-white text-[#0B1F4E] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-[#C9A84C]" />
              <span>Complete Institutional Chart</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('chart')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                activeTab === 'chart'
                  ? 'bg-white text-[#0B1F4E] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-[#058270]" />
              <span>Interactive Graph</span>
            </button>
          </div>

          {/* Fullscreen Button */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className="px-3 py-2 rounded-xl text-xs font-bold bg-[#0B1F4E] hover:bg-[#162e6e] text-white flex items-center space-x-1.5 transition-colors shadow-xs cursor-pointer"
            title={isFullscreen ? "Exit Fullscreen (Esc)" : "Fullscreen View"}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5 text-[#C9A84C]" /> : <Maximize2 className="w-3.5 h-3.5 text-[#C9A84C]" />}
            <span>{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</span>
          </button>
        </div>
      </div>

      {/* -----------------------------------------------------------------------
          1. OFFICIAL INSTITUTIONAL CHART VIEW (FIT-TO-PAGE, ZERO SCROLLING)
          ----------------------------------------------------------------------- */}
      {activeTab === 'poster' && (
        <div
          ref={workspaceRef}
          className={`bg-white border border-slate-200 shadow-sm overflow-hidden flex flex-col transition-all ${
            isFullscreen 
              ? 'fixed inset-0 z-50 rounded-none w-screen h-screen' 
              : 'rounded-2xl h-[780px] w-full'
          }`}
        >
          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center space-y-3">
              <div className="w-10 h-10 border-3 border-[#0B1F4E] border-t-[#C9A84C] rounded-full animate-spin" />
              <p className="text-sm font-semibold text-[#0B1F4E]">Loading official published hierarchy...</p>
            </div>
          ) : error ? (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-3">
              <AlertCircle className="w-10 h-10 text-red-600" />
              <h4 className="font-bold text-red-900 text-base">Failed to Load Organogram</h4>
              <p className="text-xs text-red-700 max-w-md">{error}</p>
              <button
                type="button"
                onClick={fetchPublishedData}
                className="px-4 py-2 bg-[#0B1F4E] text-white rounded-xl text-xs font-bold hover:bg-[#162e6e] flex items-center space-x-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry Connection</span>
              </button>
            </div>
          ) : (
            <OrganogramOfficialPoster
              nodes={rawNodes}
              title={organogramData?.organogram?.title || "St. Philomena's College (Autonomous) Administrative Organogram"}
              version={organogramData?.version?.version_number || "1.2"}
              onNodeClick={handleNodeClick}
              isModal={isFullscreen}
              onClose={isFullscreen ? toggleFullscreen : null}
            />
          )}
        </div>
      )}

      {/* -----------------------------------------------------------------------
          2. INTERACTIVE GRAPH WORKSPACE (REACT FLOW + DAGRE)
          ----------------------------------------------------------------------- */}
      {activeTab === 'chart' && (
        <div
          ref={workspaceRef}
          className={`bg-white border border-slate-200 shadow-sm overflow-hidden flex flex-col transition-all ${
            isFullscreen 
              ? 'fixed inset-0 z-50 rounded-none w-screen h-screen' 
              : 'rounded-2xl h-[700px] w-full'
          }`}
        >
          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center space-y-3">
              <div className="w-10 h-10 border-3 border-[#0B1F4E] border-t-[#C9A84C] rounded-full animate-spin" />
              <p className="text-sm font-semibold text-[#0B1F4E]">Loading official published hierarchy...</p>
            </div>
          ) : error ? (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-3">
              <AlertCircle className="w-10 h-10 text-red-600" />
              <h4 className="font-bold text-red-900 text-base">Failed to Load Organogram</h4>
              <p className="text-xs text-red-700 max-w-md">{error}</p>
              <button
                type="button"
                onClick={fetchPublishedData}
                className="px-4 py-2 bg-[#0B1F4E] text-white rounded-xl text-xs font-bold hover:bg-[#162e6e] flex items-center space-x-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry Connection</span>
              </button>
            </div>
          ) : (
            <ReactFlowProvider>
              <OrganogramFlowContent
                rawNodes={rawNodes}
                collapsedNodes={collapsedNodes}
                onToggleCollapse={handleToggleCollapse}
                onNodeClick={handleNodeClick}
                isFullscreen={isFullscreen}
                toggleFullscreen={toggleFullscreen}
              />
            </ReactFlowProvider>
          )}
        </div>
      )}

      {/* -----------------------------------------------------------------------
          NODE DETAILS SLIDE-OVER MODAL (READ-ONLY)
          ----------------------------------------------------------------------- */}
      {selectedNode && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setSelectedNode(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div className="space-y-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#0B1F4E]/10 text-[#0B1F4E]">
                  {selectedNode.node_type || 'Governance'}
                </span>
                <h3 className="font-serif font-extrabold text-xl text-[#0B1F4E]">
                  {selectedNode.title}
                </h3>
                {selectedNode.designation && (
                  <p className="text-xs text-slate-500 font-medium">
                    {selectedNode.designation}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() => setSelectedNode(null)}
                className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600">
              {selectedNode.person_name && (
                <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl space-y-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 block">
                    Official In-Charge
                  </span>
                  <span className="font-bold text-[#0B1F4E] text-sm">
                    {selectedNode.person_name}
                  </span>
                </div>
              )}

              <div className="space-y-1">
                <span className="font-bold text-slate-800 uppercase tracking-wider text-[10px] block">
                  Mandate &amp; Responsibilities
                </span>
                <p className="text-slate-600 leading-relaxed text-xs">
                  {selectedNode.description || "Official governance portfolio and administrative jurisdiction within the autonomous college structure."}
                </p>
              </div>

              {/* Subordinate Units */}
              {(() => {
                const subs = rawNodes.filter(n => n.parent_id === selectedNode.id);
                if (subs.length === 0) return null;
                return (
                  <div className="pt-2 border-t border-slate-100 space-y-1.5">
                    <span className="font-bold text-slate-800 uppercase tracking-wider text-[10px] block">
                      Direct Subordinate Units &amp; Committees ({subs.length})
                    </span>
                    <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
                      {subs.map(s => (
                        <span key={s.id} className="px-2.5 py-1 bg-slate-100 rounded-lg text-[11px] text-[#0B1F4E] font-medium border border-slate-200">
                          {s.title}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedNode(null)}
                className="px-5 py-2 bg-[#0B1F4E] hover:bg-[#162e6e] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* -----------------------------------------------------------------------
          LIGHTBOX MODAL FOR ARCHIVAL POSTER
          ----------------------------------------------------------------------- */}
      {showPosterModal && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setShowPosterModal(false)}
        >
          <div
            className="relative max-w-6xl max-h-[92vh] bg-white rounded-2xl p-4 overflow-hidden shadow-2xl space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b pb-2 px-2">
              <span className="font-serif font-bold text-base text-[#0B1F4E]">
                Official Archival Organogram - St. Philomena's College (Autonomous)
              </span>
              <button
                type="button"
                onClick={() => setShowPosterModal(false)}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold cursor-pointer"
              >
                ✕ Close
              </button>
            </div>
            
            <div className="overflow-auto max-h-[80vh] p-2">
              <img
                src="/assets/images/about/st_philos_official_organogram.png"
                alt="St. Philomena's College Full Organogram"
                className="w-full h-auto object-contain"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
