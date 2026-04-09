import { Link } from "react-router-dom";

const LawFooter = () => {
  return (
    <footer className="bg-charcoal relative overflow-hidden">
      {/* Top CTA */}
      <div className="border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-8 lg:px-12 py-20 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Ready to Get Started?
            </h3>
            <p className="text-white/40 text-[15px] max-w-md">
              Schedule your free consultation and navigate your legal matters with confidence.
            </p>
          </div>
          <Link
            to="/signup"
            className="shrink-0 px-10 py-3.5 bg-[#E4574E] text-white font-semibold text-[13px] tracking-wide rounded-lg hover:bg-[#c13d36] transition-all duration-200"
          >
            Free Consultation
          </Link>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-8 lg:px-12 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <span className="text-[18px] font-bold tracking-tight text-white">
              LAW<span className="text-[#E4574E]">BRIDGE</span>
            </span>
            <p className="text-white/35 text-sm leading-[1.8] mt-5 mb-6">
              AI-powered legal guidance that makes justice accessible. Trusted by thousands across India.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-[11px] tracking-[0.15em] uppercase font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3.5">
              {[
                { label: "Home", href: "#hero" },
                { label: "About Us", href: "#about" },
                { label: "Practice Areas", href: "#practice" },
                { label: "Our Team", href: "#team" },
                { label: "Contact", href: "#contact" },
              ].map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-white/40 text-sm hover:text-[#E4574E] transition-colors duration-300">{link.label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Practice Areas */}
          <div>
            <h4 className="text-white text-[11px] tracking-[0.15em] uppercase font-semibold mb-6">Practice Areas</h4>
            <ul className="space-y-3.5">
              {["Corporate Law", "Family Law", "Criminal Defense", "Property Law", "Labour Law", "Cyber Law"].map((area) => (
                <li key={area}>
                  <a href="#practice" className="text-white/40 text-sm hover:text-[#E4574E] transition-colors duration-300">{area}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white text-[11px] tracking-[0.15em] uppercase font-semibold mb-6">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="text-[#E4574E] text-sm mt-0.5">&#9679;</span>
                <span className="text-white/40 text-sm">Mumbai, Maharashtra, India</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#E4574E] text-sm mt-0.5">&#9679;</span>
                <span className="text-white/40 text-sm">+91 98981 04059</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#E4574E] text-sm mt-0.5">&#9679;</span>
                <span className="text-white/40 text-sm">contact@lawbridge.ai</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-8 lg:px-12 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-xs tracking-wide">
            &copy; 2026 LawBridge AI. All rights reserved.
          </p>
          <div className="flex gap-8">
            <a href="#" className="text-white/30 text-xs hover:text-[#E4574E] transition-colors duration-300">Privacy Policy</a>
            <a href="#" className="text-white/30 text-xs hover:text-[#E4574E] transition-colors duration-300">Terms of Service</a>
            <a href="#" className="text-white/30 text-xs hover:text-[#E4574E] transition-colors duration-300">Disclaimer</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LawFooter;
