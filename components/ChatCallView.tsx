"use client";

import { useState, useEffect } from "react";
import AgoraRTC, {
  AgoraRTCProvider,
  LocalUser,
  RemoteUser,
  useIsConnected,
  useJoin,
  useLocalMicrophoneTrack,
  useLocalCameraTrack,
  usePublish,
  useRemoteUsers,
} from "agora-rtc-react";
import { PhoneOff, Video, VideoOff, Mic, MicOff, X } from "lucide-react";

interface ChatCallViewProps {
  appId: string;
  groupId: string;
  isVideo?: boolean;
  onClose: () => void;
}

function CallContent({ appId, groupId, isVideo: initialIsVideo, onClose }: { appId: string; groupId: string; isVideo: boolean; onClose: () => void }) {
  const [isVideo, setIsVideo] = useState(initialIsVideo);
  const [audioMuted, setAudioMuted] = useState(false);

  useJoin({ appid: appId, channel: groupId, token: null }, true);

  const { localMicrophoneTrack } = useLocalMicrophoneTrack(!audioMuted);
  const { localCameraTrack } = useLocalCameraTrack(isVideo);

  usePublish([localMicrophoneTrack, localCameraTrack]);

  const remoteUsers = useRemoteUsers();
  const isConnected = useIsConnected();

  useEffect(() => {
    return () => {
      localMicrophoneTrack?.close();
      localCameraTrack?.close();
    };
  }, [localMicrophoneTrack, localCameraTrack]);

  return (
    <div className="fixed inset-0 bg-ebony-deep z-50 flex flex-col">
      <div className="bg-ebony-deep p-4 flex items-center justify-between border-b border-gold-leaf/20">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-parchment-ivory text-sm font-sans">
            {isVideo ? "Video" : "Voice"} Call — {remoteUsers.length + 1} participant{remoteUsers.length > 0 ? "s" : ""}
          </span>
        </div>
        <button onClick={onClose} className="text-parchment-ivory/60 hover:text-parchment-ivory cursor-pointer">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 p-4 grid grid-cols-2 gap-4 overflow-auto">
        <div className="bg-ebony-deep/80 rounded-lg overflow-hidden relative min-h-[200px]">
          <LocalUser
            audioTrack={localMicrophoneTrack}
            videoTrack={isVideo ? localCameraTrack : undefined}
            cameraOn={isVideo}
            micOn={!audioMuted}
          />
          <div className="absolute bottom-2 left-2 text-parchment-ivory/70 text-[10px] font-sans bg-ebony-deep/60 px-2 py-1 rounded">You</div>
        </div>

        {remoteUsers.map((user) => (
          <div key={user.uid} className="bg-ebony-deep/80 rounded-lg overflow-hidden relative min-h-[200px]">
            <RemoteUser user={user} />
            <div className="absolute bottom-2 left-2 text-parchment-ivory/70 text-[10px] font-sans bg-ebony-deep/60 px-2 py-1 rounded">User {String(user.uid)}</div>
          </div>
        ))}

        {remoteUsers.length === 0 && (
          <div className="flex items-center justify-center text-parchment-ivory/30 text-sm font-sans col-span-2 md:col-span-1">
            Waiting for others to join...
          </div>
        )}
      </div>

      <div className="bg-ebony-deep p-6 flex items-center justify-center gap-4 border-t border-gold-leaf/20">
        <button onClick={() => setAudioMuted(!audioMuted)}
          className={`w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition-colors ${audioMuted ? "bg-terracotta-earth text-parchment-ivory" : "bg-parchment-ivory/10 text-parchment-ivory hover:bg-parchment-ivory/20"}`}>
          {audioMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>
        <button onClick={() => setIsVideo(!isVideo)}
          className={`w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition-colors ${isVideo ? "bg-gold-leaf text-ebony-deep" : "bg-parchment-ivory/10 text-parchment-ivory hover:bg-parchment-ivory/20"}`}>
          {isVideo ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
        </button>
        <button onClick={onClose}
          className="w-14 h-14 rounded-full bg-red-600 text-parchment-ivory flex items-center justify-center cursor-pointer hover:bg-red-700 transition-colors">
          <PhoneOff className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}

export default function ChatCallView({ appId, groupId, isVideo = false, onClose }: ChatCallViewProps) {
  const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

  return (
    <AgoraRTCProvider client={client}>
      <CallContent appId={appId} groupId={groupId} isVideo={isVideo} onClose={onClose} />
    </AgoraRTCProvider>
  );
}
