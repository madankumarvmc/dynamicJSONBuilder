import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";

// Import documentation configuration
import documentationConfig from "../config/documentation.json";

export default function Documentation() {
  const [location] = useLocation();
  const [activeSection, setActiveSection] = useState("getting-started");
  const [activePage, setActivePage] = useState("introduction");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Parse current page from URL
  useEffect(() => {
    const pathParts = location.split("/").filter(Boolean);
    if (pathParts.length >= 2 && pathParts[0] === "docs") {
      const section = pathParts[1];
      const page = pathParts[2] || "introduction";
      setActiveSection(section);
      setActivePage(page);
    }
  }, [location]);

  const currentPageKey = `${activeSection}/${activePage}`;
  const currentPage = documentationConfig.pages[currentPageKey];
  const navigation = documentationConfig.navigation.docs;

  // Generate table of contents from markdown headers
  const generateTOC = (content: string) => {
    const headers = content.match(/^##\s+(.+)$/gm);
    return headers ? headers.map(header => {
      const title = header.replace(/^##\s+/, "");
      const id = title.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");
      return { title, id };
    }) : [];
  };

  const tableOfContents = currentPage ? generateTOC(currentPage.content) : [];

  // Handle navigation
  const handleNavigation = (section: string, page: string) => {
    setActiveSection(section);
    setActivePage(page);
    window.history.pushState({}, "", `/docs/${section}/${page}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Sidebar Navigation */}
      <div className={`${sidebarOpen ? "w-64" : "w-16"} bg-white border-r border-gray-200 transition-all duration-300`}>
        <div className="p-4">
          {/* Sidebar header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className={`font-semibold text-gray-900 ${!sidebarOpen && "hidden"}`}>
              {navigation.title}
            </h2>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1 text-gray-400 hover:text-gray-600"
            >
              <i className={`fas fa-${sidebarOpen ? "angle-left" : "angle-right"}`}></i>
            </button>
          </div>

          {/* Navigation sections */}
          <nav className="space-y-2">
            {Object.entries(navigation.sections).map(([sectionKey, section]: [string, any]) => (
              <div key={sectionKey}>
                <h3 className={`text-sm font-medium text-gray-500 uppercase tracking-wide mb-2 ${!sidebarOpen && "hidden"}`}>
                  {section.title}
                </h3>
                <ul className="space-y-1">
                  {section.pages.map((page: string) => (
                    <li key={page}>
                      <button
                        onClick={() => handleNavigation(sectionKey, page)}
                        className={`w-full text-left px-2 py-1 text-sm rounded-md transition-colors ${
                          activeSection === sectionKey && activePage === page
                            ? "bg-gray-100 text-gray-900 font-medium"
                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                        } ${!sidebarOpen && "text-center"}`}
                        title={sidebarOpen ? "" : page.charAt(0).toUpperCase() + page.slice(1).replace("-", " ")}
                      >
                        {sidebarOpen ? page.charAt(0).toUpperCase() + page.slice(1).replace("-", " ") : "📄"}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex">
        {/* Content */}
        <main className="flex-1 overflow-auto">
          <div className="max-w-4xl mx-auto p-8">
            {/* Breadcrumb */}
            {currentPage && (
              <div className="mb-6">
                <nav className="text-sm text-gray-500">
                  <span className="font-medium">{currentPage.breadcrumb}</span>
                </nav>
              </div>
            )}

            {/* Page content */}
            {currentPage ? (
              <div className="prose prose-gray max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code({ node, inline, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || "");
                      return !inline && match ? (
                        <SyntaxHighlighter
                          style={tomorrow}
                          language={match[1]}
                          PreTag="div"
                          {...props}
                        >
                          {String(children).replace(/\n$/, "")}
                        </SyntaxHighlighter>
                      ) : (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      );
                    },
                    h2({ children }) {
                      const id = String(children).toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");
                      return <h2 id={id}>{children}</h2>;
                    },
                  }}
                >
                  {currentPage.content}
                </ReactMarkdown>
              </div>
            ) : (
              <div className="text-center py-12">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Page Not Found</h2>
                <p className="text-gray-600">The requested documentation page could not be found.</p>
              </div>
            )}
          </div>
        </main>

        {/* Right Sidebar - Table of Contents */}
        <aside className="w-64 bg-white border-l border-gray-200 p-6">
          <div className="sticky top-6">
            <h3 className="text-sm font-medium text-gray-900 mb-4">On this page</h3>
            {tableOfContents.length > 0 ? (
              <nav>
                <ul className="space-y-2">
                  {tableOfContents.map((item) => (
                    <li key={item.id}>
                      <a
                        href={`#${item.id}`}
                        className="text-sm text-gray-600 hover:text-gray-900 block"
                      >
                        {item.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            ) : (
              <p className="text-sm text-gray-500">No sections available</p>
            )}

            {/* Copy page button */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                }}
                className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900"
              >
                <i className="far fa-copy"></i>
                <span>Copy page</span>
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}