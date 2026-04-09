import { useState } from "react";
import { useNavigate } from "react-router-dom";

import LawNavbar from "./LawNavbar";
import LawFooter from "./LawFooter";

export const blogPosts = [
  {
    id: 1,
    category: "Legal Tech",
    title: "How AI is Transforming the Indian Legal Landscape",
    excerpt:
      "Artificial intelligence is reshaping how legal professionals work, from contract analysis to predictive case outcomes. Discover the key trends driving this transformation.",
    author: "Adv. Priya Sharma",
    date: "Mar 28, 2026",
    readTime: "6 min read",
    image:
      "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80",
    featured: true,
  },
  {
    id: 2,
    category: "Consumer Rights",
    title: "Your Rights Under the Consumer Protection Act, 2019",
    excerpt:
      "A comprehensive guide to understanding your rights as a consumer and the remedies available under the new Consumer Protection Act.",
    author: "Adv. Rahul Mehra",
    date: "Mar 22, 2026",
    readTime: "8 min read",
    image:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: 3,
    category: "Cyber Law",
    title: "Protecting Yourself from Online Fraud: A Legal Perspective",
    excerpt:
      "With the rise of digital transactions, cyber fraud is at an all-time high. Learn about the legal framework and steps to protect yourself.",
    author: "Adv. Sneha Kapoor",
    date: "Mar 18, 2026",
    readTime: "5 min read",
    image:
      "https://images.unsplash.com/photo-1563986768609-322da13575f2?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: 4,
    category: "Family Law",
    title: "Understanding Custody Laws in India: A Complete Guide",
    excerpt:
      "Custody disputes are emotionally complex. This guide walks you through the legal framework of child custody in Indian courts.",
    author: "Adv. Priya Sharma",
    date: "Mar 12, 2026",
    readTime: "7 min read",
    image:
      "https://images.unsplash.com/photo-1591115765373-5f9cf1da241c?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: 5,
    category: "Property Law",
    title: "Common Property Disputes and How to Resolve Them",
    excerpt:
      "Property disputes are among the most common cases in Indian courts. Learn about the types of disputes and effective resolution methods.",
    author: "Adv. Vikram Desai",
    date: "Mar 6, 2026",
    readTime: "6 min read",
    image:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: 6,
    category: "Labour Law",
    title: "Employee Rights You Probably Didn't Know About",
    excerpt:
      "From workplace harassment to unfair dismissal, Indian labour laws provide robust protections. Here's what every employee should know.",
    author: "Adv. Anita Roy",
    date: "Feb 28, 2026",
    readTime: "5 min read",
    image:
      "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600&auto=format&fit=crop&q=80",
  },
];

const categories = [
  "All",
  "Legal Tech",
  "Consumer Rights",
  "Cyber Law",
  "Family Law",
  "Property Law",
  "Labour Law",
];

