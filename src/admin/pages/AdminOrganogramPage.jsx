import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  useReactFlow,
  ReactFlowProvider,
  addEdge
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import {
  ArrowLeft, Save, Upload, RotateCcw, RotateCw, ZoomIn, ZoomOut,
  Maximize2, Minimize2, Eye, EyeOff, Plus, Trash2, Edit3, Check,
  AlertCircle, Copy, ChevronRight, ChevronDown, Download, History,
  Layout, Settings2, ShieldCheck, Sparkles, Layers, Search, Move,
  FolderTree, GitCommit, FileText, X, CheckCircle2, ChevronLeft,
  User, PanelLeftClose, PanelLeftOpen, PanelRightClose, PanelRightOpen
} from 'lucide-react';

import api from '../../lib/api';
import { useAuth } from '../../lib/authContext';
import OrganogramCustomNode from '../../components/organogram/OrganogramCustomNode';
import OrganogramOfficialPoster from '../../components/organogram/OrganogramOfficialPoster';
import { getLayoutedHierarchy, wouldCauseCycle, NODE_WIDTH, NODE_HEIGHT } from '../../components/organogram/organogramLayout';

const nodeTypes = {
  organogramNode: OrganogramCustomNode,
};

// Node classification categories
const NODE_CATEGORIES = [
  { id: 'governance', label: 'Governance & Apex', badge: 'Apex Body' },
  { id: 'executive', label: 'Executive Leadership', badge: 'Leadership' },
  { id: 'academic', label: 'Academic & Faculties', badge: 'Academics' },
  { id: 'administrative', label: 'Campus & Admin', badge: 'Administration' },
  { id: 'examination', label: 'Examination & Evaluation', badge: 'Examination' },
  { id: 'committee', label: 'Statutory Committee / Cell', badge: 'Statutory' },
  { id: 'hostel', label: 'Student Hostels & Welfare', badge: 'Student Welfare' },
  { id: 'support', label: 'Support & Infrastructure', badge: 'Campus Support' }
];

