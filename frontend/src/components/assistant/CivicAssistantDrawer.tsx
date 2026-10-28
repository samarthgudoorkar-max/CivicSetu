import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Bot,
  User,
  Info
} from 'lucide-react';
import { askAssistant } from '../../services/api';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  sources?: string[];
  suggestedActions?: string[];
  timestamp: Date;
}

interface CivicAssistantDrawerProps {
  currentSchemeSlug?: string;
  currentSchemeName?: string;
}

export const CivicAssistantDrawer: React.FC<CivicAssistantDrawerProps> = ({
  currentSchemeSlug,
  currentSchemeName,
}) => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      sender: 'assistant',
      text: currentSchemeName
        ? `Namaste! I am the **CivicSetu Assistant**. You are viewing **${currentSchemeName}**. You can ask about required documents, eligibility criteria, or application procedures.`
        : `Namaste! I am the **CivicSetu Assistant**. I can help you understand eligibility criteria, documents, or procedures for Central and State Government schemes across India.`,
      sources: ['https://www.myscheme.gov.in/'],
      suggestedActions: currentSchemeName
        ? ['What documents are required?', 'Who is eligible?', 'How do I apply online?']
        : ['Schemes for Telangana farmers', 'Scholarships for students', 'Healthcare coverage schemes'],
      timestamp: new Date(),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (queryText?: string) => {
    const q = (queryText || inputValue).trim();
    if (!q || isLoading) return;

    const userMsg: Message = {
      id: 'user-' + Date.now(),
      sender: 'user',
      text: q,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await askAssistant(q, currentSchemeSlug, i18n.language);
      const assistantMsg: Message = {
        id: 'asst-' + Date.now(),
        sender: 'assistant',
        text: response.answer,
        sources: response.sources,
        suggestedActions: response.suggested_actions,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      const errorMsg: Message = {
        id: 'err-' + Date.now(),
        sender: 'assistant',
        text: 'I could not retrieve scheme details at this moment. Please check your internet connection or browse verified schemes on the Schemes page.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-navy hover:bg-navy-800 text-white rounded-full p-3.5 shadow-xl flex items-center gap-2.5 transition-all hover:scale-105 focus:outline-none focus:ring-4 focus:ring-navy-300"
          aria-label="Open CivicSetu Assistant"
        >
          <div className="w-8 h-8 rounded-full bg-saffron flex items-center justify-center text-white">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="text-sm font-semibold pr-1.5 hidden sm:inline">
            CivicSetu Assistant
          </span>
        </button>
      )}

      {/* Slide-out Drawer */}
      {isOpen && (
        <aside
          role="complementary"
          aria-label="CivicSetu Assistant Chat"
          className="fixed bottom-0 right-0 sm:bottom-6 sm:right-6 z-50 w-full sm:w-[440px] h-[92vh] sm:h-[620px] bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom duration-200"
        >
          {/* Header */}
          <div className="bg-navy text-white px-5 py-3.5 flex items-center justify-between border-b border-navy-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-saffron flex items-center justify-center text-white">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold flex items-center gap-1.5">
                  CivicSetu Assistant
                  <span className="text-[10px] bg-govgreen text-white px-1.5 py-0.2 rounded font-normal">
                    Grounded
                  </span>
                </h2>
                <p className="text-[11px] text-slate-300">
                  Explains verified government rules in plain words
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-navy-800 transition-colors"
              aria-label="Close Assistant"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Non-Affiliation & Source Notice */}
          <div className="bg-slate-50 border-b border-slate-200 px-4 py-2 text-[11px] text-slate-600 flex items-start gap-1.5">
            <Info className="w-3.5 h-3.5 text-navy mt-0.5 shrink-0" />
            <span>
              Answers are strictly grounded in verified scheme records. CivicSetu does not determine final government approvals.
            </span>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'assistant' && (
                  <div className="w-7 h-7 rounded-full bg-navy text-white flex items-center justify-center shrink-0 mt-1">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-navy text-white rounded-br-none'
                      : 'bg-white text-slate-800 border border-slate-200 shadow-xs rounded-bl-none'
                  }`}
                >
                  <div className="whitespace-pre-line">{m.text}</div>

                  {/* Sources citation */}
                  {m.sources && m.sources.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500">
                      <span className="font-semibold text-slate-600">Official Sources:</span>
                      {m.sources.map((src, idx) => (
                        <a
                          key={idx}
                          href={src}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-navy hover:underline flex items-center gap-0.5 bg-slate-100 px-1.5 py-0.5 rounded text-[10px]"
                        >
                          {new URL(src).hostname}
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      ))}
                    </div>
                  )}

                  {/* Suggested actions chips */}
                  {m.suggestedActions && m.suggestedActions.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {m.suggestedActions.map((action, i) => (
                        <button
                          key={i}
                          onClick={() => handleSend(action)}
                          className="bg-saffron-50 hover:bg-saffron-100 text-saffron-800 border border-saffron-200 rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors text-left"
                        >
                          {action}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {m.sender === 'user' && (
                  <div className="w-7 h-7 rounded-full bg-saffron text-white flex items-center justify-center shrink-0 mt-1">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2.5 items-center text-xs text-slate-500 italic py-2">
                <div className="w-7 h-7 rounded-full bg-navy text-white flex items-center justify-center animate-pulse">
                  <Bot className="w-4 h-4" />
                </div>
                <span>Checking verified government records...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about schemes, eligibility, documents..."
              className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy"
            />
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="bg-navy hover:bg-navy-800 disabled:opacity-50 text-white p-2 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-navy"
              aria-label="Send query"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </aside>
      )}
    </>
  );
};
