import { useEffect } from "react";

const reasons = [
  {
    title: "Proven Track Record",
    description:
      "Over 500 cases handled successfully with a 98% client satisfaction rate across all practice areas.",
  },
  {
    title: "24/7 AI Assistance",
    description:
      "Our AI-powered platform provides instant legal guidance any time of day, so you never have to wait.",
  },
  {
    title: "Expert Legal Team",
    description:
      "A dedicated team of experienced attorneys specializing in Indian law across multiple jurisdictions.",
  },
  {
    title: "Complete Confidentiality",
    description:
      "Enterprise-grade encryption and strict privacy policies ensure your sensitive information stays protected.",
  },
  {
    title: "Transparent Pricing",
    description:
      "No hidden fees or surprise charges. Clear, upfront pricing with flexible consultation plans.",
  },
  {
    title: "Document Generation",
    description:
      "Instantly generate legal notices, complaint letters, and request templates tailored to your case.",
  },
];

const WhyChooseUs = () => {
  useEffect(() => {
    const handleScroll = () => {
      const cards = document.querySelectorAll(".parallax-card");

      cards.forEach((card, i) => {
        const rect = card.getBoundingClientRect();
        const offset = window.innerHeight - rect.top;

        // Smooth parallax effect
        const translateY = offset * 0.03 * (i % 2 === 0 ? 1 : -1);

        card.style.transform = `translateY(${translateY}px)`;
      });
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section id="why-us" className="py-24 bg-[#f8f8f8] relative overflow-hidden">
      {/* Top line */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#E4574E] to-transparent" />

      <div className="max-w-7xl mx-auto px-8 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-20 items-start">
          
          {/* Left Section */}
          <div className="lg:sticky lg:top-32">
            <span className="inline-block text-[#E4574E] text-[12px] tracking-[0.15em] uppercase font-semibold mb-4">
              Why Choose Us
            </span>

            <h2 className="text-3xl md:text-4xl font-bold text-[#18181b] leading-[1.15] mb-8">
              Legal Excellence
              <br />
              You Can <span className="text-[#E4574E]">Trust</span>
            </h2>

            <p className="text-[#23263a] leading-[1.8] text-[15px] mb-12 max-w-md">
              We combine traditional legal expertise with modern AI technology
              to deliver unparalleled service and results.
            </p>
          </div>

          {/* Right Section (Cards) */}
          <div className="overflow-x-auto scrollbar-hide">
  <div className="flex gap-6 w-max py-4">
    {reasons.map((reason, i) => (
      <div
        key={reason.title}
        className="min-w-[300px] max-w-[320px] bg-white rounded-xl shadow-sm p-7 flex gap-5 items-start border border-[#E4574E]/20 hover:border-[#E4574E] hover:-translate-y-2 transition-all duration-300"
      >
        <span className="text-[#E4574E] text-[24px] font-bold">
          {String(i + 1).padStart(2, "0")}
        </span>

        <div>
          <h3 className="text-lg font-semibold text-[#18181b] mb-2">
            {reason.title}
          </h3>
          <p className="text-[#23263a] text-sm leading-[1.7]">
            {reason.description}
          </p>
        </div>
      </div>
    ))}
  </div>
</div>

        </div>
      </div>

      {/* Bottom line */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#E4574E] to-transparent" />
    </section>
  );
};

export default WhyChooseUs;
