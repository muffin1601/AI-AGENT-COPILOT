"use client";

import { Send, Plus, Search, Copy, Check, RotateCcw } from "lucide-react";
import styles from "./chat.module.css";
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { createConversation, getMessages } from "./actions";
import { useChat } from "@ai-sdk/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ChatInterfaceProps {
  initialConversations: any[];
  workspaceId: string;
}

export function ChatInterface({ initialConversations, workspaceId }: ChatInterfaceProps) {
  const [conversations, setConversations] = useState(initialConversations);
  const [activeId, setActiveId] = useState<string | null>(initialConversations[0]?.id || null);
  const [isCreatingChat, setIsCreatingChat] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [pendingMessage, setPendingMessage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [localInput, setLocalInput] = useState("");
  const { 
    messages,
    input,
    handleInputChange,
    handleSubmit: chatHandleSubmit,
    append,
    reload,
    setMessages,
    status,
    isLoading,
    error: chatError,
  } = useChat({
    id: activeId || undefined,
    api: activeId ? `/api/chat?conversationId=${activeId}` : "/api/chat",
    credentials: "include",
    body: {
      conversationId: activeId
    },
    onError: (err: Error) => {
      console.error("Chat failure:", err);
    }
  });

  const isBusy = isLoading || isCreatingChat;

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const messageToPulse = localInput.trim();
    if (!messageToPulse || isBusy) return;
    
    // Sync with useChat input if needed, though append works with direct content
    setLocalInput(""); 
    if (setInput) setInput("");
    
    if (!activeId) {
      setIsCreatingChat(true);
      try {
        const newChat = await createConversation(workspaceId, "New Intelligence Session");
        setConversations(prev => [newChat, ...prev]);
        setPendingMessage(messageToPulse); 
        setActiveId(newChat.id);
        setIsCreatingChat(false);
      } catch (err) {
        console.error("Failed to initialize session:", err);
        setIsCreatingChat(false);
      }
      return;
    }

    try {
      append({ role: "user", content: messageToPulse });
    } catch (err: unknown) {
      console.error("Pulse submission error:", err);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (activeId) {
      loadHistory(activeId);
      
      if (pendingMessage) {
        setTimeout(() => {
          append({ role: "user", content: pendingMessage });
          setPendingMessage(null);
          setIsCreatingChat(false);
        }, 100);
      }
    } else {
      setIsLoadingHistory(false);
    }
  }, [activeId, pendingMessage]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadHistory = async (id: string) => {
    setIsLoadingHistory(true);
    try {
      const msgs = await getMessages(id);
      const formattedMsgs = msgs.map(m => ({
        id: m.id,
        role: m.role as "user" | "assistant",
        content: m.content,
        createdAt: new Date(m.createdAt),
        parts: [{ type: "text" as const, text: m.content }],
      }));
      setMessages(formattedMsgs);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleNewChat = async () => {
    setIsCreatingChat(true);
    try {
      const newChat = await createConversation(workspaceId, "New Intelligence Session");
      setConversations([newChat, ...conversations]);
      setActiveId(newChat.id);
    } catch (e) {
      alert("Failed to initialize new protocol.");
    }
    setIsCreatingChat(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <button 
            className={styles.newChatBtn}
            onClick={handleNewChat}
          >
            <Plus className="w-5 h-5" />
            <span>New Intelligence</span>
          </button>
          
          <div className={styles.searchBox}>
            <Search className={styles.searchIcon} />
            <input 
              type="text" 
              placeholder="Query protocol history..." 
              className={styles.searchInput}
            />
          </div>
        </div>

        <div className={styles.chatList}>
          {conversations.map((chat) => (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              key={chat.id}
              className={`${styles.chatItem} ${activeId === chat.id ? styles.activeChat : ""}`}
              onClick={() => setActiveId(chat.id)}
            >
              <span className={styles.chatTitle}>{chat.title}</span>
              <span className={styles.chatDate}>
                {new Date(chat.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      <div className={styles.mainWindow}>
        <div className={styles.messages}>
          {isLoadingHistory ? (
            <div className={styles.skeletonContainer}>
              <SkeletonBubble align="left" width="60%" />
              <SkeletonBubble align="right" width="40%" />
              <SkeletonBubble align="left" width="70%" />
            </div>
          ) : (
            <>
              {messages.length === 0 && !isBusy && (
                 <div className={styles.emptyState}>
                    <div className={styles.emptyStateIcon}>?</div>
                    <p className={styles.emptyStateText}>Awaiting Neural Commands</p>
                 </div>
              )}
              {messages.map((msg, i) => {
                const textContent = msg.parts
                  ?.filter((p: any) => p.type === "text")
                  .map((p: any) => p.text)
                  .join("") || (msg as any).content || "";

                if (!textContent && msg.role === "assistant" && isBusy && i === messages.length - 1) {
                  return null; 
                }
                
                const isLastAssistant = msg.role === "assistant" && i === messages.length - 1;

                return (
                  <MessageBubble 
                    key={msg.id || i} 
                    role={msg.role as 'user' | 'assistant'} 
                    content={textContent} 
                    onRegenerate={isLastAssistant ? reload : undefined}
                  />
                );
              })}
            </>
          )}
          
          {isBusy && messages[messages.length - 1]?.role === "user" && (
            <div className={styles.streamingLoader}>
               <div className={styles.loaderDot}></div>
               <div className={styles.loaderDot}></div>
               <div className={styles.loaderDot}></div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className={styles.inputWrapper}>
          <form className={styles.inputCard} onSubmit={handleSubmit}>
            <textarea 
              placeholder="Inquire with Pulse..." 
              className={styles.textarea}
              value={localInput}
              onChange={(e) => {
                setLocalInput(e.target.value);
                handleInputChange(e);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              rows={1}
            />
            <button 
              type="submit" 
              className={styles.sendBtn} 
              disabled={!localInput.trim() || isBusy}
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
          <p className={styles.disclaimer}>
            Intelligence results are probabilistic. Always verify protocol compliance.
          </p>
        </div>
      </div>
    </div>
  );
}


function MessageBubble({ 
  role, 
  content, 
  onRegenerate 
}: { 
  role: 'user' | 'assistant', 
  content: string,
  onRegenerate?: () => void
}) {
  const isUser = role === 'user';
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`${styles.bubbleWrapper} ${isUser ? styles.userWrapper : styles.assistantWrapper}`}
    >
      <div className={styles.bubbleContainer}>
        <div className={`${styles.bubble} ${isUser ? styles.userBubble : styles.assistantBubble}`}>
          {isUser ? (
            <div style={{ whiteSpace: 'pre-wrap' }}>{content}</div>
          ) : (
            <div className={styles.markdownContent}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content}
              </ReactMarkdown>
            </div>
          )}
        </div>

        {!isUser && (
          <div className={styles.messageActions}>
            <button onClick={handleCopy} className={styles.actionBtn} title="Copy result">
              {copied ? <Check className="w-3.5 h-3.5" style={{ color: '#2ecc71' }} /> : <Copy className="w-3.5 h-3.5" />}
            </button>
            {onRegenerate && (
              <button onClick={() => onRegenerate()} className={styles.actionBtn} title="Regenerate">
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>

      <div className={styles.bubbleMeta}>
         <div className={styles.avatarMini}>{isUser ? "U" : "P"}</div>
         <span className={styles.bubbleLabel}>
           {isUser ? 'Primary User' : 'Pulse System'}
         </span>
      </div>
    </motion.div>
  );
}

function SkeletonBubble({ align, width }: { align: 'left' | 'right', width: string }) {
  const isRight = align === 'right';
  return (
    <div className={`${styles.bubbleWrapper} ${isRight ? styles.userWrapper : styles.assistantWrapper}`}>
      <div className={styles.skeleton} style={{ width, height: '80px', borderRadius: '4px' }} />
      <div className={styles.bubbleMeta}>
         <div className={styles.skeleton} style={{ width: '16px', height: '16px' }} />
         <div className={styles.skeleton} style={{ width: '60px', height: '8px' }} />
      </div>
    </div>
  );
}
