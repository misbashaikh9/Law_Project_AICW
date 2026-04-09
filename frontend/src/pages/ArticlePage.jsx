import { useParams, Link, useNavigate } from "react-router-dom";
import LawNavbar from "./LawNavbar";
import LawFooter from "./LawFooter";
import { blogPosts } from "./BlogPage";

const ArticlePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const post = blogPosts.find((p) => p.id === parseInt(id));

  if (!post) {
    return (
      <div className="bg-white min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-[#18181b] mb-4">Article Not Found</h2>
        <button
          onClick={() => navigate('/blogs')}
          className="px-6 py-2.5 bg-[#E4574E] text-white font-semibold rounded-lg hover:bg-[#c13d36] transition-all"
        >
          Back to Blog
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <LawNavbar />

      {/* Hero section */}
      <section className="relative pt-32 pb-16 bg-gradient-to-br from-[#18181b] via-[#1f1f23] to-[#2a2a30]">
        <div className="max-w-4xl mx-auto px-8 lg:px-12 relative z-10 text-center">
          <Link to="/blogs" className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-8 text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to Articles
          </Link>

          <div className="mb-6 flex justify-center">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E4574E]/10 border border-[#E4574E]/20 text-[#E4574E] text-[12px] tracking-[0.12em] uppercase font-semibold">
              {post.category}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center justify-center gap-4 text-sm text-white/50">
            <span className="font-medium text-white">{post.author}</span>
            <span>•</span>
            <span>{post.date}</span>
            <span>•</span>
            <span>{post.readTime}</span>
          </div>
        </div>
      </section>

      {/* Article Image */}
      <div className="max-w-5xl mx-auto px-8 lg:px-12 -mt-10 relative z-20 w-full mb-12">
        <div className="rounded-2xl overflow-hidden shadow-2xl">
          <img src={post.image} alt={post.title} className="w-full h-[400px] object-cover" />
        </div>
      </div>

      {/* Article Content */}
      <section className="max-w-3xl mx-auto px-8 lg:px-12 pb-20 flex-1">
        <div className="prose prose-lg prose-red max-w-none text-gray-700">
          <p className="text-xl leading-relaxed text-gray-600 mb-8 border-l-4 border-[#E4574E] pl-6 italic">
            {post.excerpt}
          </p>

          <p className="mb-6">
            In recent years, the intersection of law and technology has seen an unprecedented acceleration. 
            Legal professionals, who have traditionally relied on volumes of case files and manual research, 
            are now finding themselves at the forefront of a technological revolution. This shift is not just 
            about adopting new tools; it's about fundamentally changing the way legal services are delivered 
            and consumed.
          </p>

          <h2 className="text-2xl font-bold text-[#18181b] mt-10 mb-4">The Impact of Digital Transformation</h2>
          
          <p className="mb-6">
            One of the most significant changes has been the digitization of legal records and the advent of 
            e-filing systems. This has dramatically reduced the time and cost associated with litigation preparation. 
            Furthermore, the introduction of cloud-based practice management software means that lawyers can now 
            manage their cases from anywhere in the world, ensuring greater flexibility and responsiveness to client needs.
          </p>

          <h2 className="text-2xl font-bold text-[#18181b] mt-10 mb-4">Looking Ahead</h2>

          <p className="mb-6">
            As we look to the future, it is clear that those who embrace these technological changes will be the 
            ones who thrive. The legal landscape is evolving, and staying ahead of the curve requires an ongoing 
            commitment to learning and adaptation. Whether you are an established practitioner or a recent law graduate, 
            understanding these tools is no longer optional—it is essential for long-term success.
          </p>
        </div>
        
        {/* Share buttons */}
        <div className="mt-12 pt-8 border-t border-gray-100 flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Share this article</span>
          <div className="flex gap-4">
            <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-[#E4574E] hover:text-white transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
            </button>
            <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-[#E4574E] hover:text-white transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
            </button>
          </div>
        </div>
      </section>

      <LawFooter />
    </div>
  );
};

export default ArticlePage;
