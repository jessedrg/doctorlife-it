"use client";

import { useQuiz } from "./quiz-context";
import { FORM_ENABLED } from "@/i18n/config";

/**
 * A button that opens the quiz modal. Use anywhere in a server
 * component for any CTA: <QuizTrigger className="...">Get started</QuizTrigger>
 *
 * Rispetta il flag centrale FORM_ENABLED (i18n/config.ts): se è `false`,
 * il pulsante si disabilita ovunque nel sito senza toccare nessun
 * componente che lo usa.
 */
export function QuizTrigger({
  children,
  className,
  style,
  plan,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  plan?: string;
}) {
  const { openQuiz } = useQuiz();
  return (
    <button
      type="button"
      onClick={() => FORM_ENABLED && openQuiz(plan)}
      disabled={!FORM_ENABLED}
      aria-disabled={!FORM_ENABLED}
      className={`cursor-pointer transition-all duration-200 hover:brightness-[1.04] hover:shadow-lg active:scale-[.97] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:brightness-100 disabled:hover:shadow-none disabled:active:scale-100 ${className ?? ""}`}
      style={style}
    >
      {children}
    </button>
  );
}
