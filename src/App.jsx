import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ShieldCheck, Zap, BarChart3, BotMessageSquare, RefreshCw } from 'lucide-react';

const N8N_CHAT_URL = 'https://gunpark.app.n8n.cloud/webhook/b8278a4852d74098a2fa603a3571dd19/chat';
let isChatInjected = false;

function App() {
  const resetSession = () => {
    // Aggressively clear all n8n storage to guarantee a clean chat reset
    localStorage.clear();
    sessionStorage.clear();
    window.location.reload();
  };

  useEffect(() => {
    if (!isChatInjected) {
      isChatInjected = true;
      
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://cdn.jsdelivr.net/npm/@n8n/chat/dist/style.css';
      document.head.appendChild(link);

      const script = document.createElement('script');
      script.type = 'module';
      script.textContent = `
        import { createChat } from 'https://cdn.jsdelivr.net/npm/@n8n/chat/dist/chat.bundle.es.js';
        
        // --- CRITICAL FIX: PREVENT PAGE JUMP TO FOOTER ---
        // n8n's logic uses scrollIntoView(block: 'end') which forces the entire website to scroll down.
        // We monkey-patch it here so it ONLY scrolls inside the chat list, completely isolating it!
        const originalScroll = Element.prototype.scrollIntoView;
        Element.prototype.scrollIntoView = function(args) {
          const list = this.closest('.chat-messages-list');
          if (list) {
            list.scrollTop = list.scrollHeight;
            return; // Stop the entire window from moving!
          }
          if (this.closest('.chat-input, .n8n-chat')) return; // Stop inputs from nudging the layout
          
          return originalScroll.call(this, args);
        };
        // --------------------------------------------------

        const oldWidgets = document.querySelectorAll('.chat-window-wrapper, .chat-button');
        oldWidgets.forEach(el => el.remove());

        createChat({
          webhookUrl: '${N8N_CHAT_URL}',
          target: '#n8n-chat-container',
          mode: 'fullscreen',
          showWelcomeScreen: false,
          defaultLanguage: 'en',
          initialMessages: [
            'Hi there! 👋 I\\'m the Krytil AI Assistant.',
            'I\\'m here to assist you with your business enquiry. What kind of project are you looking to build?'
          ],
          i18n: {
            en: {
              title: 'Krytil Assistant',
              subtitle: 'Enterprise Lead Qualification',
              inputPlaceholder: 'Type your message...',
            },
          },
        });
        
        // --- INJECT END-OF-CHAT BUTTON ON COMPLETION ---
        setTimeout(() => {
          const container = document.querySelector('#n8n-chat-container');
          if (container) {
            const observer = new MutationObserver(() => {
              const elements = document.querySelectorAll('.chat-message-text, .chat-message p, .n8n-chat p, span');
              elements.forEach(el => {
                if (el.textContent.includes('[SESSION_COMPLETE]')) {
                  // Hide the secret trigger word from the user
                  el.innerHTML = el.innerHTML.replace('\\[SESSION_COMPLETE\\]', '').replace('[SESSION_COMPLETE]', '');
                  
                  // Double check if we already added the button
                  if (!document.querySelector('#final-reset-btn')) {
                    const inputWrapper = document.querySelector('.chat-input-wrapper') || document.querySelector('.chat-input');
                    if (inputWrapper) {
                      inputWrapper.innerHTML = ''; // Nuke the text box so they can't type
                      inputWrapper.style.display = 'flex';
                      inputWrapper.style.justifyContent = 'center';
                      inputWrapper.style.padding = '20px';
                      inputWrapper.style.background = 'transparent';
                      
                      const btn = document.createElement('button');
                      btn.id = 'final-reset-btn';
                      btn.className = 'reset-btn';
                      btn.style.width = '100%';
                      btn.style.padding = '1rem';
                      btn.style.justifyContent = 'center';
                      btn.style.fontSize = '1.1rem';
                      btn.innerHTML = '🔄 Start a New Chat';
                      btn.onclick = () => {
                         localStorage.clear();
                         sessionStorage.clear();
                         window.location.reload();
                      };
                      inputWrapper.appendChild(btn);
                    }
                  }
                }
              });
            });
            observer.observe(container, { childList: true, subtree: true, characterData: true });
          }
        }, 1500);

      `;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div className="layout">
      {/* Background Glows */}
      <div className="glow glow-1"></div>
      <div className="glow glow-2"></div>
      
      <div className="content-wrapper">
        
        {/* === Left Side: Premium Business Copy === */}
        <div className="business-copy">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="badge">
              <Sparkles size={14} style={{ marginRight: '6px', display: 'inline' }} />
              Enterprise AI Solutions
            </div>
            
            <h1 className="title">
              Scale Your Growth with <span className="text-gradient">Krytil Lead Agent</span>
            </h1>
            
            <p className="subtitle">
              Experience the future of business onboarding. Our autonomous AI agent chats with your prospects, scores them in real-time, and seamlessly syncs the entire conversation directly to your CRM, Email, and WhatsApp.
            </p>
            
            <div className="features-list">
              <div className="feature-item">
                <div className="feature-icon"><Zap size={20} /></div>
                <div>
                  <h3>Instant Qualification</h3>
                  <p>AI evaluates prospects 24/7 without response delays.</p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon"><ShieldCheck size={20} /></div>
                <div>
                  <h3>Data Verification</h3>
                  <p>Intelligently collects, structures, and validates project requirements.</p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon"><BarChart3 size={20} /></div>
                <div>
                  <h3>Automated Routing</h3>
                  <p>Leads are instantly scored and routed to your Sales team via WhatsApp.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* === Right Side: Integrated Chatbot === */}
        <div className="chat-section">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 0.6, delay: 0.2 }}
            className="chat-card"
          >
            <div className="chat-header-custom" style={{ display: 'flex', justifyContent: 'center' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                 <BotMessageSquare size={22} color="var(--primary)" />
                 <span>Talk to our AI Agent</span>
               </div>
            </div>
            <div id="n8n-chat-container"></div>
          </motion.div>
        </div>
      </div>

      <footer>
        <p>&copy; 2026 Krytil Lead Solutions. All Rights Reserved.</p>
        <p className="footer-sub">Built for Internship Assignment &middot; Powered by n8n + Llama 3.3 + Vite</p>
      </footer>
    </div>
  );
}

export default App;
