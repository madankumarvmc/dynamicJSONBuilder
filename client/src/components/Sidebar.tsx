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
    userSettings: "fas fa-user",
    userSetting: "fas fa-user",
    outboundConfig: "fas fa-user",
    productConfig: "fas fa-cog",
    apiSettings: "fas fa-database", 
    themeConfig: "fas fa-palette",
    warehouseTask: "fas fa-warehouse"
  };

  return (
    <aside 
      className={`bg-white border-r border-gray-200 transition-all duration-300 ease-in-out ${
        leftSidebarExpanded ? 'w-64' : 'w-16'
      }`}
    >
      {/* Sidebar header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        {leftSidebarExpanded && (
          <span className="font-medium text-gray-900">Sections</span>
        )}
        <button 
          className="p-1 hover:bg-gray-100 rounded" 
          onClick={toggleLeftSidebar}
        >
          <i className="fas fa-bars text-gray-600"></i>
        </button>
      </div>

      {/* Navigation items */}
      <nav className="p-2 space-y-1">
        {Object.keys(sections).map((sectionKey) => {
          const section = sections[sectionKey];
          const isActive = activeSection === sectionKey;
          
          return (
            <button
              key={sectionKey}
              onClick={() => setActiveSection(sectionKey)}
              className={`w-full flex items-center space-x-3 px-3 py-3 text-left hover:bg-gray-50 rounded-lg group ${
                isActive ? 'bg-blue-50' : ''
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center group-hover:bg-blue-200 ${
                isActive ? 'bg-blue-100' : 'bg-gray-100'
              }`}>
                <i className={`${sectionIcons[sectionKey] || 'fas fa-cog'} text-sm ${
                  isActive ? 'text-blue-600' : 'text-gray-600'
                }`}></i>
              </div>
              {leftSidebarExpanded && (
                <span className={`font-medium ${
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