const BlogPage = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const featuredPost = blogPosts.find((p) => p.featured);
  const filteredPosts = blogPosts
    .filter((p) => !p.featured)
    .filter(
      (p) => activeCategory === "All" || p.category === activeCategory
    )
    .filter(
      (p) =>
        searchQuery === "" ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <div className="bg-white min-h-screen">
      <LawNavbar />

      {/* Hero Banner */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-[#18181b] via-[#1f1f23] to-[#2a2a30] overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#E4574E]/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 right-20 w-96 h-96 bg-[#E4574E]/5 rounded-full blur-[120px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/[0.03] rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-white/[0.05] rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto px-8 lg:px-12 relative z-10">
          <div className="text-center">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E4574E]/10 border border-[#E4574E]/20 text-[#E4574E] text-[12px] tracking-[0.12em] uppercase font-semibold mb-6">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Our Blog
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-5 leading-tight">
              Legal <span className="text-[#E4574E]">Insights</span> &amp;
              <br className="hidden sm:block" /> Expert Analysis
            </h1>
            <p className="text-white/50 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              Stay informed with the latest legal trends, expert opinions, and in-depth
              analysis from our team of experienced legal professionals.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && (
        <section className="max-w-7xl mx-auto px-8 lg:px-12 -mt-12 relative z-20 mb-16">
          <div className="group bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden grid lg:grid-cols-2 gap-0 hover:shadow-2xl transition-all duration-500">
            <div className="relative overflow-hidden">
              <img
                src={featuredPost.image}
                alt={featuredPost.title}
                className="w-full h-64 lg:h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-full bg-[#E4574E] text-white text-[11px] font-semibold tracking-wide uppercase">
                  Featured
                </span>
              </div>
            </div>
            <div className="p-8 lg:p-12 flex flex-col justify-center">
              <span className="text-[#E4574E] text-[11px] tracking-[0.12em] uppercase font-semibold mb-3">
                {featuredPost.category}
              </span>
              <h2 className="text-2xl lg:text-3xl font-bold text-[#18181b] mb-4 leading-tight group-hover:text-[#E4574E] transition-colors duration-300">
                {featuredPost.title}
              </h2>
              <p className="text-[#23263a]/70 text-[15px] leading-relaxed mb-6">
                {featuredPost.excerpt}
              </p>
              <div className="flex items-center gap-4 text-sm text-[#23263a]/50">
                <span className="font-medium text-[#18181b]">{featuredPost.author}</span>
                <span>•</span>
                <span>{featuredPost.date}</span>
                <span>•</span>
                <span>{featuredPost.readTime}</span>
              </div>
              <button 
                onClick={() => navigate(`/blogs/${featuredPost.id}`)}
                className="mt-8 self-start inline-flex items-center gap-2 px-6 py-2.5 bg-[#18181b] text-white text-[13px] font-semibold rounded-lg hover:bg-[#E4574E] active:scale-95 transition-all duration-300"
              >
                Read Article
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Search + Filters */}
      <section className="max-w-7xl mx-auto px-8 lg:px-12 mb-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-[13px] font-medium transition-all duration-300 ${
                  activeCategory === cat
                    ? "bg-[#E4574E] text-white shadow-lg shadow-[#E4574E]/20"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full md:w-72">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm text-[#18181b] placeholder:text-gray-400 focus:outline-none focus:border-[#E4574E] focus:ring-1 focus:ring-[#E4574E]/20 transition-all duration-200"
            />
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="max-w-7xl mx-auto px-8 lg:px-12 pb-20">
        {filteredPosts.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post, index) => (
              <article
                key={post.id}
                onClick={() => navigate(`/blogs/${post.id}`)}
                className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 active:scale-[0.98] transition-all duration-500 cursor-pointer"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-52 object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-[11px] font-semibold text-[#18181b] tracking-wide">
                    {post.category}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-[#18181b] mb-3 leading-snug group-hover:text-[#E4574E] transition-colors duration-300 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-[#23263a]/60 text-sm leading-relaxed mb-5 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#E4574E] to-[#c13d36] flex items-center justify-center text-white text-[10px] font-bold">
                        {post.author.split(" ").slice(-1)[0][0]}
                      </div>
                      <span className="text-[12px] font-medium text-[#18181b]">
                        {post.author.replace("Adv. ", "")}
                      </span>
                    </div>
                    <span className="text-[11px] text-gray-400">{post.readTime}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <svg className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-[#18181b] mb-2">No articles found</h3>
            <p className="text-gray-500 text-sm">Try adjusting your search or category filter.</p>
          </div>
        )}
      </section>

      {/* Newsletter Section */}
      <section className="bg-gradient-to-br from-[#18181b] via-[#1f1f23] to-[#2a2a30] py-20 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#E4574E]/8 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-[#E4574E]/5 rounded-full blur-[80px]" />
        </div>
        <div className="max-w-3xl mx-auto px-8 text-center relative z-10">
          <div className="w-14 h-14 mx-auto mb-6 rounded-2xl bg-[#E4574E]/10 border border-[#E4574E]/20 flex items-center justify-center">
            <svg className="w-6 h-6 text-[#E4574E]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Stay Updated on <span className="text-[#E4574E]">Legal Matters</span>
          </h2>
          <p className="text-white/40 text-[15px] mb-8 max-w-lg mx-auto leading-relaxed">
            Subscribe to our newsletter and get the latest legal insights delivered straight to your inbox every week.
          </p>
          <form
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-5 py-3.5 rounded-xl bg-white/10 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-[#E4574E] transition-all duration-200"
            />
            <button
              type="submit"
              className="px-8 py-3.5 bg-[#E4574E] text-white font-semibold text-[13px] tracking-wide rounded-xl hover:bg-[#c13d36] transition-all duration-200 shrink-0"
            >
              Subscribe
            </button>
          </form>
          <p className="text-white/20 text-[11px] mt-4">No spam. Unsubscribe anytime.</p>
        </div>
      </section>

      <LawFooter />
    </div>
  );
};

export default BlogPage;
