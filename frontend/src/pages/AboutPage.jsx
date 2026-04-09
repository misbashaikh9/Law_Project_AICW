import { Link } from "react-router-dom";
import LawNavbar from "./LawNavbar";
import LawFooter from "./LawFooter";

const teamMembers = [
  {
    name: "Adv. Priya Sharma",
    role: "Founder & Lead Counsel",
    bio: "15+ years of experience in corporate and cyber law. Former Senior Advocate at the High Court of Mumbai.",
    initials: "PS",
  },
  {
    name: "Adv. Rahul Mehra",
    role: "Senior Legal Advisor",
    bio: "Specializes in consumer protection and property law with a track record of 500+ successful cases.",
    initials: "RM",
  },
  {
    name: "Adv. Sneha Kapoor",
    role: "Head of AI & Legal Tech",
    bio: "Pioneering the integration of AI in legal research. Masters in Law & Technology from NLU Delhi.",
    initials: "SK",
  },
  {
    name: "Adv. Vikram Desai",
    role: "Family & Criminal Law",
    bio: "Dedicated advocate for family rights and criminal defense with expertise in district and sessions courts.",
    initials: "VD",
  },
];

const milestones = [
  { year: "2021", title: "Founded", desc: "LawBridge AI was established with a vision to democratize legal access across India." },
  { year: "2022", title: "AI Integration", desc: "Launched our AI-powered legal analysis engine, trained on Indian legal databases." },
  { year: "2023", title: "Pan-India Reach", desc: "Expanded services to cover all 28 states with multi-language support." },
  { year: "2024", title: "10,000+ Cases", desc: "Crossed the milestone of 10,000 successfully resolved legal consultations." },
  { year: "2025", title: "Award Winning", desc: "Recognized as India's Most Innovative Legal Tech Platform at TechLaw Summit." },
];

const values = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    title: "Trust & Integrity",
    desc: "We uphold the highest ethical standards in every case we handle.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    ),
    title: "People First",
    desc: "Every client's concern matters. We listen, understand, and deliver personalized solutions.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
    title: "Innovation",
    desc: "We leverage cutting-edge AI technology to make legal guidance faster and more accurate.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
      </svg>
    ),
    title: "Accessibility",
    desc: "Quality legal help should be available to everyone, regardless of background or budget.",
  },
];

const stats = [
  { value: "10,000+", label: "Cases Resolved" },
  { value: "50+", label: "Legal Experts" },
  { value: "28", label: "States Covered" },
  { value: "98%", label: "Client Satisfaction" },
];

