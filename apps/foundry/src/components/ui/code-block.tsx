import { useState, type ComponentProps } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

interface CodeBlockProps extends ComponentProps<"div"> {
  children: string;
  className?: string;
}

export function CodeBlock({ children, className, ...props }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn("relative", className)} {...props}>
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 h-8 w-8 border-2 border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white"
        onClick={handleCopy}
      >
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </Button>
      <code className="block pr-12 font-mono bg-foreground text-card p-4 text-sm break-all border-2 border-foreground">
        {children}
      </code>
    </div>
  );
}
