import { useLanguagePreference } from "app/lib/hooks/use-language-preference";
import { cn } from "app/lib/utils";

export function LanguageToggle() {
  const { showRussian, toggleLanguage } = useLanguagePreference();

  return (
    <button
      onClick={toggleLanguage}
      className={cn(
        "border-2 border-black px-3 py-1 font-bold transition-all duration-200 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none",
        showRussian
          ? "bg-black text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          : "bg-white text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
      )}
      title={showRussian ? "Hide Russian content" : "Show Russian content"}
      aria-label={showRussian ? "Hide Russian content" : "Show Russian content"}
    >
      {showRussian ? "EN+RU" : "EN"}
    </button>
  );
}