const AboutPage = () => {
  return (
    <div className="bg-white min-h-screen">
      <LawNavbar />

      {/* Hero */}
      <section className="relative pt-32 pb-24 bg-gradient-to-br from-[#18181b] via-[#1f1f23] to-[#2a2a30] overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 right-20 w-80 h-80 bg-[#E4574E]/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-10 left-10 w-64 h-64 bg-[#E4574E]/5 rounded-full blur-[80px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-white/[0.03] rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto px-8 lg:px-12 relative z-10">
          <div className="text-center">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E4574E]/10 border border-[#E4574E]/20 text-[#E4574E] text-[12px] tracking-[0.12em] uppercase font-semibold mb-6">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0 0 12 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 0 1-2.031.352 5.988 5.988 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971Zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 0 1-2.031.352 5.989 5.989 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971Z" />
              </svg>
              About Us
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-5 leading-tight">
              Bridging the Gap Between
              <br className="hidden sm:block" />
              <span className="text-[#E4574E]">People</span> &amp; the Law
            </h1>
            <p className="text-white/50 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              We combine cutting-edge AI technology with deep legal expertise to make
              justice accessible, affordable, and understandable for everyone.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="relative z-20 -mt-10">
        <div className="max-w-5xl mx-auto px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-0 bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className={`text-center py-8 px-4 ${
                  i < stats.length - 1 ? "md:border-r md:border-gray-100" : ""
                }`}
              >
                <p className="text-3xl font-bold text-[#E4574E] mb-1">{stat.value}</p>
                <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-8 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-block text-[#E4574E] text-[12px] tracking-[0.15em] uppercase font-semibold mb-4">
                Our Mission
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-[#18181b] mb-6 leading-tight">
                Making Quality Legal Guidance{" "}
                <span className="text-[#E4574E]">Accessible</span> to All
              </h2>
              <p className="text-[#23263a]/70 text-[15px] leading-[1.8] mb-5">
                LawBridge AI was founded with a singular mission: to democratize access to
                quality legal guidance. We believe that understanding your legal rights
                shouldn't require expensive consultations or complex jargon.
              </p>
              <p className="text-[#23263a]/70 text-[15px] leading-[1.8] mb-8">
                Whether you're navigating a workplace dispute, consumer fraud, family issue,
                property matter, or cyber complaint — our experienced team of attorneys and
                AI-powered platform stand with you every step of the way.
              </p>
              <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                {[
                  "Certified Legal AI",
                  "100% Confidential",
                  "Pan-India Coverage",
                  "Instant Response",
                  "24/7 Availability",
                  "Multi-Language Support",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#E4574E]/10 flex items-center justify-center shrink-0">
                      <svg className="w-3 h-3 text-[#E4574E]" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </div>
                    <span className="text-[#18181b] text-sm font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="overflow-hidden rounded-2xl">
                <img
                  src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=700&auto=format&fit=crop&q=80"
                  alt="Legal professionals in consultation"
                  className="w-full h-[500px] object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white shadow-xl border border-gray-100 px-8 py-6 rounded-2xl">
                <p className="text-3xl font-bold text-[#E4574E]">5+</p>
                <p className="text-[#23263a]/70 text-xs tracking-[0.1em] uppercase mt-1 font-medium">
                  Years of Service
                </p>
              </div>
              <div className="absolute -top-4 -right-4 w-full h-full border-2 border-[#E4574E]/20 rounded-2xl -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-[#fafafa]">
        <div className="max-w-7xl mx-auto px-8 lg:px-12">
          <div className="text-center mb-16">
            <span className="inline-block text-[#E4574E] text-[12px] tracking-[0.15em] uppercase font-semibold mb-4">
              Our Values
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#18181b] mb-4">
              What We <span className="text-[#E4574E]">Stand</span> For
            </h2>
            <p className="text-[#23263a]/60 text-[15px] max-w-xl mx-auto leading-relaxed">
              Our core values guide every decision we make and every case we handle.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <div
                key={v.title}
                className="group bg-white rounded-2xl border border-gray-100 p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-500 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#E4574E] to-[#c13d36] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                <div className="w-12 h-12 rounded-xl bg-[#E4574E]/10 text-[#E4574E] flex items-center justify-center mb-5 group-hover:bg-[#E4574E] group-hover:text-white transition-all duration-300">
                  {v.icon}
                </div>
                <h3 className="text-lg font-bold text-[#18181b] mb-2">{v.title}</h3>
                <p className="text-[#23263a]/60 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-8 lg:px-12">
          <div className="text-center mb-16">
            <span className="inline-block text-[#E4574E] text-[12px] tracking-[0.15em] uppercase font-semibold mb-4">
              Our Journey
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#18181b] mb-4">
              Key <span className="text-[#E4574E]">Milestones</span>
            </h2>
          </div>
          <div className="relative max-w-3xl mx-auto">
            {/* Vertical line */}
            <div className="absolute left-6 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#E4574E] via-[#E4574E]/30 to-transparent" />

            <div className="space-y-12">
              {milestones.map((m, i) => (
                <div
                  key={m.year}
                  className={`relative flex items-start gap-8 ${
                    i % 2 === 0
                      ? "md:flex-row"
                      : "md:flex-row-reverse"
                  }`}
                >
                  {/* Dot */}
                  <div className="absolute left-6 md:left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#E4574E] border-4 border-white shadow-md z-10 mt-1.5" />

                  {/* Content card */}
                  <div className={`ml-16 md:ml-0 md:w-[calc(50%-2rem)] ${i % 2 === 0 ? "md:pr-8 md:text-right" : "md:pl-8"}`}>
                    <div className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-lg transition-all duration-300 group">
                      <span className="inline-block text-[#E4574E] font-bold text-lg mb-1">{m.year}</span>
                      <h3 className="text-lg font-bold text-[#18181b] mb-2 group-hover:text-[#E4574E] transition-colors duration-300">
                        {m.title}
                      </h3>
                      <p className="text-[#23263a]/60 text-sm leading-relaxed">{m.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 bg-[#fafafa]">
        <div className="max-w-7xl mx-auto px-8 lg:px-12">
          <div className="text-center mb-16">
            <span className="inline-block text-[#E4574E] text-[12px] tracking-[0.15em] uppercase font-semibold mb-4">
              Our Team
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#18181b] mb-4">
              Meet Our <span className="text-[#E4574E]">Experts</span>
            </h2>
            <p className="text-[#23263a]/60 text-[15px] max-w-xl mx-auto leading-relaxed">
              A dedicated team of legal professionals and technologists working together to transform legal services.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member) => (
              <div
                key={member.name}
                className="group bg-white rounded-2xl border border-gray-100 p-8 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-500 relative overflow-hidden"
              >
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#E4574E] to-[#c13d36] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center" />
                <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-gradient-to-br from-[#E4574E] to-[#c13d36] flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-[#E4574E]/20 group-hover:scale-110 transition-transform duration-300">
                  {member.initials}
                </div>
                <h3 className="text-lg font-bold text-[#18181b] mb-1">{member.name}</h3>
                <p className="text-[#E4574E] text-[11px] tracking-[0.1em] uppercase font-semibold mb-3">
                  {member.role}
                </p>
                <p className="text-[#23263a]/60 text-sm leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-[#18181b] via-[#1f1f23] to-[#2a2a30] py-20 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/3 w-72 h-72 bg-[#E4574E]/8 rounded-full blur-[100px]" />
        </div>
        <div className="max-w-3xl mx-auto px-8 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Get <span className="text-[#E4574E]">Started</span>?
          </h2>
          <p className="text-white/40 text-[15px] mb-8 max-w-lg mx-auto leading-relaxed">
            Schedule your free consultation today and navigate your legal matters with confidence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="px-10 py-3.5 bg-[#E4574E] text-white font-semibold text-[13px] tracking-wide rounded-lg hover:bg-[#c13d36] transition-all duration-200 inline-flex items-center gap-2"
            >
              Free Consultation
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              to="/chat"
              className="px-10 py-3.5 border border-white/20 text-white font-semibold text-[13px] tracking-wide rounded-lg hover:border-[#E4574E] hover:text-[#E4574E] transition-all duration-200"
            >
              Try AI Chat
            </Link>
          </div>
        </div>
      </section>

      <LawFooter />
    </div>
  );
};

export default AboutPage;
