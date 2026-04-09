const About = () => {
  return (
    <section id="about" className="py-28 bg-[#F5F5F5] relative">
      <div className="max-w-7xl mx-auto px-8 lg:px-12">
        {/* Section label */}
        <span className="inline-block text-[#E4574E] text-[12px] tracking-[0.15em] uppercase font-semibold mb-4">About Our Firm</span>

        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Text */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#18181b] leading-[1.15] mb-8">
              Bridging the Gap Between
              <br />
              <span className="text-[#E4574E]">People</span> & the Law
            </h2>
            <p className="text-[#23263a] leading-[1.8] mb-5 text-[15px]">
              LawBridge AI was founded with a singular mission: to make quality legal guidance
              affordable, accessible, and understandable. We combine cutting-edge artificial
              intelligence with deep expertise in Indian legal matters to deliver clarity
              when you need it most.
            </p>
            <p className="text-[#23263a] leading-[1.8] mb-10 text-[15px]">
              Whether you're navigating a workplace dispute, consumer fraud, family issue,
              property matter, or cyber complaint — our experienced team of attorneys and
              AI-powered platform stand with you every step of the way.
            </p>

            {/* Minimal feature list */}
            <div className="grid grid-cols-2 gap-y-5 gap-x-8 mb-10">
              {[
                "Certified Legal AI",
                "100% Confidential",
                "Pan-India Coverage",
                "Instant Response",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 bg-[#E4574E] rounded-full shrink-0" />
                  <span className="text-[#18181b] text-sm font-medium">{item}</span>
                </div>
              ))}
            </div>

            <a
              href="#practice"
              className="inline-flex items-center gap-3 text-[#E4574E] text-[13px] tracking-[0.08em] uppercase font-semibold group"
            >
              View Our Practice Areas
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </div>

          {/* Image */}
          <div className="relative pb-8 pr-4">
            <div className="overflow-hidden rounded-lg">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=700&auto=format&fit=crop&q=80"
                alt="Legal professionals in consultation"
                className="w-full h-[540px] object-cover grayscale-[20%]"
              />
            </div>
            {/* Accent border */}
            <div className="absolute -bottom-0 -right-0 w-full h-full border border-[#E4574E] rounded-lg -z-10 translate-x-4 translate-y-4" />
            {/* Floating stat */}
            <div className="absolute -bottom-2 left-6 bg-white shadow-lg border border-[#E4574E] px-8 py-5 rounded-xl">
              <p className="text-3xl font-bold text-[#E4574E]">5+</p>
              <p className="text-[#23263a] text-xs tracking-[0.1em] uppercase mt-1">Years of Service</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
