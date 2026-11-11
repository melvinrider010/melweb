import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Plus, Edit3, Trash2, User, ChevronDown, ChevronRight, Layers } from 'lucide-react';

const CATEGORY_STYLES = {
  governance: {
    bg: '#0B1F4E',
    text: '#FFFFFF',
    border: '#C9A84C',
    subText: '#E2E8F0',
    badgeBg: 'rgba(201, 168, 76, 0.25)',
    badgeText: '#F5D77F'
  },
  executive: {
    bg: '#004759',
    text: '#FFFFFF',
    border: '#058270',
    subText: '#E2E8F0',
    badgeBg: 'rgba(5, 130, 112, 0.25)',
    badgeText: '#A7F3D0'
  },
  academic: {
    bg: '#1F4996',
    text: '#FFFFFF',
    border: '#3B82F6',
    subText: '#E2E8F0',
    badgeBg: 'rgba(59, 130, 246, 0.25)',
    badgeText: '#BFDBFE'
  },
  administrative: {
    bg: '#7A431D',
    text: '#FFFFFF',
    border: '#C26A27',
    subText: '#FDE68A',
    badgeBg: 'rgba(194, 106, 39, 0.25)',
    badgeText: '#FED7AA'
  },
  examination: {
    bg: '#005B7F',
    text: '#FFFFFF',
    border: '#0284C7',
    subText: '#E2E8F0',
    badgeBg: 'rgba(2, 132, 199, 0.25)',
    badgeText: '#BAE6FD'
  },
  committee: {
    bg: '#334155',
    text: '#FFFFFF',
    border: '#64748B',
    subText: '#CBD5E1',
    badgeBg: 'rgba(100, 116, 139, 0.25)',
    badgeText: '#E2E8F0'
  },
  hostel: {
    bg: '#0F766E',
    text: '#FFFFFF',
    border: '#14B8A6',
    subText: '#CCFBF1',
    badgeBg: 'rgba(20, 184, 166, 0.25)',
    badgeText: '#99F6E4'
  },
  default: {
    bg: '#FFFFFF',
    text: '#0B1F4E',
    border: '#CBD5E1',
    subText: '#475569',
    badgeBg: 'rgba(11, 31, 78, 0.08)',
    badgeText: '#0B1F4E'
  }
};

