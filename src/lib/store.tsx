"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { initiallyCompleted } from "./data";

type State = {
  name: string;
  language: string;
  completed: string[];
  profileDone: boolean;
};

type Store = State & {
  ready: boolean;
  signIn: (userId: string) => void;
  setLanguage: (language: string) => void;
  completeCourse: (id: string) => void;
  completeProfile: () => void;
  resetDemo: () => void;
};

const KEY = "prehire-demo";
const initial: State = { name: "Jane", language: "English", completed: initiallyCompleted, profileDone: false };

const StoreContext = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<State>(initial);
  const [ready, setReady] = useState(false);

  // Progress lives in the browser so each visitor gets their own demo.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- load once after mount to avoid hydration mismatch
      if (saved) setState({ ...initial, ...JSON.parse(saved) });
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {}
  }, [state, ready]);

  const signIn = useCallback((userId: string) => {
    const first = userId.trim().split(/[\s@._-]/)[0];
    const name = first ? first[0].toUpperCase() + first.slice(1) : "Jane";
    setState((s) => ({ ...s, name }));
  }, []);

  const setLanguage = useCallback((language: string) => setState((s) => ({ ...s, language })), []);

  const completeCourse = useCallback(
    (id: string) =>
      setState((s) => (s.completed.includes(id) ? s : { ...s, completed: [...s.completed, id] })),
    [],
  );

  const completeProfile = useCallback(() => setState((s) => ({ ...s, profileDone: true })), []);

  const resetDemo = useCallback(() => setState(initial), []);

  return (
    <StoreContext.Provider value={{ ...state, ready, signIn, setLanguage, completeCourse, completeProfile, resetDemo }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const store = useContext(StoreContext);
  if (!store) throw new Error("useStore must be used inside StoreProvider");
  return store;
}
