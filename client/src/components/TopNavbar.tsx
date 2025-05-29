import { useAppContext } from "../context/AppContext";
import { Link } from "wouter";

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
    <header className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between z-30">
      <div className="flex items-center space-x-4">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <img src="/logo.png" alt="SBX Logo" className="w-18 h-6" />
          <h1 className="text-lg font-semibold text-gray-900">
            WMS Setup Portal
          </h1>
        </div>

        {/* Sub-section tabs */}
        {subSections.length > 0 && (
          <nav className="ml-6 flex space-x-1">
            {subSections.map((subSection) => (
              <button
                key={subSection}
                onClick={() => setActiveTab(subSection)}
                className={`px-3 py-1.5 text-xs font-medium rounded ${
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

      <div className="flex items-center space-x-3">
        {/* Docs button */}
        <a
          href="/docs"
          target="_blank"
          rel="noopener noreferrer"
          className="border border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 px-3 py-1.5 rounded text-xs font-medium transition-colors inline-block"
        >
          Docs
        </a>

        {/* JSON validation status */}
        <div className="flex items-center space-x-1.5">
          <div
            className={`w-2 h-2 rounded-full ${jsonValid ? "bg-green-500" : "bg-red-500"}`}
          ></div>
          <span className="text-xs text-gray-600">
            {jsonValid ? "Valid JSON" : "Invalid JSON"}
          </span>
        </div>

        {/* Export button */}
        <button
          onClick={exportJson}
          className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1.5 rounded text-xs font-medium flex items-center space-x-1.5"
        >
          <i className="fas fa-download text-xs"></i>
          <span>Export</span>
        </button>
      </div>
    </header>
  );
}
