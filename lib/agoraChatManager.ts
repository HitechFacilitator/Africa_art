let AgoraChat: any = null;

type MessageHandler = (msg: any) => void;
type ConnectionHandler = (connected: boolean) => void;

class AgoraChatManager {
  private conn: any = null;
  private connected = false;
  private messageHandlers: Set<MessageHandler> = new Set();
  private groupMessageHandlers: Map<string, Set<MessageHandler>> = new Map();
  private connectionHandlers: Set<ConnectionHandler> = new Set();
  private currentUserId: string | null = null;
  private refCount = 0;
  private joiningGroups: Set<string> = new Set();

  /**
   * Connect to Agora Chat SDK.
   * @param userId - Numeric user ID as string (e.g. "26")
   * @param token - Token from backend
   * @param appKey - Chat AppKey in OrgName#AppName format
   */
  async connect(userId: string, token: string, appKey: string): Promise<void> {
    if (typeof window === "undefined") return;
    if (!AgoraChat) {
      AgoraChat = (await import("agora-chat")).default;
    }
    if (this.connected && this.currentUserId === userId) {
      this.refCount++;
      return;
    }

    // Disconnect existing connection first
    if (this.conn) {
      try {
        await this.conn.close();
      } catch {
        // Ignore close errors
      }
      this.conn = null;
      this.connected = false;
    }

    this.conn = new AgoraChat.connection({
      appKey: appKey,
    });

    // Register message handler
    this.conn.addEventHandler("agoraChatManager", {
      onTextMessageReceived: (message: any) => {
        this.handleIncomingMessage(message);
      },
      onFileMessageReceived: (message: any) => {
        this.handleIncomingMessage(message);
      },
      onImageMessageReceived: (message: any) => {
        this.handleIncomingMessage(message);
      },
      onAudioMessageReceived: (message: any) => {
        this.handleIncomingMessage(message);
      },
      onVideoMessageReceived: (message: any) => {
        this.handleIncomingMessage(message);
      },
      onConnected: () => {
        this.connected = true;
        this.connectionHandlers.forEach((h) => h(true));
      },
      onDisconnected: () => {
        this.connected = false;
        this.connectionHandlers.forEach((h) => h(false));
      },
      onTokenWillExpire: () => {
        console.warn("[AgoraChat] Token will expire soon");
      },
      onTokenExpired: () => {
        console.error("[AgoraChat] Token expired");
        this.connected = false;
      },
    });

    try {
      await this.conn.open({
        user: userId,
        accessToken: token,
      });
      this.currentUserId = userId;
      this.connected = true;
      this.refCount++;
    } catch (err) {
      console.error("[AgoraChat] Connection failed:", err);
      throw err;
    }
  }

  async disconnect(): Promise<void> {
    this.refCount = Math.max(0, this.refCount - 1);
    if (this.refCount > 0) return;
  
    if (this.conn) {
      try {
        this.conn.removeEventHandler("agoraChatManager");
        await this.conn.close();
      } catch {
        // Ignore
      }
      this.conn = null;
      this.connected = false;
      this.currentUserId = null;
      this.joiningGroups.clear();
    }
  }

  /**
   * Join an Agora chat group to receive its messages.
   */
  async joinGroup(groupId: string): Promise<void> {
    if (!this.conn || !this.connected) return;
    if (this.joiningGroups.has(groupId)) return;

    this.joiningGroups.add(groupId);
    try {
      await this.conn.joinGroup(groupId);
    } catch (err: any) {
      // Code 204 means already in group — that's fine
      if (err?.message?.includes("204") || err?.code === 204) {
        return;
      }
      console.warn(`[AgoraChat] joinGroup ${groupId} warning:`, err);
    }
  }

  /**
   * Leave an Agora chat group.
   */
  async leaveGroup(groupId: string): Promise<void> {
    if (!this.conn || !this.connected) return;

    try {
      await this.conn.leaveGroup(groupId);
    } catch (err) {
      console.warn(`[AgoraChat] leaveGroup ${groupId} warning:`, err);
    }
    this.joiningGroups.delete(groupId);
  }

  /**
   * Send a text message to a group.
   */
  async sendMessage(groupId: string, text: string): Promise<void> {
    if (!this.conn || !this.connected) {
      throw new Error("Not connected to Agora Chat");
    }

    const msg = AgoraChat.message.create({
      type: "txt",
      chatType: "groupChat",
      to: groupId,
      msg: text,
    });

    try {
      await this.conn.send(msg);
    } catch (err: any) {
      console.warn("[AgoraChat] sendMessage skipped (non-critical):", err?.code || err?.message || "group not found");
      throw err;
    }
  }

  /**
   * Send a file/image/audio/video message to a group.
   */
  async sendFileMessage(groupId: string, file: File): Promise<void> {
    if (!this.conn || !this.connected) {
      throw new Error("Not connected to Agora Chat");
    }

    // Determine the file type from MIME
    let fileType: "img" | "file" | "audio" | "video" = "file";
    if (file.type.startsWith("image/")) fileType = "img";
    else if (file.type.startsWith("audio/")) fileType = "audio";
    else if (file.type.startsWith("video/")) fileType = "video";

    const msg = AgoraChat.message.create({
      type: fileType,
      chatType: "groupChat",
      to: groupId,
      file: file,
      ext: { filename: file.name, fileType },
    });

    try {
      await this.conn.send(msg);
    } catch (err: any) {
      console.warn("[AgoraChat] sendFileMessage skipped (non-critical):", err?.code || err?.message || "group not found");
      throw err;
    }
  }

  private handleIncomingMessage(message: any): void {
    // Notify global handlers
    this.messageHandlers.forEach((h) => {
      try {
        h(message);
      } catch (err) {
        console.error("[AgoraChat] Message handler error:", err);
      }
    });

    // Notify group-specific handlers
    const groupId = (message as any).to || (message as any).chatType === "groupChat" ? (message as any).to : undefined;
    if (groupId) {
      const handlers = this.groupMessageHandlers.get(groupId);
      if (handlers) {
        handlers.forEach((h) => {
          try {
            h(message);
          } catch (err) {
            console.error("[AgoraChat] Group message handler error:", err);
          }
        });
      }
    }
  }

  /**
   * Register a handler for all incoming messages.
   * Returns an unsubscribe function.
   */
  onMessage(handler: MessageHandler): () => void {
    this.messageHandlers.add(handler);
    return () => {
      this.messageHandlers.delete(handler);
    };
  }

  /**
   * Register a handler for messages in a specific group.
   * Returns an unsubscribe function.
   */
  onGroupMessage(groupId: string, handler: MessageHandler): () => void {
    if (!this.groupMessageHandlers.has(groupId)) {
      this.groupMessageHandlers.set(groupId, new Set());
    }
    this.groupMessageHandlers.get(groupId)!.add(handler);
    return () => {
      const handlers = this.groupMessageHandlers.get(groupId);
      if (handlers) {
        handlers.delete(handler);
        if (handlers.size === 0) {
          this.groupMessageHandlers.delete(groupId);
        }
      }
    };
  }

  /**
   * Register a handler for connection state changes.
   * Returns an unsubscribe function.
   */
  onConnectionChange(handler: ConnectionHandler): () => void {
    this.connectionHandlers.add(handler);
    return () => {
      this.connectionHandlers.delete(handler);
    };
  }

  isConnected(): boolean {
    return this.connected;
  }

  getCurrentUserId(): string | null {
    return this.currentUserId;
  }
}

// Singleton — one connection shared across the app
export const agoraChatManager = new AgoraChatManager();
