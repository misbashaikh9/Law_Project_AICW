import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import "./Chat.css";

const starterPrompts = [
  "My employer is not depositing my provident fund and salary is delayed.",
  "The builder has delayed possession of my flat and is ignoring RERA commitments.",
  "Someone used my Aadhaar and bank details for online fraud.",
];

const buildErrorMessage = (error) => {
  const status = error.response?.status;
  const code   = error.response?.data?.code;

  if (status === 503 || code === "AI_TEMPORARILY_UNAVAILABLE") {
    return "The AI service is waking up or temporarily busy. Please try again in a few seconds.";
  }
  if (status === 400) {
    return "Please enter a clearer description before sending the request.";
  }
  if (status === 404) {
    return "Chat API endpoint not found. Check that the backend exposes POST /api/ai/query.";
  }
  return "The AI service could not analyze that issue just now. Try again in a moment.";
};

// Renders full_response text line by line preserving all formatting
function RichResponse({ text }) {
  return (
    <div className="chat-rich-response">
      {text.split("\n").map((line, i) => {
        const trimmed = line.trim();

        // Empty line → spacer
        if (!trimmed) {
          return <div key={i} className="chat-rich-spacer" />;
        }

        // Section headings: lines starting with a digit like "2." "3." "4."
        if (/^\d+\./.test(trimmed)) {
          return <p key={i} className="chat-rich-heading">{trimmed}</p>;
        }

        // Step lines: "Step 1:" "Step 2:" etc.
        if (/^Step \d+:/i.test(trimmed)) {
          return <p key={i} className="chat-rich-step">{trimmed}</p>;
        }

        // Default line
        return <p key={i} className="chat-rich-line">{trimmed}</p>;
      })}
    </div>
  );
}