function OrganogramCustomNode({ id, data, selected }) {
  const isHorizontal = data.direction === 'LR';
  const targetPos = isHorizontal ? Position.Left : Position.Top;
  const sourcePos = isHorizontal ? Position.Right : Position.Bottom;

  const meta = data.node_metadata || {};
  const catStyle = CATEGORY_STYLES[data.node_type] || (data.parent_id ? CATEGORY_STYLES.default : CATEGORY_STYLES.governance);

  const bgColor = meta.bg_color || catStyle.bg;
  const textColor = meta.text_color || catStyle.text;
  const borderColor = selected ? '#C9A84C' : (meta.border_color || catStyle.border);
  const isLight = textColor.toLowerCase() === '#ffffff' ? false : true;

  const hasChildren = data.hasChildren;
  const isCollapsed = data.isCollapsed;
  const isEditable = data.isEditable;

  return (
    <div
      className={`relative select-none transition-all duration-150 group ${
        selected ? 'ring-2 ring-[#C9A84C] shadow-lg' : 'hover:shadow-md'
      }`}
      style={{
        width: 260,
        minHeight: 92,
        backgroundColor: bgColor,
        color: textColor,
        borderWidth: selected ? '2.5px' : '1.5px',
        borderColor: borderColor,
        borderRadius: meta.shape === 'pill' ? '9999px' : meta.shape === 'sharp' ? '4px' : '10px',
        boxShadow: selected ? '0 10px 25px -5px rgba(201, 168, 76, 0.3)' : '0 2px 6px -1px rgba(0, 0, 0, 0.1)'
      }}
      onClick={(e) => {
        if (data.onNodeClick) {
          data.onNodeClick(data);
        }
      }}
    >
      {/* Target Handle (Input Connection) */}
      <Handle
        type="target"
        position={targetPos}
        className="!w-2.5 !h-2.5 !bg-[#C9A84C] !border-2 !border-white"
        style={{ opacity: data.parent_id ? 1 : 0 }}
      />

      {/* Main Node Content */}
      <div className="p-3 text-center flex flex-col justify-center items-center h-full space-y-0.5">
        
        {/* Tier / Category Badge */}
        {(meta.badge || data.node_type) && (
          <span
            className="px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase mb-1 line-clamp-1"
            style={{
              backgroundColor: isLight ? 'rgba(11, 31, 78, 0.08)' : catStyle.badgeBg,
              color: isLight ? '#0B1F4E' : catStyle.badgeText
            }}
          >
            {meta.badge || data.node_type}
          </span>
        )}

        {/* Node Title */}
        <h4
          className="font-serif font-extrabold text-[12.5px] leading-snug line-clamp-2 px-1"
          style={{ color: textColor }}
          title={data.title}
        >
          {data.title}
        </h4>

        {/* Designation */}
        {data.designation && (
          <p
            className="text-[10.5px] font-sans font-medium line-clamp-1"
            style={{ color: isLight ? '#475569' : catStyle.subText }}
            title={data.designation}
          >
            {data.designation}
          </p>
        )}

        {/* Person In-Charge Name */}
        {data.person_name && (
          <div
            className="flex items-center space-x-1 text-[9.5px] font-sans font-semibold italic pt-0.5"
            style={{ color: isLight ? '#058270' : '#FDE047' }}
          >
            <User className="w-2.5 h-2.5 shrink-0" />
            <span className="truncate max-w-[210px]">{data.person_name}</span>
          </div>
        )}
      </div>

      {/* Expand / Collapse Branch Button */}
      {hasChildren && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (data.onToggleCollapse) {
              data.onToggleCollapse(id);
            }
          }}
          className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-white text-[#0B1F4E] border border-slate-300 hover:border-[#C9A84C] hover:bg-[#FDFBF7] text-[10px] font-bold shadow-xs transition-colors flex items-center space-x-1 cursor-pointer z-30"
          title={isCollapsed ? `Expand ${data.childrenCount} subordinates` : `Collapse subordinates`}
        >
          <span>{isCollapsed ? '+' : '−'}</span>
          <span className="text-[9px] font-mono text-slate-500">{data.childrenCount}</span>
        </button>
      )}

      {/* Hover Quick Action Buttons (Admin Editor Mode Only) */}
      {isEditable && (
        <div className="absolute -top-3.5 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1 bg-[#0F172A] p-1 rounded-lg border border-slate-700 shadow-md z-40">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (data.onAddChild) data.onAddChild(id);
            }}
            className="p-1 text-emerald-400 hover:text-white hover:bg-emerald-600 rounded cursor-pointer"
            title="Add Child Node"
          >
            <Plus className="w-3 h-3" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (data.onEdit) data.onEdit(id);
            }}
            className="p-1 text-sky-400 hover:text-white hover:bg-sky-600 rounded cursor-pointer"
            title="Edit Properties"
          >
            <Edit3 className="w-3 h-3" />
          </button>
          {data.parent_id && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (data.onDelete) data.onDelete(id);
              }}
              className="p-1 text-red-400 hover:text-white hover:bg-red-600 rounded cursor-pointer"
              title="Delete Node"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          )}
        </div>
      )}

      {/* Source Handle (Output Connection to Children) */}
      <Handle
        type="source"
        position={sourcePos}
        className="!w-2.5 !h-2.5 !bg-[#C9A84C] !border-2 !border-white"
        style={{ opacity: hasChildren ? 1 : 0 }}
      />
    </div>
  );
}

export default memo(OrganogramCustomNode);