function AdminOrganogramFlow({
  rawNodes,
  collapsedNodes,
  selectedNodeId,
  previewMode,
  layoutDirection,
  nodeSep,
  rankSep,
  onNodeSelect,
  onAddChild,
  onEditNode,
  onDeleteNode,
  onToggleCollapse,
  onReparentNode,
  onNodesUpdated,
  isFullscreen,
  toggleFullscreen
}) {
  const { fitView, zoomIn, zoomOut, getZoom, setCenter } = useReactFlow();
  const [currentZoom, setCurrentZoom] = useState(1);

  // Compute Dagre layout
  const { layoutedNodes, layoutedEdges } = useMemo(() => {
    return getLayoutedHierarchy(rawNodes, collapsedNodes, {
      direction: layoutDirection,
      nodeSep,
      rankSep
    });
  }, [rawNodes, collapsedNodes, layoutDirection, nodeSep, rankSep]);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Bind layouted elements and callbacks
  useEffect(() => {
    const enrichedNodes = layoutedNodes.map(n => ({
      ...n,
      selected: n.id === selectedNodeId,
      data: {
        ...n.data,
        isEditable: !previewMode,
        onToggleCollapse,
        onNodeClick: (nodeData) => onNodeSelect(nodeData.id),
        onAddChild,
        onEdit: onEditNode,
        onDelete: onDeleteNode
      }
    }));
    setNodes(enrichedNodes);
    setEdges(layoutedEdges);
  }, [
    layoutedNodes,
    layoutedEdges,
    selectedNodeId,
    previewMode,
    onToggleCollapse,
    onNodeSelect,
    onAddChild,
    onEditNode,
    onDeleteNode,
    setNodes,
    setEdges
  ]);

  // Initial fit view
  useEffect(() => {
    const timer = setTimeout(() => {
      fitView({ padding: 0.18, minZoom: 0.3, maxZoom: 1.0, duration: 350 });
      setCurrentZoom(getZoom());
    }, 150);
    return () => clearTimeout(timer);
  }, [fitView, getZoom]);

  // Drag-and-drop reparenting handler
  const onNodeDragStop = useCallback((event, draggedNode) => {
    if (previewMode) return;

    // Find if the dragged node was dropped on top of another node
    const dropTarget = nodes.find(n => {
      if (n.id === draggedNode.id) return false;
      const dx = Math.abs(n.position.x - draggedNode.position.x);
      const dy = Math.abs(n.position.y - draggedNode.position.y);
      return dx < NODE_WIDTH * 0.75 && dy < NODE_HEIGHT * 0.75;
    });

    if (dropTarget) {
      if (wouldCauseCycle(rawNodes, draggedNode.id, dropTarget.id)) {
        alert('Invalid operation: Cannot make a node the child of its own descendant (circular cycle).');
        return;
      }
      onReparentNode(draggedNode.id, dropTarget.id);
    }
  }, [nodes, rawNodes, previewMode, onReparentNode]);

  const handleFitScreen = () => {
    fitView({ padding: 0.18, minZoom: 0.3, maxZoom: 1.0, duration: 350 });
    setTimeout(() => setCurrentZoom(getZoom()), 380);
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
        onNodeDragStop={onNodeDragStop}
        nodeTypes={nodeTypes}
        minZoom={0.2}
        maxZoom={1.8}
        defaultViewport={{ x: 0, y: 0, zoom: 0.85 }}
        nodesDraggable={!previewMode}
        nodesConnectable={false}
        elementsSelectable={true}
        fitViewOptions={{ padding: 0.18 }}
        proOptions={{ hideAttribution: true }}
        className="bg-[#FAFAFA]"
      >
        <Background color="#CBD5E1" gap={24} size={1} />
      </ReactFlow>

      {/* Floating Canvas Controls: Zoom, Fit to Screen, Fullscreen */}
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
          title="Fit Complete Hierarchy to Viewport"
        >
          <Maximize2 className="w-3.5 h-3.5 text-[#C9A84C]" />
          <span className="hidden sm:inline">Fit to Screen</span>
        </button>

        <div className="w-px h-5 bg-slate-300 mx-0.5" />

        <button
          type="button"
          onClick={toggleFullscreen}
          className="p-1.5 text-[#0B1F4E] hover:bg-[#0B1F4E] hover:text-white rounded-lg cursor-pointer transition-colors flex items-center space-x-1"
          title={isFullscreen ? "Exit Fullscreen (Esc)" : "Expand Editor Fullscreen"}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4 text-[#C9A84C]" /> : <Maximize2 className="w-4 h-4 text-[#C9A84C]" />}
          <span className="text-xs font-semibold hidden md:inline">{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</span>
        </button>
      </div>

      {/* Editor Guide HUD (Bottom Left) */}
      {!previewMode && (
        <div className="absolute bottom-3 left-4 z-20 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-300 text-[11px] text-slate-600 shadow-2xs pointer-events-none flex items-center space-x-2">
          <Move className="w-3.5 h-3.5 text-[#C9A84C]" />
          <span>Drag node onto another to reparent &bull; Click to edit properties &bull; Right-click for context menu</span>
        </div>
      )}
    </div>
  );
}

export default function AdminOrganogramPage() {
  const { user } = useAuth();

  // Core Data
  const [organogram, setOrganogram] = useState(null);
  const [nodes, setNodes] = useState([]);
  const [publishedVersion, setPublishedVersion] = useState(null);
  const [workingVersion, setWorkingVersion] = useState(null);
  const [versionsList, setVersionsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Editor State
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [propertiesOpen, setPropertiesOpen] = useState(true);
  const [activeSidebarTab, setActiveSidebarTab] = useState('tree'); // 'tree' | 'add' | 'layout' | 'history'
  const [previewMode, setPreviewMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [saveStatus, setSaveStatus] = useState('saved'); // 'saved' | 'saving' | 'unsaved' | 'failed'
  const [lastSavedTimestamp, setLastSavedTimestamp] = useState(null);

  // Layout Parameters
  const [layoutDirection, setLayoutDirection] = useState('TB'); // 'TB' | 'LR'
  const [nodeSep, setNodeSep] = useState(45);
  const [rankSep, setRankSep] = useState(75);
  const [collapsedNodes, setCollapsedNodes] = useState(new Set());

  // Undo / Redo Stacks
  const [historyPast, setHistoryPast] = useState([]);
  const [historyFuture, setHistoryFuture] = useState([]);

  // Modals & Fullscreen
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [publishVersionNumber, setPublishVersionNumber] = useState('1.1');
  const [publishChangeSummary, setPublishChangeSummary] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [contextMenu, setContextMenu] = useState(null);
  const editorContainerRef = useRef(null);

  // Load Initial Editor Workspace from Authoritative Laravel Backend
  const loadEditorData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/admin/organogram');
      if (res && res.success && res.data) {
        setOrganogram(res.data.organogram);
        setPublishedVersion(res.data.published_version);
        setWorkingVersion(res.data.working_version);
        setNodes(res.data.nodes || []);
        setSaveStatus('saved');
        setLastSavedTimestamp(new Date());

        // Select root apex node by default
        const root = (res.data.nodes || []).find(n => !n.parent_id);
        if (root) setSelectedNodeId(root.id);

        fetchVersions();
      } else {
        throw new Error(res?.message || 'Invalid server response.');
      }
    } catch (err) {
      console.error('Failed to load organogram editor:', err);
      setError(err?.message || 'Unauthorized or failed to connect to backend.');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchVersions = async () => {
    try {
      const res = await api.get('/admin/organogram/versions');
      if (res && res.success) {
        setVersionsList(res.data || []);
      }
    } catch (err) {
      console.warn('Could not load version history:', err);
    }
  };

  useEffect(() => {
    loadEditorData();
  }, [loadEditorData]);

  // Fullscreen Events Listener
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
    if (!editorContainerRef.current) return;

    if (!isFullscreen) {
      const el = editorContainerRef.current;
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

  // Push State to Undo History
  const pushToHistory = useCallback((currentNodes) => {
    setHistoryPast(prev => [...prev.slice(-25), JSON.parse(JSON.stringify(currentNodes))]);
    setHistoryFuture([]);
    setSaveStatus('unsaved');
  }, []);

  const handleUndo = () => {
    if (historyPast.length === 0) return;
    const previous = historyPast[historyPast.length - 1];
    const newPast = historyPast.slice(0, historyPast.length - 1);
    setHistoryFuture(prev => [JSON.parse(JSON.stringify(nodes)), ...prev]);
    setHistoryPast(newPast);
    setNodes(previous);
    setSaveStatus('unsaved');
  };

  const handleRedo = () => {
    if (historyFuture.length === 0) return;
    const next = historyFuture[0];
    const newFuture = historyFuture.slice(1);
    setHistoryPast(prev => [...prev, JSON.parse(JSON.stringify(nodes))]);
    setHistoryFuture(newFuture);
    setNodes(next);
    setSaveStatus('unsaved');
  };

  // Keyboard Shortcuts (Ctrl+Z, Ctrl+Y, Ctrl+S)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) handleRedo();
        else handleUndo();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        handleRedo();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSaveDraft();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nodes, historyPast, historyFuture]);

  // Selected Node Helper
  const selectedNode = useMemo(() => {
    return nodes.find(n => n.id === selectedNodeId) || null;
  }, [nodes, selectedNodeId]);

  // Save Draft to Real Laravel Backend
  const handleSaveDraft = async () => {
    if (saveStatus === 'saving') return;
    setSaveStatus('saving');
    try {
      const payload = {
        title: organogram?.title || "St. Philomena's College (Autonomous) Administrative Organogram",
        description: organogram?.description || "Official administrative hierarchy",
        layout_settings: {
          direction: layoutDirection,
          nodeSep,
          rankSep
        },
        nodes: nodes
      };

      const res = await api.post('/admin/organogram/draft', payload);
      if (res && res.success) {
        setSaveStatus('saved');
        setLastSavedTimestamp(new Date());
        if (res.data?.version_number) {
          setWorkingVersion(prev => ({
            ...(prev || {}),
            version_number: res.data.version_number
          }));
        }
      } else {
        setSaveStatus('failed');
        alert(res?.message || 'Failed to save draft.');
      }
    } catch (err) {
      console.error('Save draft error:', err);
      setSaveStatus('failed');
      alert(err?.message || 'Network error while saving draft.');
    }
  };

  // Publish New Version to Official College Website
  const handlePublish = async () => {
    if (isPublishing) return;
    setIsPublishing(true);
    try {
      const payload = {
        version_number: publishVersionNumber.trim() || '1.1',
        change_summary: publishChangeSummary.trim() || 'Official institutional organogram release update',
        layout_settings: {
          direction: layoutDirection,
          nodeSep,
          rankSep
        },
        nodes: nodes
      };

      const res = await api.post('/admin/organogram/publish', payload);
      if (res && res.success) {
        setIsPublishModalOpen(false);
        setPublishedVersion(res.data);
        setWorkingVersion(res.data);
        setSaveStatus('saved');
        setLastSavedTimestamp(new Date());
        fetchVersions();
        alert(`Success! Organogram Version ${res.data.version_number} has been published live to the official website.`);
      } else {
        alert(res?.message || 'Failed to publish organogram.');
      }
    } catch (err) {
      console.error('Publish error:', err);
      alert(err?.message || 'Failed to publish organogram.');
    } finally {
      setIsPublishing(false);
    }
  };

  // Restore Historical Version
  const handleRestoreVersion = async (version) => {
    if (!window.confirm(`Restore Version ${version.version_number} into a working draft? Current uncommitted changes will be replaced.`)) return;

    try {
      const res = await api.post(`/admin/organogram/versions/${version.id}/restore`);
      if (res && res.success) {
        await loadEditorData();
        alert(`Version ${version.version_number} restored successfully as your current draft.`);
      } else {
        alert(res?.message || 'Failed to restore version.');
      }
    } catch (err) {
      console.error('Restore error:', err);
      alert(err?.message || 'Could not restore version.');
    }
  };

  // Update Node Field
  const updateNodeField = (nodeId, field, value) => {
    pushToHistory(nodes);
    setNodes(prev => prev.map(n => {
      if (n.id !== nodeId) return n;
      if (field.startsWith('meta.')) {
        const key = field.replace('meta.', '');
        return {
          ...n,
          node_metadata: {
            ...(n.node_metadata || {}),
            [key]: value
          }
        };
      }
      return { ...n, [field]: value };
    }));
  };

  // Reparent Node
  const handleReparentNode = useCallback((nodeId, newParentId) => {
    pushToHistory(nodes);
    setNodes(prev => prev.map(n => {
      if (n.id === nodeId) {
        return { ...n, parent_id: newParentId };
      }
      return n;
    }));
  }, [nodes, pushToHistory]);

  // Add Child Node
  const handleAddChild = useCallback((parentId) => {
    const parent = nodes.find(n => n.id === parentId);
    if (!parent) return;

    pushToHistory(nodes);
    const newId = `node_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;
    const siblingCount = nodes.filter(n => n.parent_id === parentId).length;

    const newNode = {
      id: newId,
      parent_id: parentId,
      title: 'New Unit / Role',
      designation: 'Designation / Officer',
      person_name: null,
      description: 'Responsibilities and institutional purview...',
      node_type: parent.node_type === 'governance' ? 'executive' : 'academic',
      display_order: siblingCount + 1,
      node_metadata: {
        shape: 'rounded',
        badge: 'Sub-Unit'
      }
    };

    setNodes(prev => [...prev, newNode]);
    setSelectedNodeId(newId);
    setPropertiesOpen(true);
  }, [nodes, pushToHistory]);

  // Add Sibling Node
  const handleAddSibling = (nodeId) => {
    const target = nodes.find(n => n.id === nodeId);
    if (!target) return;
    if (!target.parent_id) {
      alert('The Apex Governing Society is the root. Siblings cannot be added at apex level.');
      return;
    }

    pushToHistory(nodes);
    const newId = `node_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;
    const siblingCount = nodes.filter(n => n.parent_id === target.parent_id).length;

    const newNode = {
      id: newId,
      parent_id: target.parent_id,
      title: `${target.title} (New)`,
      designation: target.designation || 'Officer',
      person_name: null,
      description: '',
      node_type: target.node_type,
      display_order: siblingCount + 1,
      node_metadata: {
        shape: 'rounded',
        badge: 'Unit'
      }
    };

    setNodes(prev => [...prev, newNode]);
    setSelectedNodeId(newId);
    setPropertiesOpen(true);
  };

  // Delete Node (Safeguarded)
  const handleDeleteNode = useCallback((nodeId) => {
    const target = nodes.find(n => n.id === nodeId);
    if (!target) return;

    if (!target.parent_id) {
      alert('The Apex Governing Society is the root institution node and cannot be deleted.');
      return;
    }

    const children = nodes.filter(n => n.parent_id === nodeId);
    let confirmMsg = `Are you sure you want to delete "${target.title}"?`;
    if (children.length > 0) {
      confirmMsg += `\n\nThis node has ${children.length} direct subordinate units. They will be re-assigned to "${nodes.find(n => n.id === target.parent_id)?.title || 'Parent'}".`;
    }

    if (!window.confirm(confirmMsg)) return;

    pushToHistory(nodes);

    setNodes(prev => {
      return prev
        .filter(n => n.id !== nodeId)
        .map(n => {
          if (n.parent_id === nodeId) {
            return { ...n, parent_id: target.parent_id };
          }
          return n;
        });
    });

    setSelectedNodeId(target.parent_id);
  }, [nodes, pushToHistory]);

  // Toggle Collapse Branch
  const handleToggleCollapse = useCallback((nodeId) => {
    setCollapsedNodes(prev => {
      const next = new Set(prev);
      if (next.has(nodeId)) next.delete(nodeId);
      else next.add(nodeId);
      return next;
    });
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] space-y-3">
        <div className="w-10 h-10 border-3 border-[#0B1F4E] border-t-[#C9A84C] rounded-full animate-spin" />
        <p className="text-sm font-semibold text-[#0B1F4E]">Loading Organogram Studio...</p>
        <span className="text-xs text-slate-500">Connecting to authoritative institutional database</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 bg-red-50 border border-red-200 rounded-2xl text-center space-y-4">
        <AlertCircle className="w-10 h-10 text-red-600 mx-auto" />
        <h3 className="text-lg font-bold text-red-900">Access Denied or Server Error</h3>
        <p className="text-xs text-red-700">{error}</p>
        <div className="pt-2 flex justify-center space-x-3">
          <Link to="/admin" className="px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold hover:bg-slate-900">
            Return to Dashboard
          </Link>
          <button onClick={loadEditorData} className="px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700">
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  // Standalone Image-Style Institutional Preview Mode (Matching Screenshot 2)
  if (previewMode) {
    return createPortal(
      <div className="fixed inset-0 z-[999999] bg-white flex flex-col overflow-hidden w-screen h-screen">
        <OrganogramOfficialPoster
          nodes={nodes}
          title={organogram?.title || "St. Philomena's College (Autonomous) Administrative Organogram"}
          version={workingVersion?.version_number || "1.2"}
          onClose={() => setPreviewMode(false)}
          onNodeClick={(clickedNode) => {
            setSelectedNodeId(clickedNode.id);
            setPreviewMode(false);
            setPropertiesOpen(true);
          }}
        />
      </div>,
      document.body
    );
  }

  return (
    <div
      ref={editorContainerRef}
      className={`flex flex-col bg-[#F8FAFC] text-slate-800 font-sans select-none overflow-hidden ${
        isFullscreen
          ? 'fixed inset-0 z-50 w-screen h-screen m-0 rounded-none'
          : 'h-[calc(100vh-105px)] -m-4 sm:-m-6 lg:-m-8 xl:-m-9 rounded-2xl border border-slate-300 shadow-sm'
      }`}
    >
      
      {/* =========================================================================
          1. TOP ENTERPRISE TOOLBAR
          ========================================================================= */}
      <header className="h-14 bg-[#0B1F4E] text-white px-4 flex items-center justify-between z-30 shrink-0 border-b border-[#04122F]">
        
        {/* Left: Back + Title + Live Status */}
        <div className="flex items-center space-x-3 min-w-0">
          <Link
            to="/admin"
            className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            title="Return to Admin Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <div className="h-5 w-px bg-white/20 hidden sm:block" />

          {/* Title */}
          <div className="flex items-center space-x-2 truncate">
            <span className="font-serif font-bold text-sm text-white truncate max-w-[240px] sm:max-w-sm">
              {organogram?.title || "Administrative Organogram"}
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#C9A84C]/25 text-[#F5D77F] border border-[#C9A84C]/40">
              v{workingVersion?.version_number || '1.0-draft'}
            </span>
          </div>

          {/* Live Status Badge */}
          <div className="hidden lg:flex items-center space-x-1 text-xs pl-2">
            {saveStatus === 'saved' && (
              <span className="flex items-center text-emerald-400 text-[11px] font-medium space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Saved</span>
                {lastSavedTimestamp && (
                  <span className="text-[10px] text-white/50">({lastSavedTimestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})</span>
                )}
              </span>
            )}
            {saveStatus === 'saving' && (
              <span className="flex items-center text-sky-300 text-[11px] font-medium space-x-1">
                <span className="w-2.5 h-2.5 border-2 border-sky-300 border-t-transparent rounded-full animate-spin" />
                <span>Saving...</span>
              </span>
            )}
            {saveStatus === 'unsaved' && (
              <span className="flex items-center text-amber-300 text-[11px] font-medium space-x-1">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span>Unsaved changes</span>
              </span>
            )}
            {saveStatus === 'failed' && (
              <span className="flex items-center text-red-300 text-[11px] font-medium space-x-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Save failed</span>
              </span>
            )}
          </div>
        </div>

        {/* Center: Undo / Redo & Viewport Mode */}
        <div className="flex items-center space-x-1">
          <button
            type="button"
            onClick={handleUndo}
            disabled={historyPast.length === 0}
            className={`p-1.5 rounded-lg transition-colors ${
              historyPast.length > 0 ? 'text-white hover:bg-white/10 cursor-pointer' : 'text-white/30 cursor-not-allowed'
            }`}
            title="Undo (Ctrl+Z)"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleRedo}
            disabled={historyFuture.length === 0}
            className={`p-1.5 rounded-lg transition-colors ${
              historyFuture.length > 0 ? 'text-white hover:bg-white/10 cursor-pointer' : 'text-white/30 cursor-not-allowed'
            }`}
            title="Redo (Ctrl+Y)"
          >
            <RotateCw className="w-4 h-4" />
          </button>

          <div className="h-5 w-px bg-white/20 mx-1 hidden sm:block" />

          {/* Preview Mode Toggle */}
          <button
            type="button"
            onClick={() => setPreviewMode(!previewMode)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer ${
              previewMode
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
            title={previewMode ? "Exit Preview" : "Preview Visitor View"}
          >
            {previewMode ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{previewMode ? 'Exit Preview' : 'Preview'}</span>
          </button>
        </div>

        {/* Right: Save Draft & Publish */}
        <div className="flex items-center space-x-2">
          
          {/* Save Draft */}
          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={saveStatus === 'saving'}
            className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-white/15 hover:bg-white/25 text-white flex items-center space-x-1.5 transition-colors cursor-pointer disabled:opacity-50"
            title="Persist working draft to database (Ctrl+S)"
          >
            <Save className="w-3.5 h-3.5 text-[#C9A84C]" />
            <span className="hidden sm:inline">Save Draft</span>
          </button>

          {/* Publish Button */}
          <button
            type="button"
            onClick={() => setIsPublishModalOpen(true)}
            className="px-4 py-1.5 rounded-lg text-xs font-extrabold bg-[#C9A84C] hover:bg-[#d6b75e] text-[#0B1F4E] flex items-center space-x-1.5 transition-colors shadow-sm cursor-pointer"
            title="Publish new immutable version to the live public portal"
          >
            <Upload className="w-3.5 h-3.5 text-[#0B1F4E]" />
            <span>Publish</span>
          </button>

        </div>
      </header>

      {/* =========================================================================
          2. WORKSPACE BODY: (Collapsible Left + Central Canvas + Collapsible Right)
          ========================================================================= */}
      <div className="flex-1 flex overflow-hidden relative">

        {/* -----------------------------------------------------------------------
            LEFT COLLAPSIBLE SIDEBAR: (Hierarchy Tree, Add, Layout, Versions)
            ----------------------------------------------------------------------- */}
        {!previewMode && (
          <aside className={`bg-white border-r border-slate-300 flex flex-col shrink-0 z-20 transition-all duration-200 ${
            sidebarOpen ? 'w-72 sm:w-80' : 'w-12'
          }`}>
            
            {/* Sidebar Toggle & Header */}
            <div className="p-2 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              {sidebarOpen && (
                <div className="flex items-center space-x-1 text-xs font-bold text-[#0B1F4E]">
                  <FolderTree className="w-4 h-4 text-[#C9A84C]" />
                  <span>Hierarchy Navigator</span>
                </div>
              )}
              <button
                type="button"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-1.5 text-slate-600 hover:text-[#0B1F4E] hover:bg-slate-200 rounded-lg cursor-pointer mx-auto"
                title={sidebarOpen ? "Collapse Panel" : "Expand Panel"}
              >
                {sidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
              </button>
            </div>

            {sidebarOpen && (
              <>
                {/* Tabs */}
                <div className="grid grid-cols-4 border-b border-slate-200 text-[11px] font-bold text-slate-600 bg-slate-50">
                  <button
                    type="button"
                    onClick={() => setActiveSidebarTab('tree')}
                    className={`py-2 text-center transition-colors cursor-pointer ${
                      activeSidebarTab === 'tree' ? 'text-[#0B1F4E] border-b-2 border-[#0B1F4E] bg-white' : 'hover:text-[#0B1F4E]'
                    }`}
                  >
                    Tree
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveSidebarTab('add')}
                    className={`py-2 text-center transition-colors cursor-pointer ${
                      activeSidebarTab === 'add' ? 'text-[#0B1F4E] border-b-2 border-[#0B1F4E] bg-white' : 'hover:text-[#0B1F4E]'
                    }`}
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveSidebarTab('layout')}
                    className={`py-2 text-center transition-colors cursor-pointer ${
                      activeSidebarTab === 'layout' ? 'text-[#0B1F4E] border-b-2 border-[#0B1F4E] bg-white' : 'hover:text-[#0B1F4E]'
                    }`}
                  >
                    Layout
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveSidebarTab('history')}
                    className={`py-2 text-center transition-colors cursor-pointer ${
                      activeSidebarTab === 'history' ? 'text-[#0B1F4E] border-b-2 border-[#0B1F4E] bg-white' : 'hover:text-[#0B1F4E]'
                    }`}
                  >
                    Versions
                  </button>
                </div>

                {/* Tab Body */}
                <div className="flex-1 overflow-y-auto p-3 space-y-3 text-xs">
                  
                  {/* TAB 1: TREE */}
                  {activeSidebarTab === 'tree' && (
                    <div className="space-y-2">
                      <div className="relative">
                        <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search nodes..."
                          className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-8 pr-3 py-1.5 text-xs focus:outline-none focus:border-[#0B1F4E]"
                        />
                      </div>

                      <div className="text-[10px] font-bold uppercase text-slate-500 tracking-wider flex justify-between px-1">
                        <span>Organization Nodes</span>
                        <span>{nodes.length} total</span>
                      </div>

                      <div className="max-h-[calc(100vh-280px)] overflow-y-auto space-y-1 pr-1">
                        {nodes
                          .filter(n => !searchQuery || n.title.toLowerCase().includes(searchQuery.toLowerCase()) || (n.designation && n.designation.toLowerCase().includes(searchQuery.toLowerCase())))
                          .map(n => {
                            const isSelected = n.id === selectedNodeId;
                            return (
                              <div
                                key={n.id}
                                onClick={() => {
                                  setSelectedNodeId(n.id);
                                  setPropertiesOpen(true);
                                }}
                                className={`p-2 rounded-lg cursor-pointer transition-colors border text-left ${
                                  isSelected
                                    ? 'bg-[#0B1F4E] text-white border-[#0B1F4E]'
                                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
                                }`}
                              >
                                <div className="font-bold text-[11px] truncate">{n.title}</div>
                                <div className={`text-[10px] truncate ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                                  {n.designation || n.node_type}
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  )}

                  {/* TAB 2: ADD ELEMENTS */}
                  {activeSidebarTab === 'add' && (
                    <div className="space-y-3">
                      <span className="text-[11px] font-bold text-slate-700 block">Add New Hierarchy Entity</span>

                      <button
                        type="button"
                        onClick={() => handleAddChild(selectedNodeId || nodes[0]?.id)}
                        className="w-full p-2.5 bg-[#0B1F4E] hover:bg-[#162e6e] text-white rounded-xl text-left flex items-center space-x-2 font-bold cursor-pointer"
                      >
                        <Plus className="w-4 h-4 text-[#C9A84C]" />
                        <span>Add Subordinate / Child Node</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleAddSibling(selectedNodeId || nodes[1]?.id)}
                        className="w-full p-2.5 bg-slate-100 hover:bg-slate-200 text-[#0B1F4E] border border-slate-300 rounded-xl text-left flex items-center space-x-2 font-bold cursor-pointer"
                      >
                        <Layers className="w-4 h-4 text-[#058270]" />
                        <span>Add Sibling Node</span>
                      </button>

                      <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 leading-snug">
                        <strong>Selected Parent:</strong> {selectedNode?.title || 'Root'}
                      </div>
                    </div>
                  )}

                  {/* TAB 3: LAYOUT & SPACING */}
                  {activeSidebarTab === 'layout' && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <span className="font-bold text-slate-700 text-xs block">Hierarchy Orientation</span>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setLayoutDirection('TB')}
                            className={`py-2 rounded-lg font-bold border transition-colors cursor-pointer ${
                              layoutDirection === 'TB' ? 'bg-[#0B1F4E] text-white border-[#0B1F4E]' : 'bg-slate-100 text-slate-700 border-slate-300'
                            }`}
                          >
                            Top to Bottom
                          </button>
                          <button
                            type="button"
                            onClick={() => setLayoutDirection('LR')}
                            className={`py-2 rounded-lg font-bold border transition-colors cursor-pointer ${
                              layoutDirection === 'LR' ? 'bg-[#0B1F4E] text-white border-[#0B1F4E]' : 'bg-slate-100 text-slate-700 border-slate-300'
                            }`}
                          >
                            Left to Right
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-semibold text-slate-700">
                          <span>Sibling Spacing:</span>
                          <span className="font-mono">{nodeSep}px</span>
                        </div>
                        <input
                          type="range"
                          min="25"
                          max="80"
                          value={nodeSep}
                          onChange={(e) => setNodeSep(Number(e.target.value))}
                          className="w-full accent-[#0B1F4E]"
                        />
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-semibold text-slate-700">
                          <span>Tier Gap:</span>
                          <span className="font-mono">{rankSep}px</span>
                        </div>
                        <input
                          type="range"
                          min="50"
                          max="120"
                          value={rankSep}
                          onChange={(e) => setRankSep(Number(e.target.value))}
                          className="w-full accent-[#0B1F4E]"
                        />
                      </div>
                    </div>
                  )}

                  {/* TAB 4: VERSION HISTORY */}
                  {activeSidebarTab === 'history' && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-700 text-xs">Version Snapshots</span>
                        <button type="button" onClick={fetchVersions} className="text-[10px] text-[#0B1F4E] font-bold hover:underline cursor-pointer">
                          Refresh
                        </button>
                      </div>

                      <div className="space-y-2 max-h-[calc(100vh-280px)] overflow-y-auto">
                        {versionsList.map(v => (
                          <div key={v.id} className="p-3 bg-white border border-slate-200 rounded-xl space-y-1 text-xs">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-[#0B1F4E]">v{v.version_number}</span>
                              {v.is_current_published ? (
                                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                                  Live Public
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-slate-100 text-slate-600">
                                  {v.status}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-600 line-clamp-2">{v.change_summary || 'Institutional release'}</p>
                            <div className="text-[10px] text-slate-400 flex justify-between pt-1">
                              <span>{v.published_at ? new Date(v.published_at).toLocaleDateString() : 'Draft'}</span>
                              <span>{v.created_by || 'Admin'}</span>
                            </div>
                            {!v.is_current_published && (
                              <button
                                type="button"
                                onClick={() => handleRestoreVersion(v)}
                                className="w-full mt-1.5 py-1 text-center bg-slate-100 hover:bg-[#0B1F4E] hover:text-white rounded-lg text-[10px] font-bold transition-colors cursor-pointer"
                              >
                                Restore to Working Draft
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              </>
            )}
          </aside>
        )}

        {/* -----------------------------------------------------------------------
            CENTRAL ENTERPRISE GRAPH WORKSPACE (REACT FLOW + DAGRE)
            ----------------------------------------------------------------------- */}
        <main className="flex-1 h-full relative overflow-hidden bg-[#FAFAFA]">
          <ReactFlowProvider>
            <AdminOrganogramFlow
              rawNodes={nodes}
              collapsedNodes={collapsedNodes}
              selectedNodeId={selectedNodeId}
              previewMode={previewMode}
              layoutDirection={layoutDirection}
              nodeSep={nodeSep}
              rankSep={rankSep}
              onNodeSelect={(nodeId) => {
                setSelectedNodeId(nodeId);
                setPropertiesOpen(true);
              }}
              onAddChild={handleAddChild}
              onEditNode={(nodeId) => {
                setSelectedNodeId(nodeId);
                setPropertiesOpen(true);
              }}
              onDeleteNode={handleDeleteNode}
              onToggleCollapse={handleToggleCollapse}
              onReparentNode={handleReparentNode}
              onNodesUpdated={(updated) => setNodes(updated)}
              isFullscreen={isFullscreen}
              toggleFullscreen={toggleFullscreen}
            />
          </ReactFlowProvider>
        </main>

        {/* -----------------------------------------------------------------------
            RIGHT COLLAPSIBLE PROPERTIES INSPECTOR
            ----------------------------------------------------------------------- */}
        {!previewMode && selectedNode && propertiesOpen && (
          <aside className="w-80 sm:w-88 bg-white border-l border-slate-300 flex flex-col shrink-0 z-20 overflow-y-auto">
            
            <div className="p-3 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-[#0B1F4E]">
                <Settings2 className="w-4 h-4 text-[#C9A84C]" />
                <span>Node Properties</span>
              </div>
              <button
                type="button"
                onClick={() => setPropertiesOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-800 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-3.5 text-xs">
              
              {/* Title */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700">Entity Title</label>
                <input
                  type="text"
                  value={selectedNode.title || ''}
                  onChange={(e) => updateNodeField(selectedNode.id, 'title', e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-[#0B1F4E] font-semibold focus:outline-none focus:border-[#0B1F4E]"
                />
              </div>

              {/* Designation */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700">Designation / Role Title</label>
                <input
                  type="text"
                  value={selectedNode.designation || ''}
                  onChange={(e) => updateNodeField(selectedNode.id, 'designation', e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-[#0B1F4E]"
                />
              </div>

              {/* Person Name */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700">Person In-Charge (Optional)</label>
                <input
                  type="text"
                  value={selectedNode.person_name || ''}
                  onChange={(e) => updateNodeField(selectedNode.id, 'person_name', e.target.value)}
                  placeholder="e.g. Dr. Ravi J.D. Saldanha"
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-[#0B1F4E]"
                />
              </div>

              {/* Category */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700">Classification Tier</label>
                <select
                  value={selectedNode.node_type || 'academic'}
                  onChange={(e) => updateNodeField(selectedNode.id, 'node_type', e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-[#0B1F4E]"
                >
                  {NODE_CATEGORIES.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.label}</option>
                  ))}
                </select>
              </div>

              {/* Reports To (Parent Selector with Cycle Prevention) */}
              {selectedNode.parent_id !== null && (
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">Reports To (Parent Node)</label>
                  <select
                    value={selectedNode.parent_id || ''}
                    onChange={(e) => {
                      const newParent = e.target.value;
                      if (wouldCauseCycle(nodes, selectedNode.id, newParent)) {
                        alert('Invalid hierarchy: Cannot assign a node to its own subordinate.');
                        return;
                      }
                      handleReparentNode(selectedNode.id, newParent);
                    }}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-[#0B1F4E]"
                  >
                    {nodes
                      .filter(n => n.id !== selectedNode.id && !wouldCauseCycle(nodes, selectedNode.id, n.id))
                      .map(p => (
                        <option key={p.id} value={p.id}>{p.title}</option>
                      ))}
                  </select>
                </div>
              )}

              {/* Badge Text */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700">Badge Label</label>
                <input
                  type="text"
                  value={selectedNode.node_metadata?.badge || ''}
                  onChange={(e) => updateNodeField(selectedNode.id, 'meta.badge', e.target.value)}
                  placeholder="e.g. Statutory, Apex"
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-[#0B1F4E]"
                />
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700">Mandate &amp; Responsibilities</label>
                <textarea
                  rows={3}
                  value={selectedNode.description || ''}
                  onChange={(e) => updateNodeField(selectedNode.id, 'description', e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-[#0B1F4E]"
                  placeholder="Official portfolio scope and administrative duties..."
                />
              </div>

              {/* Actions */}
              <div className="border-t border-slate-200 pt-3 space-y-2">
                <button
                  type="button"
                  onClick={() => handleAddChild(selectedNode.id)}
                  className="w-full py-2 bg-[#0B1F4E] hover:bg-[#162e6e] text-white rounded-xl font-bold flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-[#C9A84C]" />
                  <span>Add Child Under Node</span>
                </button>

                {selectedNode.parent_id && (
                  <button
                    type="button"
                    onClick={() => handleDeleteNode(selectedNode.id)}
                    className="w-full py-2 bg-red-50 hover:bg-red-600 text-red-700 hover:text-white border border-red-200 rounded-xl font-bold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Node</span>
                  </button>
                )}
              </div>

            </div>
          </aside>
        )}

      </div>

      {/* =========================================================================
          3. PUBLISH CONFIRMATION MODAL
          ========================================================================= */}
      {isPublishModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200 text-slate-800">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center space-x-2">
                <Upload className="w-5 h-5 text-[#C9A84C]" />
                <h3 className="font-extrabold text-base text-[#0B1F4E]">Publish to Official Live Website</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsPublishModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-800 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <div>Total Verified Nodes: <strong className="text-[#0B1F4E]">{nodes.length}</strong></div>
                <div>Current Live Version: <strong className="text-[#C9A84C]">v{publishedVersion?.version_number || '1.0'}</strong></div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Release Version Number</label>
                <input
                  type="text"
                  value={publishVersionNumber}
                  onChange={(e) => setPublishVersionNumber(e.target.value)}
                  placeholder="e.g. 1.1 or 2.0"
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-mono focus:outline-none focus:border-[#0B1F4E]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Release Notes / Changes</label>
                <textarea
                  rows={3}
                  value={publishChangeSummary}
                  onChange={(e) => setPublishChangeSummary(e.target.value)}
                  placeholder="Summarize the institutional or structural updates..."
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-[#0B1F4E]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2.5 pt-2">
              <button
                type="button"
                onClick={() => setIsPublishModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handlePublish}
                disabled={isPublishing}
                className="px-5 py-2 bg-[#0B1F4E] hover:bg-[#162e6e] text-white rounded-xl font-extrabold flex items-center space-x-1.5 shadow-sm cursor-pointer disabled:opacity-50"
              >
                {isPublishing ? (
                  <span>Publishing...</span>
                ) : (
                  <>
                    <Check className="w-4 h-4 text-[#C9A84C]" />
                    <span>Confirm &amp; Publish Live</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