export default function Chat() {
  const [messages, setMessages]  = useState([]);
  const [input,    setInput]     = useState("");
  const [loading,  setLoading]   = useState(false);
  // Lawyer recommendation UI state
  const [showLawyerPrompt, setShowLawyerPrompt] = useState(false);
  const [lawyerChoices, setLawyerChoices] = useState([]);
  const [selectedLawyer, setSelectedLawyer] = useState(null);
  const warmupPromiseRef = useRef(null);
  const bottomRef        = useRef(null);
  const [abortController, setAbortController] = useState(null);

  const resetConversation = () => {
    if (loading) return;
    setMessages([]);
    setInput("");
  };

  const sendMessage = async (presetQuestion) => {
    const question = (presetQuestion ?? input).trim();
    if (!question || loading) return;

    if (warmupPromiseRef.current) {
      try   { await warmupPromiseRef.current; }
      catch (e) { console.error("Warmup failed:", e); }
      finally   { warmupPromiseRef.current = null; }
    }

    setMessages((prev) => [...prev, { type: "user", text: question }]);
    setInput("");
    setLoading(true);

    // Create and set AbortController
    const controller = new AbortController();
    setAbortController(controller);

    try {
      // Backend proxies to ai-service /predict (see backend/routes/ai.js)
      const res = await API.post(
        "/api/ai/query",
        { question: question },
        { signal: controller.signal }
      );

      const { category, severity, action, solution, legal_info, lawyers, error } = res.data;

      if (error) {
        setMessages((prev) => [...prev, { type: "ai", text: `Error: ${error}` }]);
        setShowLawyerPrompt(false);
        setLawyerChoices([]);
        setSelectedLawyer(null);
        return;
      }

      setMessages((prev) => [
        ...prev,
        {
          type: "ai",
          solution,
          legal_info,
          action,
          category,
          severity,
          lawyers,
        },
      ]);

      // Helper: detect lawyer recommendation in text
      const mentionsLawyer = (txt) => {
        if (!txt) return false;
        const patterns = [
          /consult (an? )?lawyer/i,
          /seek (legal )?counsel/i,
          /contact (an? )?attorney/i,
          /advis(e|ory) (from|with) (an? )?lawyer/i,
          /legal (advice|assistance|help)/i,
          /professional legal guidance/i,
        ];
        return patterns.some((re) => re.test(txt));
      };

      // If lawyers are present, show the prompt after Groq response
      if (lawyers && lawyers.length > 0) {
        setShowLawyerPrompt(true);
        setLawyerChoices(lawyers);
        setSelectedLawyer(null);
      } else if (mentionsLawyer(solution) || mentionsLawyer(action)) {
        // If solution or action text suggests a lawyer, show generic prompt
        setShowLawyerPrompt(true);
        setLawyerChoices([]); // No specific lawyers, but show prompt
        setSelectedLawyer(null);
      } else {
        setShowLawyerPrompt(false);
        setLawyerChoices([]);
        setSelectedLawyer(null);
      }
    } catch (err) {
      if (err.name === "CanceledError" || err.name === "AbortError") {
        setMessages((prev) => [...prev, { type: "ai", text: "Analysis stopped by user." }]);
      } else {
        console.error(err);
        setMessages((prev) => [
          ...prev,
          { type: "ai", text: buildErrorMessage(err) },
        ]);
      }
    } finally {
      setLoading(false);
      setAbortController(null);
    }
  };

  const handleComposerKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  

  return (
    <div className="chat-page">
      <div className="chat-layout">

        {/* Sidebar */}
        <aside className="chat-sidebar" aria-label="Chat navigation">
          <div className="chat-sidebar__top">
            <Link to="/" className="chat-sidebar__back" aria-label="Back to home">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
                strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M15 18l-6-6 6-6" />
              </svg>
              <span>Back to home</span>
            </Link>

            <div className="chat-sidebar__brand">
              <p className="chat-sidebar__eyebrow">LawBridge AI</p>
              <h1 className="chat-sidebar__title">Legal assistant</h1>
            </div>

            <button type="button" className="chat-sidebar__new" onClick={resetConversation}>
              New analysis
            </button>
          </div>

          <div className="chat-sidebar__section">
            <p className="chat-sidebar__label">Suggested prompts</p>
            <div className="chat-sidebar__prompts" aria-label="Suggested prompts">
              {starterPrompts.map((prompt) => (
                <button key={prompt} type="button"
                  className="chat-sidebar__prompt"
                  onClick={() => sendMessage(prompt)}>
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          <div className="chat-sidebar__section chat-sidebar__section--note">
            <p className="chat-sidebar__label">Best results</p>
            <p className="chat-sidebar__note">
              Include what happened, who was involved, and what loss or harm occurred.
            </p>
          </div>
        </aside>

        {/* Main workspace */}
        <main className="chat-workspace" aria-label="LawBridge chat workspace">
          <header className="chat-workspace__header">
            <div>
              <p className="chat-workspace__eyebrow">Legal issue analysis</p>
              <h2 className="chat-workspace__title">Describe the matter in plain language</h2>
            </div>
            <p className="chat-workspace__subtitle">
              The assistant will explain the applicable law and steps you should take.
            </p>
          </header>

          <div className="chat-messages">
            {messages.length === 0 && !loading && (
              <div className="chat-empty-state">
                <div className="chat-empty-state__badge">Ready</div>
                <h3 className="chat-empty-state__title">Start a new legal analysis</h3>
                <p className="chat-empty-state__body">
                  Use the prompt box below or choose a suggested issue from the sidebar.
                </p>
              </div>
            )}


            {messages.map((msg, index) => (
              <div key={`${msg.type}-${index}`}
                className={`chat-message chat-message--${msg.type}`}>
                <div className="chat-message__avatar">
                  {msg.type === "user" ? "You" : "AI"}
                </div>

                <div className="chat-message__bubble">
                  {/* AI message with rich Groq response */}
                  {msg.type === "ai" && (msg.solution || msg.legal_info) ? (
                    <>
                      {msg.solution && (
                        <div className="chat-section">
                          <h4 className="chat-section__title">AI Solution</h4>
                          <RichResponse text={msg.solution} />
                        </div>
                      )}
                      {msg.legal_info && (
                        <div className="chat-section">
                          <h4 className="chat-section__title">Legal Info</h4>
                          <RichResponse text={msg.legal_info} />
                        </div>
                      )}
                      {(msg.category || msg.severity || msg.action) && (
                        <div className="chat-message__meta-row">
                          {msg.category && (
                            <span className="chat-chip">{msg.category}</span>
                          )}
                          {msg.severity && (
                            <span className={`chat-chip chat-chip--${msg.severity.toLowerCase()}`}>
                              {msg.severity}
                            </span>
                          )}
                          {msg.action && (
                            <span className="chat-chip chat-chip--action">{msg.action}</span>
                          )}
                        </div>
                      )}
                      {/* Lawyer recommendation prompt and choices */}
                      {index === messages.length - 1 && showLawyerPrompt && lawyerChoices.length > 0 && !selectedLawyer && (
                        <div className="chat-lawyer-recommend" style={{ marginTop: 24, textAlign: 'center' }}>
                          <p style={{ fontWeight: 600, fontSize: 18, marginBottom: 16 }}>Would you like a lawyer recommendation?</p>
                          <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
                            <button className="chat-lawyer-btn" style={{ padding: '10px 24px', borderRadius: 8, border: '1px solid #ccc', background: '#fff', color: '#E4574E', fontWeight: 600, cursor: 'pointer' }} onClick={() => setShowLawyerPrompt(false)}>No Thanks</button>
                            <button className="chat-lawyer-btn chat-lawyer-btn--primary" style={{ padding: '10px 24px', borderRadius: 8, border: 'none', background: '#E4574E', color: '#fff', fontWeight: 600, cursor: 'pointer', boxShadow: '0 2px 8px #e4574e22' }} onClick={() => setShowLawyerPrompt('choose')}>Want a Lawyer Recommendation?</button>
                          </div>
                        </div>
                      )}
                      {/* Show lawyer choices if user wants recommendation */}
                      {index === messages.length - 1 && showLawyerPrompt === 'choose' && lawyerChoices.length > 0 && !selectedLawyer && (
                        <div className="chat-lawyer-choices" style={{ marginTop: 24 }}>
                          <p style={{ fontWeight: 600, fontSize: 17, marginBottom: 16 }}>Select a lawyer:</p>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            {lawyerChoices.map((lawyer, i) => (
                              <button
                                key={i}
                                className="chat-lawyer-choice"
                                style={{
                                  display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
                                  padding: 18, borderRadius: 12, border: '1.5px solid #E4574E', background: '#fff', cursor: 'pointer',
                                  boxShadow: '0 2px 8px #e4574e11', transition: 'box-shadow 0.2s',
                                  fontSize: 16, fontWeight: 500, color: '#222',
                                }}
                                onClick={() => setSelectedLawyer(lawyer)}
                                onMouseOver={e => e.currentTarget.style.boxShadow = '0 4px 16px #e4574e33'}
                                onMouseOut={e => e.currentTarget.style.boxShadow = '0 2px 8px #e4574e11'}
                              >
                                <span style={{ fontSize: 18, fontWeight: 700, color: '#E4574E' }}>{lawyer.name}</span>
                                <span style={{ fontSize: 14, color: '#555', margin: '2px 0 4px 0' }}>{lawyer.specialization} • {lawyer.qualification}</span>
                                <span style={{ fontSize: 14, color: '#888' }}>⭐ {lawyer.rating} &nbsp; | &nbsp; {lawyer.experience} yrs exp &nbsp; | &nbsp; ₹{lawyer.fees} fees</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      {/* Show selected lawyer details */}
                      {index === messages.length - 1 && selectedLawyer && (
                        <div className="chat-lawyer-details" style={{ marginTop: 28, border: '1.5px solid #E4574E', borderRadius: 14, background: '#fff', padding: 24, maxWidth: 400, marginLeft: 'auto', marginRight: 'auto', boxShadow: '0 2px 12px #e4574e11' }}>
                          <h4 style={{ color: '#E4574E', fontWeight: 800, fontSize: 22, marginBottom: 12 }}>Lawyer Details</h4>
                          <p><b>Name:</b> {selectedLawyer.name}</p>
                          <p><b>Specialization:</b> {selectedLawyer.specialization}</p>
                          <p><b>Location:</b> {selectedLawyer.location}</p>
                          <p><b>Experience:</b> {selectedLawyer.experience} years</p>
                          <p><b>Rating:</b> {selectedLawyer.rating}★</p>
                          <p><b>Fees:</b> ₹{selectedLawyer.fees}</p>
                          <p><b>Cases handled:</b> {selectedLawyer.cases}</p>
                          <p><b>Qualification:</b> {selectedLawyer.qualification}</p>
                          <p><b>Contact:</b> {selectedLawyer.contact}</p>
                          <button className="chat-lawyer-btn" style={{ marginTop: 16, padding: '8px 20px', borderRadius: 8, border: '1px solid #ccc', background: '#fff', color: '#E4574E', fontWeight: 600, cursor: 'pointer' }} onClick={() => setSelectedLawyer(null)}>Back to list</button>
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="chat-message__text">{msg.text}</p>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="chat-message chat-message--ai">
                <div className="chat-message__avatar">AI</div>
                <div className="chat-message__bubble chat-message__bubble--loading">
                  <span className="chat-typing-dot" />
                  <span className="chat-typing-dot" />
                  <span className="chat-typing-dot" />
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Composer */}
          <div className="chat-composer">
            <div className="chat-composer__row">
              <textarea
                id="legal-issue-input"
                className="chat-composer__input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleComposerKeyDown}
                placeholder="Describe your legal issue..."
                rows={3}
              />
              <button type="button"
                onClick={() => sendMessage()}
                className="chat-composer__button"
                disabled={loading}>
                {loading ? "Analyzing..." : "Analyze"}
              </button>
              {loading && (
                <button
                  type="button"
                  className="chat-composer__button"
                  style={{ background: '#E4574E', marginLeft: 8 }}
                  onClick={() => {
                    if (abortController) abortController.abort();
                  }}
                >
                  Stop
                </button>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}