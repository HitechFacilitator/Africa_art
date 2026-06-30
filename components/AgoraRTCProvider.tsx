"use client";

import { ReactNode, createContext, useContext, useState, useCallback } from "react";

interface CallContextType {
  inCall: boolean;
  callGroupId: string;
  callAppId: string;
  startCall: (groupId: string, appId: string, isVideo?: boolean) => void;
  endCall: () => void;
}

const CallContext = createContext<CallContextType>({
  inCall: false,
  callGroupId: "",
  callAppId: "",
  startCall: () => {},
  endCall: () => {},
});

export function useCall() {
  return useContext(CallContext);
}

export default function AgoraCallingProvider({ children }: { children: ReactNode }) {
  const [inCall, setInCall] = useState(false);
  const [callGroupId, setCallGroupId] = useState("");
  const [callAppId, setCallAppId] = useState("");

  const startCall = useCallback((groupId: string, appId: string, isVideo?: boolean) => {
    setCallGroupId(groupId);
    setCallAppId(appId);
    setInCall(true);
  }, []);

  const endCall = useCallback(() => {
    setInCall(false);
    setCallGroupId("");
    setCallAppId("");
  }, []);

  return (
    <CallContext.Provider value={{ inCall, callGroupId, callAppId, startCall, endCall }}>
      {children}
    </CallContext.Provider>
  );
}
