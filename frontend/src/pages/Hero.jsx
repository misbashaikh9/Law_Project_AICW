import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Hero = () => {
  const { user } = useAuth();

  return (
    <section
      id="hero"
      className="relative pt-16 min-h-screen overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/statue.png')" }}
    >
      {/* Top white gradient fade */}
      <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-white via-white/80 to-transparent z-[5]" />

      {/* Bottom white gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-white via-white/80 to-transparent z-[5]" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 flex items-center min-h-[calc(100vh-64px)]">
        <div className="grid gap-12 items-center w-full max-w-2xl">
          {/* Left — text */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border bg-white/60 backdrop-blur-sm mb-8" style={{ borderColor: '#E4574E40' }}>
              <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#E4574E' }} />
              <span className="text-[11px] font-semibold tracking-[0.12em] uppercase" style={{ color: '#E4574E' }}>
                AI-Powered Legal Platform
              </span>
            </div>

            <h1 className="text-[40px] md:text-[52px] lg:text-[60px] font-extrabold text-gray-900 leading-[1.08] tracking-[-0.025em] mb-6">
              Legal Guidance
              <br />
              You Can <span style={{ color: '#E4574E' }}>Trust</span>
            </h1>

            <p className="text-gray-600 text-[15px] leading-[1.8] max-w-md mb-10">
              Navigate complex legal matters with confidence. Our AI-driven
              platform delivers trusted guidance, personalized strategies,
              and real results — designed for Indian users.
            </p>

            <div className="flex flex-wrap items-center gap-4 mb-14">
              <Link
                to={user ? "/chat" : "/signup"}
                className="inline-flex items-center gap-2 px-7 py-3.5 text-white font-semibold text-[13px] tracking-wide rounded-lg transition-all duration-200 shadow-sm"
                style={{ background: '#E4574E' }}
              >
                Get Started Free
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
              <a
                href="#about"
                className="px-7 py-3.5 border border-gray-300 text-gray-700 text-[13px] font-medium rounded-lg hover:border-gray-400 hover:bg-white/60 transition-all duration-200"
              >
                Learn More
              </a>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-8 lg:gap-12">
              {[
                { value: "10K+", label: "Users Helped" },
                { value: "98%", label: "Satisfaction" },
                { value: "24/7", label: "AI Support" },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-gray-900 text-2xl font-bold tracking-tight">{stat.value}</div>
                  <div className="text-gray-500 text-[11px] tracking-wide mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>


        </div>
      </div>
    </section>
  );
};

export default Hero;