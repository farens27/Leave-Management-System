"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Monitor } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="h-9 w-9" />;

  const cycleTheme = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("system");
    else setTheme("light");
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={cycleTheme}
      className="relative h-9 w-9 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white transition-all duration-300"
      title={`Theme: ${theme}`}
    >
      {theme === "light" && <Sun className="h-4 w-4 transition-transform duration-300 rotate-0" />}
      {theme === "dark" && <Moon className="h-4 w-4 transition-transform duration-300 rotate-0" />}
      {theme === "system" && <Monitor className="h-4 w-4 transition-transform duration-300 rotate-0" />}
    </Button>
  );
}
