"use client";

import { createContext, useContext, useState } from "react";
import { QuizModal } from "./quiz-modal";
import { analytics } from "@/lib/analytics";

export type QuizVariant = "default" | "ads";

type QuizContextValue = {
  open: boolean;
  initialPlan: string | null;
  variant: QuizVariant;
  openQuiz: (plan?: string) => void;
  closeQuiz: () => void;
};

const QuizContext = createContext<QuizContextValue | null>(null);

/**
 * Wrap the page once. Provides openQuiz/closeQuiz to any descendant
 * (via useQuiz / <QuizTrigger>) and renders the modal itself.
 *
 * `variant="ads"` uses neutral copy (no drug names) for Google Ads funnels.
 */
export function QuizProvider({
  children,
  variant = "default",
}: {
  children: React.ReactNode;
  variant?: QuizVariant;
}) {
  const [open, setOpen] = useState(false);
  const [initialPlan, setInitialPlan] = useState<string | null>(null);

  const openQuiz = (plan?: string) => {
    if (typeof document !== "undefined") {
      document.body.style.overflow = "hidden";
    }
    setInitialPlan(plan ?? null);
    setOpen(true);
    analytics.formOpened(plan);
  };
  const closeQuiz = () => {
    if (typeof document !== "undefined") {
      document.body.style.overflow = "";
    }
    setOpen(false);
  };

  return (
    <QuizContext.Provider value={{ open, initialPlan, variant, openQuiz, closeQuiz }}>
      {children}
      <QuizModal />
    </QuizContext.Provider>
  );
}

export function useQuiz() {
  const ctx = useContext(QuizContext);
  if (!ctx) throw new Error("useQuiz must be used within a <QuizProvider>");
  return ctx;
}
