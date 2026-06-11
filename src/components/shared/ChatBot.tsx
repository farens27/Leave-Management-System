"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, ChevronRight, ArrowLeft, Leaf } from "lucide-react";

type Message = {
  id: number;
  text: string;
  sender: "bot" | "user";
  options?: QuickOption[];
};

type QuickOption = {
  label: string;
  action: string;
};

type FAQCategory = {
  id: string;
  icon: string;
  title: string;
  questions: { q: string; a: string }[];
};

const faqData: FAQCategory[] = [
  {
    id: "login",
    icon: "🔐",
    title: "Login & Access",
    questions: [
      {
        q: "I can't login, what should I do?",
        a: "Please double-check your username and password. The admin account is **admin / admin123**. If you're an employee, use the credentials given by your administrator. Make sure Caps Lock is off and there are no extra spaces.",
      },
      {
        q: "I forgot my password",
        a: "Please contact your system administrator to reset your password. Currently, password reset is managed by the admin through the **Employees** management page. The admin can edit your account and set a new password.",
      },
      {
        q: "What is the CAPTCHA for?",
        a: "The CAPTCHA verification helps protect the system from automated login attempts. Simply click the **\"Verify you're human\"** button and wait for it to complete before signing in.",
      },
      {
        q: "What's the difference between Admin and Employee?",
        a: "**Admin** has full access: manage employees, approve/reject leaves, view logs, and access the dashboard.\n\n**Employee** can only view and submit their own leave requests.",
      },
    ],
  },
  {
    id: "leave",
    icon: "📅",
    title: "Leave Management",
    questions: [
      {
        q: "How do I submit a leave request?",
        a: "1. Login with your account\n2. Go to **Leave Requests** page\n3. Click **\"New Request\"** button\n4. Fill in the start date, end date, and reason\n5. Click **Submit**\n\nYour request will be sent to the admin for approval.",
      },
      {
        q: "How do I check my leave status?",
        a: "Go to the **Leave Requests** page. You'll see a table with all your requests and their current status: **Pending** (waiting), **Approved** ✅, or **Rejected** ❌.",
      },
      {
        q: "How does the admin approve/reject leaves?",
        a: "The admin can go to **Leave Requests** page, find the pending request, and click **Approve** or **Reject**. The status will update immediately for the employee to see.",
      },
      {
        q: "Can I cancel a leave request?",
        a: "Currently, once a leave request is submitted, it cannot be canceled by the employee. Please contact your administrator if you need to modify or cancel a request.",
      },
    ],
  },
  {
    id: "employee",
    icon: "👥",
    title: "Employee Management",
    questions: [
      {
        q: "How do I add a new employee?",
        a: "1. Login as **Admin**\n2. Go to **Employees** page\n3. Click **\"Add Employee\"**\n4. Fill in: Name, Department, Position, Username, and Password\n5. Click **Save**\n\nThe new employee can now login with their credentials.",
      },
      {
        q: "How do I edit an employee?",
        a: "Go to **Employees** page → click the **Edit** button on the employee row → update the fields → click **Save**.",
      },
      {
        q: "Can I delete an employee?",
        a: "Yes. Go to **Employees** page → click the **Delete** button on the employee row → confirm the deletion. ⚠️ This will also remove all their leave requests.",
      },
    ],
  },
  {
    id: "general",
    icon: "💡",
    title: "General Help",
    questions: [
      {
        q: "How do I switch dark/light mode?",
        a: "Click the **sun/moon icon** in the top navigation bar (or top-right on the Code Review page) to toggle between dark and light themes.",
      },
      {
        q: "Where can I see the code review report?",
        a: "The Code Review Report is publicly accessible. You can find the link on the **Login page** at the bottom, or go directly to **/code-review** in the URL.",
      },
      {
        q: "Where can I see activity logs?",
        a: "Login as **Admin** → click **Logs** in the navigation bar. You'll see charts and a feed of all login/logout events, including failed attempts.",
      },
      {
        q: "Is my data saved?",
        a: "Yes! All data is stored in a **Supabase PostgreSQL** database in the cloud. Your data persists across sessions and devices.",
      },
    ],
  },
];

