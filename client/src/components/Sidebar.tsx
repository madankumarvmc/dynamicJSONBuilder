import { useAppContext } from "../context/AppContext";

export default function Sidebar() {
  const { 
    leftSidebarExpanded, 
    toggleLeftSidebar, 
    activeSection, 
    setActiveSection,
    sections 
  } = useAppContext();

  const sectionIcons: Record<string, string> = {
    outboundConfiguration: "fas fa-shipping-fast"
  };

  return (
    <aside 
      className={`bg-white border-r border-gray-200 transition-all duration-300 ease-in-out ${
        leftSidebarExpanded ? 'w-64' : 'w-16'
      }`}
    >
      {/* Sidebar header */}
      <div className="p-2 border-b border-gray-200 flex items-center justify-between">
        {leftSidebarExpanded && (
          <span className="text-sm font-medium text-gray-900">Sections</span>
        )}
        <button 
          className="p-1 hover:bg-gray-100 rounded" 
          onClick={toggleLeftSidebar}
        >
          <i className="fas fa-bars text-gray-600 text-xs"></i>
        </button>
      </div>

      {/* Navigation items */}
      <nav className="p-1 space-y-0.5">
        {Object.keys(sections).map((sectionKey) => {
          const section = sections[sectionKey];
          const isActive = activeSection === sectionKey;
          
          return (
            <button
              key={sectionKey}
              onClick={() => setActiveSection(sectionKey)}
              className={`w-full flex items-center space-x-2 px-2 py-2 text-left hover:bg-gray-50 rounded group ${
                isActive ? 'bg-blue-50' : ''
              }`}
            >
              <div className={`w-6 h-6 rounded flex items-center justify-center group-hover:bg-blue-200 ${
                isActive ? 'bg-blue-100' : 'bg-gray-100'
              }`}>
                <i className={`${sectionIcons[sectionKey] || 'fas fa-cog'} text-xs ${
                  isActive ? 'text-blue-600' : 'text-gray-600'
                }`}></i>
              </div>
              {leftSidebarExpanded && (
                <span className={`text-sm font-medium ${
                  isActive ? 'text-gray-900' : 'text-gray-700'
                }`}>
                  {section.title || sectionKey}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
