(() => {
  const SESSION_KEY = "chronos-auth-demo";

  function isValidSession(session) {
    return (
      session &&
      typeof session.username === "string" &&
      session.username.trim() !== ""
    );
  }

  function readSession() {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      const parsed = raw ? JSON.parse(raw) : null;
      return isValidSession(parsed) ? parsed : null;
    } catch {
      return null;
    }
  }

  function saveSession(username) {
    if (typeof username !== "string" || username.trim() === "") {
      return false;
    }

    try {
      localStorage.setItem(
        SESSION_KEY,
        JSON.stringify({
          username,
        })
      );
      return true;
    } catch {
      return false;
    }
  }

  function clearSession() {
    try {
      localStorage.removeItem(SESSION_KEY);
      return true;
    } catch {
      return false;
    }
  }

  window.ChronosAuthSession = {
    SESSION_KEY,
    isValidSession,
    readSession,
    saveSession,
    clearSession,
  };
})();
