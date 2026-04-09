import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { label: "Home", href: "/#hero" },
    { label: "About", href: "/#about" },
    { label: "Services", href: "/services" },
    { label: "Blogs", href: "/blogs" },
  ];

  const isHome = location.pathname === "/";

  const isActive = (href) => {
    if (href === "/#hero") {
      return location.pathname === "/" && (!location.hash || location.hash === "#hero");
    }
    if (href.startsWith("/#")) {
      return location.pathname === "/" && location.hash === href.slice(1);
    }
    return location.pathname === href;
  };

  const isTransparent = isHome;

  return (
    <nav className={`absolute top-0 left-0 right-0 z-50 ${
      isTransparent
        ? "bg-transparent"
        : "bg-white/95 backdrop-blur-md border-b border-gray-200/60 shadow-sm"
    }`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10 h-16 flex items-center relative">

        {/* Left — Nav links in pill container */}
        <div className="hidden md:flex items-center gap-1 p-1 rounded-full bg-white/10 backdrop-blur-sm"
          style={!isTransparent ? { background: "#f3f4f6" } : {}}
        >
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.label}
                to={link.href}
                className={["relative px-5 py-1.5 rounded-full text-[13px] font-medium",
                  "transition-all duration-300 ease-in-out",
                  isTransparent
                    ? active
                      ? "text-white bg-white/20 shadow-sm"
                      : "text-white/80 hover:text-white hover:bg-white/20 hover:shadow-sm"
                    : active
                    ? "text-gray-900 bg-white shadow-sm"
                    : "text-gray-500 hover:text-gray-800 hover:bg-white hover:shadow-sm",
                ].join(" ")}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Center — Logo */}
        <Link to="/" className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 shrink-0">
          <svg className="w-6 h-6" style={{color: '#E4574E'}} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0 0 12 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 0 1-2.031.352 5.988 5.988 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971Zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 0 1-2.031.352 5.989 5.989 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971Z" />
          </svg>
          <span className="text-[16px] font-semibold tracking-tight text-gray-900">
            LawBridge AI
          </span>
        </Link>

        {/* Right actions */}
        <div className="hidden md:flex items-center gap-3 ml-auto">
          {user ? (
            <>
              <span className="text-[13px] font-medium mr-2" style={{ color: '#18181b' }}>{user.name}</span>
              <button
                onClick={logout}
                className="px-5 py-1.5 rounded-full border text-[13px] font-medium transition-all duration-300 ease-in-out"
                style={{ backgroundColor: '#18181b', color: '#fff', borderColor: '#18181b' }}
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="px-5 py-1.5 rounded-full border text-[13px] font-medium transition-all duration-300 ease-in-out"
              style={{ backgroundColor: '#18181b', color: '#fff', borderColor: '#18181b' }}
            >
              Login / Register
            </Link>
          )}
        </div>
        {/* Mobile hamburger */}
        <button
          className={`md:hidden p-2 ml-auto ${isTransparent ? "text-white" : "text-charcoal"}`}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md px-6 py-5 space-y-1 border-t border-gray-100">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <a
                key={link.label}
                href={link.href}
                className={`block text-[14px] font-medium px-4 py-2.5 rounded-xl transition-all duration-300 ease-in-out ${
                  active
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                }`}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </a>
            );
          })}
          <div className="pt-3 mt-2 border-t border-gray-100 flex gap-3">
            {user ? (
              <button
                onClick={() => { logout(); setMobileOpen(false); }}
                className="text-[13px] px-4 py-2 rounded-full transition-all duration-300"
                style={{ backgroundColor: '#18181b', color: '#fff', borderColor: '#18181b' }}
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="px-5 py-1.5 rounded-full border text-[13px] font-medium transition-all duration-300 ease-in-out w-full text-center"
                style={{ backgroundColor: '#18181b', color: '#fff', borderColor: '#18181b' }}
                onClick={() => setMobileOpen(false)}
              >
                Login / Register
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;