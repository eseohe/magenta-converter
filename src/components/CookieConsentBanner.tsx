import { useEffect, useState } from "react";

export function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);
  const [consented, setConsented] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent");
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const handleConsent = (yes: boolean) => {
    localStorage.setItem("cookie_consent", yes ? "yes" : "no");
    setConsented(yes);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full z-50 flex justify-center">
      <div className="bg-background border shadow-lg rounded-lg p-4 m-4 max-w-xl w-full flex flex-col sm:flex-row items-center gap-4">
        <div className="flex-1 text-sm">
          This site uses cookies to enhance your experience. Do you consent to the use of cookies?
        </div>
        <div className="flex gap-2">
          <button
            className="px-4 py-2 rounded bg-primary text-white font-semibold hover:bg-primary/80 cursor-pointer"
            onClick={() => handleConsent(true)}
          >
            Yes
          </button>
          <button
            className="px-4 py-2 rounded bg-muted text-foreground font-semibold border hover:bg-muted/80 cursor-pointer"
            onClick={() => handleConsent(false)}
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
}
