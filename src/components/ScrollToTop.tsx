import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setIsVisible(window.scrollY > 500);
    }

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  if (!isVisible) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Volver arriba"
      title="Volver arriba"
      className="fixed bottom-24 right-[26px] z-50 grid h-11 w-11 place-items-center rounded-full border border-primary/20 bg-primary text-primary-foreground shadow-lg transition-all duration-200 hover:-translate-y-1 hover:shadow-xl sm:right-6"
    >
      <ArrowUp className="h-5 w-5" aria-hidden="true" />
    </button>
  );
}