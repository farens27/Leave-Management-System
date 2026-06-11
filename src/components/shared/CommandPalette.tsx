"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Search,
  LayoutDashboard,
  Users,
  CalendarDays,
  Activity,
  User,
  FileText,
  UserPlus,
  CalendarPlus,
  Moon,
  ArrowUp,
  ArrowDown,
  CornerDownLeft,
} from "lucide-react";

type CommandItem = {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  category: "Navigation" | "Actions" | "Quick Access";
} & (
  | { type: "link"; href: string }
  | { type: "action"; action: () => void }
);

const CATEGORIES = ["Navigation", "Actions", "Quick Access"] as const;

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const commands: CommandItem[] = useMemo(
    () => [
      // Navigation
      { id: "nav-dashboard", name: "Dashboard", icon: LayoutDashboard, category: "Navigation", type: "link", href: "/dashboard" },
      { id: "nav-employees", name: "Employees", icon: Users, category: "Navigation", type: "link", href: "/employees" },
      { id: "nav-leave", name: "Leave Requests", icon: CalendarDays, category: "Navigation", type: "link", href: "/leave" },
      { id: "nav-logs", name: "Activity Logs", icon: Activity, category: "Navigation", type: "link", href: "/logs" },
      { id: "nav-profile", name: "Profile", icon: User, category: "Navigation", type: "link", href: "/profile" },
      { id: "nav-code-review", name: "Code Review", icon: FileText, category: "Navigation", type: "link", href: "/code-review" },
      // Actions
      { id: "act-new-employee", name: "New Employee", icon: UserPlus, category: "Actions", type: "link", href: "/employees/new" },
      { id: "act-new-leave", name: "New Leave Request", icon: CalendarPlus, category: "Actions", type: "link", href: "/leave/new" },
      {
        id: "act-toggle-theme",
        name: "Toggle Dark Mode",
        icon: Moon,
        category: "Actions",
        type: "action",
        action: () => setTheme(theme === "dark" ? "light" : "dark"),
      },
    ],
    [theme, setTheme]
  );

  // Fuzzy filter
  const filtered = useMemo(() => {
    if (!query.trim()) return commands;
    const lowerQuery = query.toLowerCase();
    return commands.filter((cmd) => {
      const name = cmd.name.toLowerCase();
      let qi = 0;
      for (let i = 0; i < name.length && qi < lowerQuery.length; i++) {
        if (name[i] === lowerQuery[qi]) qi++;
      }
      return qi === lowerQuery.length;
    });
  }, [query, commands]);

  // Group by category (preserving order)
  const grouped = useMemo(() => {
    const map = new Map<string, CommandItem[]>();
    for (const cat of CATEGORIES) {
      const items = filtered.filter((c) => c.category === cat);
      if (items.length > 0) map.set(cat, items);
    }
    return map;
  }, [filtered]);

  // Flat list for keyboard nav
  const flatItems = useMemo(() => {
    const items: CommandItem[] = [];
    for (const [, group] of grouped) {
      items.push(...group);
    }
    return items;
  }, [grouped]);

  // Reset selection when filtered list changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [filtered]);

  // Scroll selected item into view
  useEffect(() => {
    if (!listRef.current) return;
    const selected = listRef.current.querySelector(`[data-index="${selectedIndex}"]`);
    selected?.scrollIntoView({ block: "nearest" });
  }, [selectedIndex]);

  const executeItem = useCallback(
    (item: CommandItem) => {
      setOpen(false);
      setQuery("");
      if (item.type === "link") {
        router.push(item.href);
      } else {
        item.action();
      }
    },
    [router]
  );

  // Global keyboard shortcut: Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Focus input when dialog opens
  useEffect(() => {
    if (open) {
      setQuery("");
      setSelectedIndex(0);
      // Small delay to ensure dialog is mounted
      const t = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [open]);

  // Keyboard navigation inside the palette
  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, flatItems.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
        break;
      case "Enter":
        e.preventDefault();
        if (flatItems[selectedIndex]) {
          executeItem(flatItems[selectedIndex]);
        }
        break;
      case "Escape":
        e.preventDefault();
        setOpen(false);
        break;
    }
  };

  // Build flat index counter for data-index mapping
  let flatIdx = -1;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        showCloseButton={false}
        className="!fixed !top-[20%] !translate-y-0 !max-w-lg !p-0 !gap-0 overflow-hidden border border-white/20 dark:border-white/10 bg-white/80 dark:bg-gray-950/80 backdrop-blur-2xl shadow-2xl shadow-emerald-500/5 dark:shadow-emerald-500/10 !rounded-2xl"
      >
        {/* Accessible title (visually hidden) */}
        <DialogTitle className="sr-only">Command Palette</DialogTitle>

        {/* Search input */}
        <div className="flex items-center gap-3 border-b border-gray-200/60 dark:border-white/10 px-4 py-3">
          <Search className="h-5 w-5 shrink-0 text-gray-400 dark:text-gray-500" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command or search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleInputKeyDown}
            className="flex-1 bg-transparent text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 outline-none"
            autoComplete="off"
            spellCheck={false}
          />
          <kbd className="hidden sm:inline-flex h-5 items-center rounded border border-gray-200 dark:border-white/10 bg-gray-100 dark:bg-white/5 px-1.5 text-[10px] font-medium text-gray-400 dark:text-gray-500">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div
          ref={listRef}
          className="max-h-[320px] overflow-y-auto overscroll-contain p-2 scroll-smooth"
        >
          {flatItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Search className="h-10 w-10 text-gray-300 dark:text-gray-600 mb-3" />
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                No results found
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                Try a different search term
              </p>
            </div>
          ) : (
            Array.from(grouped.entries()).map(([category, items]) => (
              <div key={category} className="mb-1 last:mb-0">
                {/* Category label */}
                <div className="px-2 py-1.5">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                    {category}
                  </span>
                </div>

                {/* Items */}
                {items.map((item) => {
                  flatIdx++;
                  const currentIdx = flatIdx;
                  const isSelected = currentIdx === selectedIndex;

                  return (
                    <button
                      key={item.id}
                      data-index={currentIdx}
                      onClick={() => executeItem(item)}
                      onMouseEnter={() => setSelectedIndex(currentIdx)}
                      className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-all duration-150 outline-none ${
                        isSelected
                          ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                          : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5"
                      }`}
                    >
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all duration-150 ${
                          isSelected
                            ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 shadow-sm"
                            : "bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400"
                        }`}
                      >
                        <item.icon className="h-4 w-4" />
                      </div>
                      <span
                        className={`flex-1 font-medium transition-colors duration-150 ${
                          isSelected
                            ? "text-emerald-700 dark:text-emerald-300"
                            : "text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {item.name}
                      </span>
                      {isSelected && (
                        <div className="flex items-center gap-0.5">
                          <kbd className="inline-flex h-5 items-center rounded border border-emerald-200 dark:border-emerald-500/30 bg-emerald-100/50 dark:bg-emerald-500/10 px-1 text-[10px] font-medium text-emerald-500 dark:text-emerald-400">
                            <CornerDownLeft className="h-2.5 w-2.5" />
                          </kbd>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer hint bar */}
        <div className="flex items-center justify-between border-t border-gray-200/60 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.02] px-4 py-2">
          <div className="flex items-center gap-3 text-[11px] text-gray-400 dark:text-gray-500">
            <span className="inline-flex items-center gap-1">
              <ArrowUp className="h-3 w-3" />
              <ArrowDown className="h-3 w-3" />
              navigate
            </span>
            <span className="inline-flex items-center gap-1">
              <CornerDownLeft className="h-3 w-3" />
              select
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-gray-400 dark:text-gray-500">
            <kbd className="inline-flex h-4 items-center rounded border border-gray-200 dark:border-white/10 bg-gray-100 dark:bg-white/5 px-1 text-[10px] font-medium">
              Ctrl
            </kbd>
            <span>+</span>
            <kbd className="inline-flex h-4 items-center rounded border border-gray-200 dark:border-white/10 bg-gray-100 dark:bg-white/5 px-1 text-[10px] font-medium">
              K
            </kbd>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
