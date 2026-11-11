/**
 * Official Institutional Organogram Layout Engine
 * Generates exact two-dimensional coordinates, balanced pillar distributions,
 * and orthogonal vector connector paths matching the official college publication.
 * 
 * Target: Screenshot 2 (Official St. Philomena's College Organogram)
 */

export function calculateOfficialPosterLayout(rawNodes = []) {
  if (!rawNodes || rawNodes.length === 0) {
    return {
      nodes: [],
      lines: [],
      viewBox: '0 0 1560 960',
      width: 1560,
      height: 960
    };
  }

  // Create lookup map
  const nodeMap = new Map();
  const childrenMap = new Map();

  rawNodes.forEach(node => {
    nodeMap.set(node.id, { ...node });
    if (!childrenMap.has(node.parent_id)) {
      childrenMap.set(node.parent_id, []);
    }
    childrenMap.get(node.parent_id).push(node.id);
  });

  // Find root node (MDES)
  let rootNode = rawNodes.find(n => !n.parent_id || n.id === 'node_mdes');
  if (!rootNode) {
    rootNode = rawNodes[0];
  }

  // Find Governing Body
  const governingNode = rawNodes.find(n => 
    n.id === 'node_governing_body' || 
    (n.parent_id === rootNode.id && (n.title.toLowerCase().includes('governing') || n.node_type === 'governance'))
  );

  // Find Rector
  const rectorNode = rawNodes.find(n => 
    n.id === 'node_rector' || 
    n.title.toLowerCase().includes('rector')
  );

  // Find Principal
  const principalNode = rawNodes.find(n => 
    n.id === 'node_principal' || 
    n.title.toLowerCase().includes('principal')
  );

  // Find Campus Admin branch under Rector
  const campusAdminNode = rawNodes.find(n => 
    n.id === 'node_campus_admin' || 
    (rectorNode && n.parent_id === rectorNode.id && n.id !== (principalNode?.id))
  );

  const campusSubNodes = campusAdminNode ? (childrenMap.get(campusAdminNode.id) || []).map(id => nodeMap.get(id)) : [];

  // Attached Advisory / Council nodes under Principal
  const attachedToPrincipalIds = principalNode ? (childrenMap.get(principalNode.id) || []) : [];
  
  // Distinguish between the 6 Operational Pillars and the Advisory Councils
  const pillarPrefixes = ['node_vp_admin', 'node_vp_academics', 'node_pg_director', 'node_coe', 'node_committees', 'node_hostels'];
  
  const councilNodeIds = attachedToPrincipalIds.filter(id => {
    const n = nodeMap.get(id);
    if (!n) return false;
    const isPillar = pillarPrefixes.some(p => n.id.startsWith(p)) || 
                     n.title.toLowerCase().includes('vice principal') || 
                     n.title.toLowerCase().includes('director') || 
                     n.title.toLowerCase().includes('controller') || 
                     n.title.toLowerCase().includes('hostel') ||
                     n.title.toLowerCase().includes('cell / committees');
    return !isPillar;
  });

  const pillarNodeIds = attachedToPrincipalIds.filter(id => !councilNodeIds.includes(id));

  // If standard pillars aren't direct children of principal in custom data, find them by ID or title
  const standardPillarKeys = [
    { key: 'node_vp_admin', titlePart: 'vice principal administration', color: '#1B365D' },
    { key: 'node_vp_academics', titlePart: 'vice principal academics', color: '#007A60' },
    { key: 'node_pg_director', titlePart: 'post graduate director', color: '#5B2C6F' },
    { key: 'node_coe', titlePart: 'controller of examinations', color: '#D35400' },
    { key: 'node_committees', titlePart: 'cell / committees', color: '#881337' },
    { key: 'node_hostels', titlePart: 'hostel', color: '#BE185D' }
  ];

  const orderedPillars = [];
  standardPillarKeys.forEach(cfg => {
    let pNode = rawNodes.find(n => n.id === cfg.key) || 
                rawNodes.find(n => n.title.toLowerCase().includes(cfg.titlePart));
    if (pNode && !orderedPillars.some(p => p.id === pNode.id)) {
      orderedPillars.push({ ...pNode, defaultColor: cfg.color });
    }
  });

  // Add any remaining pillar nodes
  pillarNodeIds.forEach(id => {
    const pNode = nodeMap.get(id);
    if (pNode && !orderedPillars.some(p => p.id === pNode.id)) {
      orderedPillars.push({ ...pNode, defaultColor: '#1B365D' });
    }
  });

  // =========================================================================
  // GEOMETRIC CONSTANTS (Landscape 1560 x 960 viewBox)
  // =========================================================================
  const SPINE_CENTER_X = 585;
  const HEADER_Y = 35;
  
  const placedNodes = [];
  const lines = [];

  // Helper to add node
  const placeNode = (node, x, y, width, height, customStyle = {}) => {
    placedNodes.push({
      ...node,
      layoutX: x,
      layoutY: y,
      layoutWidth: width,
      layoutHeight: height,
      style: {
        bgColor: customStyle.bgColor || node.node_metadata?.bg_color || '#004D61',
        textColor: customStyle.textColor || node.node_metadata?.text_color || '#FFFFFF',
        borderColor: customStyle.borderColor || node.node_metadata?.border_color || '#C9A84C',
        shape: customStyle.shape || node.node_metadata?.shape || 'rounded',
        fontSize: customStyle.fontSize || 12,
        fontWeight: customStyle.fontWeight || 'bold'
      }
    });
  };

  // 1. Root: MDES (Level 0 - Navy Oval)
  const mdesW = 280;
  const mdesH = 46;
  const mdesX = SPINE_CENTER_X - (mdesW / 2);
  const mdesY = 75;
  if (rootNode) {
    placeNode(rootNode, mdesX, mdesY, mdesW, mdesH, {
      shape: 'oval',
      bgColor: '#081735',
      borderColor: '#C9A84C',
      fontSize: 12.5,
      fontWeight: 'bold'
    });
  }

  // 2. Governing Body (Level 1 - Teal Rectangle)
  const govW = 195;
  const govH = 34;
  const govX = SPINE_CENTER_X - (govW / 2);
  const govY = 150;
  if (governingNode) {
    placeNode(governingNode, govW ? govX : 0, govY, govW, govH, {
      shape: 'rounded',
      bgColor: '#004D61',
      borderColor: '#081735',
      fontSize: 12
    });
    // Line: MDES -> Governing Body
    lines.push(`M ${SPINE_CENTER_X} ${mdesY + mdesH} L ${SPINE_CENTER_X} ${govY}`);
  }

  // 3. Rector (Level 2 - Teal Rectangle)
  const rectorW = 195;
  const rectorH = 34;
  const rectorX = SPINE_CENTER_X - (rectorW / 2);
  const rectorY = 210;
  if (rectorNode) {
    placeNode(rectorNode, rectorX, rectorY, rectorW, rectorH, {
      shape: 'rounded',
      bgColor: '#004D61',
      borderColor: '#081735',
      fontSize: 12
    });
    // Line: Governing Body -> Rector
    if (governingNode) {
      lines.push(`M ${SPINE_CENTER_X} ${govY + govH} L ${SPINE_CENTER_X} ${rectorY}`);
    }
  }

  // 3a. Branch: Campus Administration (Left of Rector)
  const campusW = 185;
  const campusH = 34;
  const campusX = 220;
  const campusY = 210;
  if (campusAdminNode) {
    placeNode(campusAdminNode, campusX, campusY, campusW, campusH, {
      shape: 'rounded',
      bgColor: '#7A431D',
      borderColor: '#5A3114',
      fontSize: 12
    });
    // Line: Rector -> Campus Admin (horizontal)
    lines.push(`M ${rectorX} ${rectorY + rectorH / 2} L ${campusX + campusW} ${campusY + campusH / 2}`);

    // Stack of Sub-items under Campus Admin
    const bracketX = campusX - 15;
    const subW = 160;
    const subH = 26;
    let currentSubY = 256;

    if (campusSubNodes.length > 0) {
      // Line from Campus Admin down to bracket
      lines.push(`M ${campusX + 15} ${campusY + campusH} L ${campusX + 15} ${currentSubY - 10} L ${bracketX} ${currentSubY - 10}`);
      
      const firstTickY = currentSubY + (subH / 2);
      let lastTickY = firstTickY;

      campusSubNodes.forEach((sub, idx) => {
        placeNode(sub, campusX - 10, currentSubY, subW, subH, {
          shape: 'rounded',
          bgColor: '#7A431D',
          borderColor: '#5A3114',
          fontSize: 10.5
        });
        const tickY = currentSubY + (subH / 2);
        lines.push(`M ${bracketX} ${tickY} L ${campusX - 10} ${tickY}`);
        lastTickY = tickY;
        currentSubY += subH + 8;
      });

      // Vertical line connecting all ticks
      lines.push(`M ${bracketX} ${currentSubY - 10 - (subH + 8)} L ${bracketX} ${firstTickY}`);
    }
  }

  // 4. Principal (Level 3 - Teal Rectangle)
  const prinW = 195;
  const prinH = 34;
  const prinX = SPINE_CENTER_X - (prinW / 2);
  const prinY = 280;
  if (principalNode) {
    placeNode(principalNode, prinX, prinY, prinW, prinH, {
      shape: 'rounded',
      bgColor: '#004D61',
      borderColor: '#081735',
      fontSize: 12
    });
    // Line: Rector -> Principal
    if (rectorNode) {
      lines.push(`M ${SPINE_CENTER_X} ${rectorY + rectorH} L ${SPINE_CENTER_X} ${prinY}`);
    }
  }

  // 4a. Branch: Advisory Councils & Committees (Right of Principal)
  const councilBusX = prinX + prinW + 35;
  const councilCardX = councilBusX + 18;
  const councilCardW = 180;
  const councilCardH = 26;
  const councilSpacing = 7;

  // Let's identify the 4 standard council nodes
  const acNode = rawNodes.find(n => n.id === 'node_academic_council' || n.title.toLowerCase().includes('academic council'));
  const planNode = rawNodes.find(n => n.id === 'node_planning_committee' || n.title.toLowerCase().includes('planning and evaluation'));
  const iqacNode = rawNodes.find(n => n.id === 'node_iqac' || n.title.toLowerCase().includes('iqac'));
  const racNode = rawNodes.find(n => n.id === 'node_rac' || n.title.toLowerCase().includes('research advisory'));
  const rdcNode = rawNodes.find(n => n.id === 'node_rdc' || n.title.toLowerCase().includes('research and development'));
  const iprNode = rawNodes.find(n => n.id === 'node_ipr' || n.title.toLowerCase().includes('intellectual property'));

  const councilList = [acNode, planNode, iqacNode, racNode].filter(Boolean);
  
  if (councilList.length > 0) {
    const totalCouncilH = (councilList.length * councilCardH) + ((councilList.length - 1) * councilSpacing);
    let startCouncilY = prinY - 35; // Center nicely beside Principal
    
    // Line from Principal to Council Bus
    lines.push(`M ${prinX + prinW} ${prinY + prinH / 2} L ${councilBusX} ${prinY + prinH / 2}`);

    const firstY = startCouncilY + (councilCardH / 2);
    let lastY = firstY;

    councilList.forEach((cNode, idx) => {
      const cY = startCouncilY + idx * (councilCardH + councilSpacing);
      const tickY = cY + (councilCardH / 2);
      placeNode(cNode, councilCardX, cY, councilCardW, councilCardH, {
        shape: 'rounded',
        bgColor: '#7A431D',
        borderColor: '#5A3114',
        fontSize: 10
      });
      // Horizontal tick from bus to card
      lines.push(`M ${councilBusX} ${tickY} L ${councilCardX} ${tickY}`);
      lastY = tickY;

      // Special Horizontal Extension from RAC to R&D Cell to IPR Cell
      if (cNode.id === racNode?.id) {
        if (rdcNode) {
          const rdcX = councilCardX + councilCardW + 20;
          const rdcW = 155;
          placeNode(rdcNode, rdcX, cY, rdcW, councilCardH, {
            shape: 'rounded',
            bgColor: '#7A431D',
            borderColor: '#5A3114',
            fontSize: 10
          });
          lines.push(`M ${councilCardX + councilCardW} ${tickY} L ${rdcX} ${tickY}`);

          if (iprNode) {
            const iprX = rdcX + rdcW + 20;
            const iprW = 160;
            placeNode(iprNode, iprX, cY, iprW, councilCardH, {
              shape: 'rounded',
              bgColor: '#7A431D',
              borderColor: '#5A3114',
              fontSize: 10
            });
            lines.push(`M ${rdcX + rdcW} ${tickY} L ${iprX} ${tickY}`);
          }
        }
      }
    });

    // Vertical bus line spanning the council ticks
    lines.push(`M ${councilBusX} ${firstY} L ${councilBusX} ${lastY}`);
  }

  // =========================================================================
  // 5. THE 6 SPECIALIZED OPERATIONAL PILLARS (Bottom Grid)
  // =========================================================================
  const pillarCount = orderedPillars.length || 6;
  const pillarY = 430;
  const pillarHeaderH = 40;
  const busY = 385;

  // Calculate horizontal spacing across width (x: 40 to 1250)
  const colWidths = [190, 185, 175, 185, 195, 165];
  const colGaps = 20;
  let currentX = 40;

  const pillarCenters = [];

  orderedPillars.forEach((pillar, pIdx) => {
    const colW = colWidths[pIdx] || 180;
    const pX = currentX;
    const centerX = pX + (colW / 2);
    pillarCenters.push(centerX);

    // Place Pillar Header Card
    placeNode(pillar, pX, pillarY, colW, pillarHeaderH, {
      shape: 'rounded',
      bgColor: pillar.defaultColor || '#004D61',
      borderColor: '#081735',
      fontSize: 11,
      fontWeight: 'bold'
    });

    // Line from Bus down into Pillar Header
    lines.push(`M ${centerX} ${busY} L ${centerX} ${pillarY}`);

    // Stack Pillar Children vertically
    // Collect all descendants under this pillar
    const pillarChildrenIds = [];
    const collectDescendants = (parentId) => {
      const children = childrenMap.get(parentId) || [];
      children.forEach(cid => {
        pillarChildrenIds.push(cid);
        collectDescendants(cid);
      });
    };
    collectDescendants(pillar.id);

    const pillarChildren = pillarChildrenIds.map(id => nodeMap.get(id)).filter(Boolean);

    if (pillarChildren.length > 0) {
      const bracketX = pX + 18;
      const childCardX = bracketX + 10;
      const childCardW = colW - 28;
      const childH = pIdx === 4 ? 24 : 26; // slightly tighter for 11 committees
      const childGap = pIdx === 4 ? 6 : 7;
      let startChildY = pillarY + pillarHeaderH + 18;

      // Vertical connector line from Pillar Header down to bracket
      lines.push(`M ${bracketX} ${pillarY + pillarHeaderH} L ${bracketX} ${startChildY + (pillarChildren.length - 1) * (childH + childGap) + (childH / 2)}`);

      pillarChildren.forEach((childNode, cIdx) => {
        const cY = startChildY + cIdx * (childH + childGap);
        const tickY = cY + (childH / 2);

        placeNode(childNode, childCardX, cY, childCardW, childH, {
          shape: 'rounded',
          bgColor: pillar.defaultColor || '#004D61',
          borderColor: '#FFFFFF',
          fontSize: pIdx === 4 ? 9.5 : 10
        });

        // Horizontal tick line from bracket into card
        lines.push(`M ${bracketX} ${tickY} L ${childCardX} ${tickY}`);
      });
    }

    currentX += colW + colGaps;
  });

  // Vertical line from Principal down to Pillar Bus
  if (principalNode && pillarCenters.length > 0) {
    lines.push(`M ${SPINE_CENTER_X} ${prinY + prinH} L ${SPINE_CENTER_X} ${busY}`);
    // Horizontal Bus Line spanning from first pillar to last pillar
    const minBusX = pillarCenters[0];
    const maxBusX = pillarCenters[pillarCenters.length - 1];
    lines.push(`M ${minBusX} ${busY} L ${maxBusX} ${busY}`);
  }

  // Calculate actual bounding box
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  placedNodes.forEach(node => {
    minX = Math.min(minX, node.layoutX);
    minY = Math.min(minY, node.layoutY);
    maxX = Math.max(maxX, node.layoutX + node.layoutWidth);
    maxY = Math.max(maxY, node.layoutY + node.layoutHeight);
  });

  // Include top header & margins
  const finalMinX = 20;
  const finalMinY = 15;
  const finalMaxX = Math.max(maxX + 40, 1480);
  const finalMaxY = Math.max(maxY + 30, 890);

  const totalWidth = Math.ceil(finalMaxX - finalMinX);
  const totalHeight = Math.ceil(finalMaxY - finalMinY);

  return {
    nodes: placedNodes,
    lines,
    viewBox: `0 0 ${totalWidth + 40} ${totalHeight + 30}`,
    width: totalWidth + 40,
    height: totalHeight + 30
  };
}
