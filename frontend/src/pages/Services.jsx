const services = [
  {
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
    title: "Fake Article Detection",
    description:
      "Our ML-powered engine scans and verifies legal articles, court orders, and case documents to detect fabricated or tampered content with high accuracy.",
    tag: "AI / ML",
  },
  {
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: "Lawyer Recommendation",
    description:
      "Get matched with the right legal expert based on your case type, jurisdiction, budget, and urgency — powered by intelligent recommendation algorithms.",
    tag: "Smart Matching",
  },
  {
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="M22 7l-10 6L2 7" />
      </svg>
    ),
    title: "Legal Email Drafting",
    description:
      "Generate professionally worded legal emails, notices, and demand letters using AI prompts tailored to Indian legal standards and formal communication protocols.",
    tag: "AI Prompt",
  },
  {
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
    title: "Document Generation",
    description:
      "Instantly create rent agreements, affidavits, legal notices, and compliance documents from pre-approved templates — ready for review and signature.",
    tag: "Automation",
  },
  {
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
        <line x1="8" y1="11" x2="14" y2="11" />
        <line x1="11" y1="8" x2="11" y2="14" />
      </svg>
    ),
    title: "Case Analysis & Research",
    description:
      "Upload case details and receive AI-driven analysis including severity assessment, legal category classification, and relevant precedent research.",
    tag: "Deep Analysis",
  },
  {
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        <path d="M8 9h8" />
        <path d="M8 13h6" />
      </svg>
    ),
    title: "24/7 AI Legal Assistant",
    description:
      "Get instant answers to legal queries, understand your rights, and receive step-by-step guidance on legal procedures — available around the clock.",
    tag: "Always On",
  },
];

const Services = () => {
  return (
    <section id="services" className="py-28 bg-white relative">
      {/* Thin top accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-px bg-[#E4574E]/40" />

      <div className="max-w-7xl mx-auto px-8 lg:px-12 flex flex-col items-center">
        {/* Call to Action Section */}
        <div className="w-full flex flex-col items-center text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-[#18181b] mb-10">Start Your Legal Consultation Today</h2>
          <p className="text-[#23263a] text-base mb-10">Get instant legal guidance powered by AI.</p>
          <a href="/chat" className="inline-block px-6 py-3 rounded-lg bg-[#E4574E] text-white font-semibold shadow hover:bg-[#c13d36] transition-colors duration-200 mt-4">Start AI Chat</a>
        </div>


        {/* Cards grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {services.map((service) => (
            <div
              key={service.title}
              className="group relative bg-white p-8 shadow hover:shadow-lg transition-all duration-500 rounded-xl"
            >
              {/* Tag */}
              <span className="absolute top-6 right-6 text-[10px] tracking-[0.15em] uppercase text-[#E4574E] font-medium group-hover:text-[#c13d36] transition-colors duration-300">
                {service.tag}
              </span>

              {/* Icon */}
              <div className="mb-6" style={{ color: '#E4574E' }}>
                {service.icon}
              </div>

              {/* Title */}
              <h3 className="text-lg font-semibold text-[#18181b] mb-3 group-hover:text-[#18181b] transition-colors duration-200">
                {service.title}
              </h3>

              {/* Description */}
              <p className="text-[#23263a] text-sm leading-[1.8] group-hover:text-[#18181b]/70 transition-colors duration-300">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
