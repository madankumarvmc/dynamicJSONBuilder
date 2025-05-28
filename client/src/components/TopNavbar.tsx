import { useAppContext } from "../context/AppContext";

export default function TopNavbar() {
  const {
    activeSection,
    activeTab,
    setActiveTab,
    sections,
    jsonValid,
    exportJson,
  } = useAppContext();

  const currentSection = sections[activeSection];
  const subSections = currentSection
    ? Object.keys(currentSection.subsections || {})
    : [];

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-30">
      <div className="flex items-center space-x-4">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <i className="fas fa-code text-white text-sm"></i>
          </div>
          <h1 className="text-xl font-semibold text-gray-900">
            SBX WMS Setup Portal
          </h1>
        </div>

        {/* Sub-section tabs */}
        {subSections.length > 0 && (
          <nav className="ml-8 flex space-x-1">
            {subSections.map((subSection) => (
              <button
                key={subSection}
                onClick={() => setActiveTab(subSection)}
                className={`px-4 py-2 text-sm font-medium rounded-lg ${
                  activeTab === subSection
                    ? "text-blue-600 bg-blue-50 border border-blue-200"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                {subSection.charAt(0).toUpperCase() + subSection.slice(1)}
              </button>
            ))}
          </nav>
        )}
      </div>

      <div className="flex items-center space-x-4">
        {/* JSON validation status */}
        <div className="flex items-center space-x-2">
          <div
            className={`w-2 h-2 rounded-full ${jsonValid ? "bg-green-500" : "bg-red-500"}`}
          ></div>
          <span className="text-sm text-gray-600">
            {jsonValid ? "Valid JSON" : "Invalid JSON"}
          </span>
        </div>

        {/* Export button */}
        <button
          onClick={exportJson}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2"
        >
          <i className="fas fa-download"></i>
          <span>Export</span>
        </button>
      </div>
    </header>
  );
}
