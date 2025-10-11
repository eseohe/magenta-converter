import { useEffect, useState } from "react";

export function CookieConsentBanner() {
  const [showPrefs, setShowPrefs] = useState(false);
  const [visible, setVisible] = useState(false);
  const [consented, setConsented] = useState(false);
  const [cookiePrefs, setCookiePrefs] = useState({
    essential: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent");
    const prefs = localStorage.getItem("cookie_prefs");
    if (!consent) {
      setVisible(true);
    } else if (prefs) {
      setCookiePrefs(JSON.parse(prefs));
    }
  }, []);

  const handleConsent = (yes: boolean) => {
    localStorage.setItem("cookie_consent", yes ? "yes" : "no");
    localStorage.setItem("cookie_prefs", JSON.stringify(cookiePrefs));
    setConsented(yes);
    setVisible(false);

  };

  const handleAcceptAll = () => {
    setCookiePrefs({ essential: true, analytics: true, marketing: true });
    localStorage.setItem("cookie_consent", "yes");
    localStorage.setItem("cookie_prefs", JSON.stringify({ essential: true, analytics: true, marketing: true }));
    setConsented(true);
    setVisible(false);
  };

  const handleRejectAll = () => {
    setCookiePrefs({ essential: true, analytics: false, marketing: false });
    localStorage.setItem("cookie_consent", "no");
    localStorage.setItem("cookie_prefs", JSON.stringify({ essential: true, analytics: false, marketing: false }));
    setConsented(false);
    setVisible(false);
  };

  if (!visible) return null;
  return (
    <div className="fixed bottom-0 left-0 w-full z-50 flex justify-center">
      <div className="bg-background border shadow-lg rounded-lg p-4 m-4 max-w-xl w-full flex flex-col gap-4">
        <div className="flex-1 text-sm">
          This site uses cookies to enhance your experience. You can accept all, reject all, or manage your cookie preferences.
        </div>
        <div className="flex gap-2">
          <button
            className="px-4 py-2 rounded bg-primary text-white font-semibold hover:bg-primary/80 cursor-pointer"
            onClick={handleAcceptAll}
          >
            Accept All
          </button>
          <button
            className="px-4 py-2 rounded bg-muted text-foreground font-semibold border hover:bg-muted/80 cursor-pointer"
            onClick={handleRejectAll}
          >
            Reject All
          </button>
          <button
            className="px-4 py-2 rounded bg-secondary text-foreground font-semibold border hover:bg-secondary/80 cursor-pointer"
            onClick={() => setShowPrefs((v) => !v)}
          >
            Manage Preferences
          </button>
        </div>
        {showPrefs && (
          <div className="flex flex-col gap-2 mt-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={cookiePrefs.essential}
                disabled
                className="accent-primary"
              />
              <span className="font-semibold">Essential Cookies (required)</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={cookiePrefs.analytics}
                onChange={e => setCookiePrefs(p => ({ ...p, analytics: e.target.checked }))}
                className="accent-primary"
              />
              <span>Analytics Cookies</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={cookiePrefs.marketing}
                onChange={e => setCookiePrefs(p => ({ ...p, marketing: e.target.checked }))}
                className="accent-primary"
              />
              <span>Marketing Cookies</span>
            </label>
            <div className="flex gap-2 mt-2">
              <button
                className="px-4 py-2 rounded bg-primary text-white font-semibold hover:bg-primary/80 cursor-pointer"
                onClick={() => handleConsent(true)}
              >
                Save Preferences
              </button>
              <button
                className="px-4 py-2 rounded bg-muted text-foreground font-semibold border hover:bg-muted/80 cursor-pointer"
                onClick={() => handleConsent(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
