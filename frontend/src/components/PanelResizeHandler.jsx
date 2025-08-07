import { PanelResizeHandle } from 'react-resizable-panels';

export const CustomResizeHandle = () => (
  <PanelResizeHandle className="w-2 cursor-col-resize group relative">
    <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-1 bg-gray-300 rounded-sm group-hover:bg-gray-500 transition" />
    <div className="absolute inset-y-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2">
      <div className="flex flex-col items-center gap-2 opacity-50 group-hover:opacity-100 transition">
        <span className="w-1 h-1 rounded-full bg-gray-500"></span>
        <span className="w-1 h-1 rounded-full bg-gray-500"></span>
        <span className="w-1 h-1 rounded-full bg-gray-500"></span>
      </div>
    </div>
  </PanelResizeHandle>
);
