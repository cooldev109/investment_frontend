import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { TrendingUp, X } from "lucide-react";

const FloatingCTA = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show button after scrolling 300px
      if (window.scrollY > 300 && !isDismissed) {
        setIsVisible(true);
      } else if (window.scrollY <= 300) {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isDismissed]);

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDismissed(true);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-8 right-8 z-50 animate-fade-in">
      <div className="relative group">
        <Button
          className="bg-gradient-premium text-primary font-semibold shadow-premium hover:shadow-xl transition-all px-6 py-6 text-base"
          onClick={() => {
            const element = document.getElementById("premium");
            if (element) {
              element.scrollIntoView({ behavior: "smooth" });
            }
          }}
        >
          <TrendingUp className="mr-2" size={20} />
          Invest Now
        </Button>
        
        <button
          onClick={handleDismiss}
          className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
          aria-label="Dismiss"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
};

export default FloatingCTA;
