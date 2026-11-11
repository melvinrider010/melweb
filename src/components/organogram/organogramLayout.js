import dagre from 'dagre';

export const NODE_WIDTH = 260;
export const NODE_HEIGHT = 92;

/**
 * Calculate hierarchical layout for organogram nodes using Dagre.
 * 
 * @param {Array} rawNodes List of organogram nodes from API
 * @param {Set} collapsedNodeIds Set of node IDs whose subtrees are collapsed
 * @param {Object} options Layout options (direction, nodeSep, rankSep)
 * @returns {Object} { layoutedNodes, layoutedEdges, graphDimensions }
 */
export function getLayoutedHierarchy(rawNodes = [], collapsedNodeIds = new Set(), options = {}) {
  const direction = options.direction || 'TB'; // 'TB' = Top to Bottom, 'LR' = Left to Right
  const nodeSep = options.nodeSep || 45; // Horizontal gap between siblings
  const rankSep = options.rankSep || 75; // Vertical gap between hierarchy tiers

  // 1. Build children map to filter out collapsed subtrees
  const childrenMap = {};
  rawNodes.forEach(n => {
    const pid = n.parent_id || 'root';
    if (!childrenMap[pid]) childrenMap[pid] = [];
    childrenMap[pid].push(n);
  });

  // Collect all hidden nodes by traversing downwards from collapsed nodes
  const hiddenNodeIds = new Set();
  function markDescendantsHidden(parentId) {
    const children = childrenMap[parentId] || [];
    children.forEach(child => {
      hiddenNodeIds.add(child.id);
      markDescendantsHidden(child.id);
    });
  }
  collapsedNodeIds.forEach(id => markDescendantsHidden(id));

  // Filter visible nodes and edges
  const visibleNodes = rawNodes.filter(n => !hiddenNodeIds.has(n.id));

  // Initialize Dagre graph
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({
    rankdir: direction,
    nodesep: nodeSep,
    ranksep: rankSep,
    marginx: 40,
    marginy: 40,
    align: 'DL' // Balanced rank alignment
  });

  visibleNodes.forEach(node => {
    dagreGraph.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
  });

  const visibleEdges = [];
  visibleNodes.forEach(node => {
    if (node.parent_id && !hiddenNodeIds.has(node.parent_id)) {
      dagreGraph.setEdge(node.parent_id, node.id);
      visibleEdges.push({
        id: `e-${node.parent_id}-${node.id}`,
        source: node.parent_id,
        target: node.id,
        type: 'smoothstep', // Clean orthogonal connector
        style: { stroke: '#64748B', strokeWidth: 2 },
        markerEnd: {
          type: 'arrowclosed',
          width: 14,
          height: 14,
          color: '#C9A84C'
        }
      });
    }
  });

  dagre.layout(dagreGraph);

  // Map Dagre coordinates to React Flow node format
  const layoutedNodes = visibleNodes.map(node => {
    const nodeWithPos = dagreGraph.node(node.id) || { x: 0, y: 0 };
    const hasChildren = (childrenMap[node.id] || []).length > 0;
    const isCollapsed = collapsedNodeIds.has(node.id);
    const childrenCount = (childrenMap[node.id] || []).length;

    return {
      id: node.id,
      type: 'organogramNode',
      position: {
        x: nodeWithPos.x - NODE_WIDTH / 2,
        y: nodeWithPos.y - NODE_HEIGHT / 2
      },
      data: {
        ...node,
        hasChildren,
        isCollapsed,
        childrenCount,
        direction
      }
    };
  });

  const graphDimensions = {
    width: dagreGraph.graph().width || 2000,
    height: dagreGraph.graph().height || 1200
  };

  return { layoutedNodes, layoutedEdges: visibleEdges, graphDimensions };
}

/**
 * Cycle detection safeguard: returns true if setting `newParentId` would create a circular loop.
 */
export function wouldCauseCycle(nodes, nodeId, newParentId) {
  if (!newParentId) return false;
  if (nodeId === newParentId) return true;

  let current = nodes.find(n => n.id === newParentId);
  const visited = new Set([nodeId]);

  while (current) {
    if (visited.has(current.id)) return true;
    visited.add(current.id);
    if (!current.parent_id) break;
    current = nodes.find(n => n.id === current.parent_id);
  }

  return false;
}
