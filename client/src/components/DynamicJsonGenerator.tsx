import { useAppContext } from "../context/AppContext";
import Sidebar from "./Sidebar";
import TopNavbar from "./TopNavbar";
import FormSection from "./FormSection";
import JsonPanel from "./JsonPanel";
import ExplainerDialog from "./ExplainerDialog";

export default function DynamicJsonGenerator() {
  const { rightSidebarExpanded, toggleRightSidebar } = useAppContext();

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <TopNavbar />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <FormSection />
        <JsonPanel />
      </div>

      {/* Floating toggle button for right sidebar when collapsed */}
      {!rightSidebarExpanded && (
        <button
          onClick={toggleRightSidebar}
          className="fixed right-4 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg z-40 transition-all"
        >
          <i className="fas fa-code"></i>
        </button>
      )}

      <ExplainerDialog />
    </div>
  );
}
