import { useEffect, useRef, useState } from "react";
import FeedbackSection from "../components/FeedbackSection";
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
  // New state for email and lawyer features
  const [emailNeeded, setEmailNeeded] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailContent, setEmailContent] = useState(null);
  // Lawyer recommendation UI state
  const [showLawyerPrompt, setShowLawyerPrompt] = useState(false);
  const [lawyerChoices, setLawyerChoices] = useState([]);
  const [selectedLawyer, setSelectedLawyer] = useState(null);
  // Add interactionId to state
  const [interactionId, setInteractionId] = useState(null);
  const warmupPromiseRef = useRef(null);
  const bottomRef        = useRef(null);
  const [abortController, setAbortController] = useState(null);

  const resetConversation = () => {
    if (loading) return;
    setMessages([]);
    setInput("");
  };

  // Enhanced sendMessage for new API and state
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
    setEmailNeeded(false);
    setEmailContent(null);

    // Create and set AbortController
    const controller = new AbortController();
    setAbortController(controller);

    try {
      // Directly call the AI service /predict endpoint
      const res = await API.post(
        "https://law-project-aicw-ai-service.onrender.com/predict",
        { text: question },
        { signal: controller.signal }
      );

      const { solution, legal_info, lawyers, error, email_needed } = res.data;

      if (error) {
        setMessages((prev) => [...prev, { type: "ai", text: `Error: ${error}` }]);
        setShowLawyerPrompt(false);
        setLawyerChoices([]);
        setSelectedLawyer(null);
        setEmailNeeded(false);
        return;
      }

      setMessages((prev) => [
        ...prev,
        {
          type: "ai",
          solution,
          legal_info,
          lawyers,
          email_needed,
        },
      ]);
      setEmailNeeded(!!email_needed);
      setShowLawyerPrompt(lawyers && lawyers.length > 0);
      setLawyerChoices(lawyers || []);
      setSelectedLawyer(null);
      // Save interaction to backend and set interactionId
      try {
        const userId = localStorage.getItem("userId");
        const saveRes = await API.post(
          process.env.REACT_APP_BACKEND_URL + "/api/save-interaction",
          {
            userId,
            question,
            solution,
            legal_info,
            lawyers,
            email_needed,
          }
        );
        if (saveRes.data && saveRes.data.interactionId) {
          setInteractionId(saveRes.data.interactionId);
        } else {
          setInteractionId(null);
        }
      } catch (e) {
        setInteractionId(null);
        console.error("Failed to save interaction:", e);
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
                  {/* AI message with rich Groq response and action buttons */}
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
                      {/* Action Buttons: Generate Email & Find Lawyer */}
                      {index === messages.length - 1 && (
                        <>
                          <div className="text-xs text-gray-500 mb-1 ml-0.5">Choose an action:</div>
                          <div className="flex flex-row gap-2 mt-2">
                          {msg.email_needed && (
                            <button
                              className="px-3 py-1.5 rounded-md bg-[#E4574E] text-white font-medium text-sm shadow-sm border border-[#e4574e] focus:outline-none focus:ring-2 focus:ring-[#e4574e]/40 focus:ring-offset-1 hover:bg-[#c13d36] active:bg-[#a32d28] transition-all duration-150"
                              style={{ minWidth: 110 }}
                              disabled={emailLoading}
                              onClick={async () => {
                                setEmailLoading(true);
                                try {
                                  const res = await API.post(
                                    "https://law-project-aicw-ai-service.onrender.com/generate-email",
                                    { text: messages.find(m => m.type === "user" && m.text)?.text || input }
                                  );
                                  setEmailContent(res.data.email);
                                  setMessages(prev => ([
                                    ...prev,
                                    { type: "ai", solution: null, legal_info: null, text: null, email: res.data.email, isEmail: true }
                                  ]));
                                } catch (e) {
                                  setMessages(prev => ([...prev, { type: "ai", text: "Failed to generate email." }]));
                                } finally {
                                  setEmailLoading(false);
                                }
                              }}
                            >
                              {emailLoading ? (
                                <span className="flex items-center gap-1">
                                  <svg className="animate-spin h-4 w-4 mr-1 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
                                  Generating...
                                </span>
                              ) : (
                                <span>Generate Email</span>
                              )}
                            </button>
                          )}
                          <button
                            className="px-3 py-1.5 rounded-md border border-[#E4574E] text-[#E4574E] font-medium text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#e4574e]/30 focus:ring-offset-1 hover:bg-[#fbeaea] active:bg-[#f7d6d3] transition-all duration-150"
                            style={{ minWidth: 100 }}
                            onClick={() => {
                              setShowLawyerPrompt('choose');
                            }}
                          >
                            Find Lawyer
                          </button>
                          </div>
                        </>
                      )}
                      {/* Show lawyer choices if user wants recommendation */}
                      {index === messages.length - 1 && showLawyerPrompt === 'choose' && lawyerChoices.length > 0 && (
                        <div className="chat-lawyer-choices mt-6">
                          <p className="font-semibold text-lg mb-4">Select a lawyer:</p>
                          <div className="flex flex-col gap-4">
                            {lawyerChoices.map((lawyer, i) => {
                              const isSelected = selectedLawyer && selectedLawyer.name === lawyer.name && selectedLawyer.contact === lawyer.contact;
                              return (
                                <div
                                  key={i}
                                  className={
                                    `rounded-lg border-2 bg-white p-4 shadow transition cursor-pointer transform hover:scale-[1.03] duration-150 ` +
                                    (isSelected ? 'border-blue-600 ring-2 ring-blue-200' : 'border-[#E4574E] hover:border-blue-400')
                                  }
                                  onClick={() => setSelectedLawyer(lawyer)}
                                >
                                  <span className="text-[#E4574E] font-bold text-lg">{lawyer.name}</span>
                                  <div className="text-sm text-gray-600">{lawyer.specialization || lawyer.category}</div>
                                  <div className="text-xs text-gray-400 mt-1">{lawyer.contact}</div>
                                  <button
                                    className={`mt-3 px-3 py-1.5 rounded bg-blue-600 text-white text-sm font-medium shadow hover:bg-blue-700 transition ${isSelected ? 'ring-2 ring-blue-300' : ''}`}
                                    onClick={e => { e.stopPropagation(); setSelectedLawyer(lawyer); }}
                                    type="button"
                                  >
                                    {isSelected ? 'Selected' : 'Select Lawyer'}
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                          {/* Confirmation section */}
                          {selectedLawyer && (
                            <div className="mt-6 p-4 rounded-lg border border-blue-400 bg-blue-50 shadow-sm transition">
                              <div className="font-semibold text-blue-700 mb-1">
                                You selected {selectedLawyer.name}
                              </div>
                              <div className="text-sm text-gray-700 mb-1">
                                Contact: <a href={`tel:${selectedLawyer.contact}`} className="text-blue-600 underline hover:text-blue-800">{selectedLawyer.contact}</a>
                              </div>
                              <div className="text-xs text-gray-600">
                                You can now contact this lawyer for professional assistance.
                              </div>
                              {/* FeedbackSection: only show if interactionId exists */}
                              {interactionId && (
                                <div className="mt-4">
                                  <FeedbackSection interactionId={interactionId} backendUrl={process.env.REACT_APP_BACKEND_URL} />
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                      {/* Show selected lawyer details */}
                      {index === messages.length - 1 && selectedLawyer && (
                        <div className="chat-lawyer-details mt-7 border-2 border-[#E4574E] rounded-xl bg-white p-6 max-w-md mx-auto shadow-lg">
                          <h4 className="text-[#E4574E] font-extrabold text-xl mb-3">Lawyer Details</h4>
                          <p><b>Name:</b> {selectedLawyer.name}</p>
                          <p><b>Specialization:</b> {selectedLawyer.specialization}</p>
                          <p><b>Location:</b> {selectedLawyer.location}</p>
                          <p><b>Experience:</b> {selectedLawyer.experience} years</p>
                          <p><b>Rating:</b> {selectedLawyer.rating}★</p>
                          <p><b>Fees:</b> ₹{selectedLawyer.fees}</p>
                          <p><b>Cases handled:</b> {selectedLawyer.cases}</p>
                          <p><b>Qualification:</b> {selectedLawyer.qualification}</p>
                          <p><b>Contact:</b> {selectedLawyer.contact}</p>
                          <button className="chat-lawyer-btn mt-4 px-4 py-2 rounded border border-[#E4574E] bg-white text-[#E4574E] font-semibold" onClick={() => setSelectedLawyer(null)}>Back to list</button>
                        </div>
                      )}
                    </>
                  ) : msg.isEmail && msg.email ? (
                    <div className="chat-section">
                      <h4 className="chat-section__title">Generated Email</h4>
                      <pre className="whitespace-pre-wrap text-sm bg-gray-50 rounded p-3 border border-gray-200" style={{ fontFamily: 'inherit', lineHeight: 1.6 }}>{msg.email}</pre>
                      <div className="mt-2 text-xs text-gray-600">
                        You can now send this email to resolve your issue.<br />
                        If you don’t receive a response, you may consider legal action or consulting a lawyer.
                      </div>
                      {/* FeedbackSection: pass interactionId and backendUrl as props */}
                      <FeedbackSection interactionId={interactionId} backendUrl={process.env.REACT_APP_BACKEND_URL} />
                    </div>
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