const WELCOME_MESSAGE: Message = {
  id: 0,
  text: "Hi there! 👋 I'm **LeaveManager Assistant**. How can I help you today? Choose a topic below:",
  sender: "bot",
  options: faqData.map((cat) => ({
    label: `${cat.icon} ${cat.title}`,
    action: cat.id,
  })),
};

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [currentCategory, setCurrentCategory] = useState<string | null>(null);
  const [hasUnread, setHasUnread] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const idCounter = useRef(1);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Show unread dot after 3 seconds if chat hasn't been opened
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isOpen) setHasUnread(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const addMessage = (text: string, sender: "bot" | "user", options?: QuickOption[]) => {
    const id = idCounter.current++;
    setMessages((prev) => [...prev, { id, text, sender, options }]);
  };

  const handleCategorySelect = (categoryId: string) => {
    const cat = faqData.find((c) => c.id === categoryId);
    if (!cat) return;

    setCurrentCategory(categoryId);
    addMessage(`${cat.icon} ${cat.title}`, "user");

    setTimeout(() => {
      addMessage(
        `Here are common questions about **${cat.title}**. Pick one:`,
        "bot",
        cat.questions.map((q, i) => ({
          label: q.q,
          action: `${categoryId}_${i}`,
        }))
      );
    }, 400);
  };

  const handleQuestionSelect = (actionId: string) => {
    const [catId, qIdx] = actionId.split("_");
    const cat = faqData.find((c) => c.id === catId);
    if (!cat) return;

    const question = cat.questions[parseInt(qIdx)];
    if (!question) return;

    addMessage(question.q, "user");

    setTimeout(() => {
      addMessage(question.a, "bot", [
        { label: "🔙 More questions", action: `back_${catId}` },
        { label: "🏠 Main menu", action: "main_menu" },
      ]);
    }, 500);
  };

  const handleOptionClick = (action: string) => {
    if (action === "main_menu") {
      setCurrentCategory(null);
      addMessage("Main menu", "user");
      setTimeout(() => {
        const id = idCounter.current++;
        setMessages((prev) => [
          ...prev,
          {
            id,
            text: "Sure! What else can I help you with?",
            sender: "bot",
            options: faqData.map((cat) => ({
              label: `${cat.icon} ${cat.title}`,
              action: cat.id,
            })),
          },
        ]);
      }, 300);
      return;
    }

    if (action.startsWith("back_")) {
      const catId = action.replace("back_", "");
      handleCategorySelect(catId);
      return;
    }

    if (action.includes("_")) {
      handleQuestionSelect(action);
    } else {
      handleCategorySelect(action);
    }
  };

  const formatText = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-emerald-600 dark:text-emerald-400">$1</strong>')
      .replace(/\n/g, "<br />");
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => { setIsOpen(!isOpen); setHasUnread(false); }}
        className={`fixed bottom-6 right-6 z-[100] flex h-14 w-14 items-center justify-center rounded-full shadow-2xl transition-all duration-300 hover:scale-110 ${
          isOpen
            ? "bg-gray-800 dark:bg-gray-700 rotate-0"
            : "bg-gradient-to-br from-emerald-500 to-teal-600 hover:shadow-emerald-500/30"
        }`}
      >
        {isOpen ? (
          <X className="h-6 w-6 text-white" />
        ) : (
          <>
            <MessageCircle className="h-6 w-6 text-white" />
            {hasUnread && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500" />
              </span>
            )}
          </>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-[100] w-[360px] max-h-[520px] flex flex-col rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-2xl shadow-black/20 overflow-hidden animate-in slide-in-from-bottom-4 fade-in duration-300">
          {/* Header */}
          <div className="flex items-center gap-3 px-5 py-4 bg-gradient-to-r from-emerald-600 to-teal-600">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
              <Leaf className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-white">LeaveManager Assistant</h3>
              <p className="text-[10px] text-emerald-100/60 font-medium">Always here to help</p>
            </div>
            <div className="flex h-2.5 w-2.5 rounded-full bg-green-300 shadow-sm shadow-green-400/50" />
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 min-h-[300px] max-h-[360px] scrollbar-thin">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] ${msg.sender === "user" ? "" : "flex gap-2"}`}>
                  {msg.sender === "bot" && (
                    <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 mt-0.5">
                      <Bot className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                  )}
                  <div>
                    <div
                      className={`rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
                        msg.sender === "user"
                          ? "bg-emerald-600 text-white rounded-br-md"
                          : "bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 rounded-bl-md border border-gray-100 dark:border-gray-800"
                      }`}
                      dangerouslySetInnerHTML={{ __html: formatText(msg.text) }}
                    />
                    {msg.options && (
                      <div className="mt-2 space-y-1.5 pl-0">
                        {msg.options.map((opt, i) => (
                          <button
                            key={i}
                            onClick={() => handleOptionClick(opt.action)}
                            className="w-full flex items-center gap-2 text-left text-[12px] font-medium text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 bg-gray-50 dark:bg-gray-900/50 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 border border-gray-100 dark:border-gray-800 hover:border-emerald-200 dark:hover:border-emerald-800/50 rounded-xl px-3 py-2 transition-all duration-200"
                          >
                            <ChevronRight className="h-3 w-3 flex-shrink-0 text-emerald-500" />
                            <span>{opt.label}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
            <p className="text-[10px] text-gray-400 text-center">
              Select a topic above to get help • Powered by LeaveManager
            </p>
          </div>
        </div>
      )}
    </>
  );
}
