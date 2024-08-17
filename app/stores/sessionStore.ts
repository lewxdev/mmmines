type Session = {
  username: string;
  connected: boolean;
};

export const createSessionStore = () => {
  const sessions = new Map<string, Session>();

  const getSession = (sessionID: string) => {
    return sessions.get(sessionID);
  };

  const setSession = (sessionID: string, session: Session) => {
    sessions.set(sessionID, session);
  };

  return {
    getSession,
    setSession,
  };
};
