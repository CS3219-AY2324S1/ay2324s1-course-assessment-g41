import { SignalingClient } from "@/@types/video";

export class WebSocketSignalingClient implements SignalingClient {
  private socket: WebSocket | null = null;

  // Add more properties and methods as needed for event handling
  private offerCallback?: (offer: RTCSessionDescriptionInit, peerId: string) => void;
  private answerCallback?: (answer: RTCSessionDescriptionInit, peerId: string) => void;
  private iceCandidateCallback?: (candidate: RTCIceCandidate, peerId: string) => void;
  private disconnectCallback?: () => void;
  private newPeerCallback?: (peerId: string) => void;
  private peerDisconnectedCallback?: (peerId: string) => void;

  constructor(private url: string) {
    console.log("WebSocketSignalingClient: Initializing with URL", this.url);
  }

  private setupWebSocket(socket: WebSocket): void {
    socket.onmessage = (event) => {
      console.log("WebSocketSignalingClient: Message received", event.data);
      const data = JSON.parse(event.data);
      switch (data.type) {
        case "offer":
          console.log("WebSocketSignalingClient: Offer received", data);
          this.offerCallback?.(data.offer, data.peerId);
          break;
        case "answer":
          console.log("WebSocketSignalingClient: Answer received", data);
          this.answerCallback?.(data.answer, data.peerId);
          break;
        case "ice-candidate":
          console.log("WebSocketSignalingClient: ICE candidate received", data);
          this.iceCandidateCallback?.(data.candidate, data.peerId);
          break;
        case "new-peer":
          console.log("WebSocketSignalingClient: New peer", data.peerId);
          this.newPeerCallback?.(data.peerId);
          break;
        case "peer-disconnected":
          console.log("WebSocketSignalingClient: Peer disconnected", data.peerId);
          this.peerDisconnectedCallback?.(data.peerId);
          break;
      }
    };

    socket.onclose = () => {
      console.log("WebSocketSignalingClient: Connection closed");
      this.disconnectCallback?.();
    };

    socket.onerror = (error) => {
      console.error("WebSocketSignalingClient: Error", error);
    };
  }

  async connect(): Promise<void> {
    console.log("WebSocketSignalingClient: Connecting...");
    this.socket = new WebSocket(this.url);

    this.setupWebSocket(this.socket);

    return new Promise((resolve, reject) => {
      if (this.socket) {
        this.socket.onopen = () => {
          console.log("WebSocketSignalingClient: Connected");
          resolve();
        };
        this.socket.onerror = (event) => {
          console.error("WebSocketSignalingClient: Connection error", event);
          reject(event);
        };
      }
    });
  }

  async disconnect(): Promise<void> {
    console.log("WebSocketSignalingClient: Disconnecting...");
    this.socket?.close();
  }

  async sendOffer(offer: RTCSessionDescriptionInit): Promise<void> {
    console.log("WebSocketSignalingClient: Sending offer", offer);
    this.socket?.send(JSON.stringify({ type: "offer", offer }));
  }

  async sendAnswer(answer: RTCSessionDescriptionInit): Promise<void> {
    console.log("WebSocketSignalingClient: Sending answer", answer);
    this.socket?.send(JSON.stringify({ type: "answer", answer }));
  }

  async sendIceCandidate(candidate: RTCIceCandidate): Promise<void> {
    console.log("WebSocketSignalingClient: Sending ICE candidate", candidate);
    this.socket?.send(JSON.stringify({ type: "ice-candidate", candidate }));
  }

  onOffer(callback: (offer: RTCSessionDescriptionInit, peerId: string) => void): void {
    console.log("WebSocketSignalingClient: Setting offer callback");
    this.offerCallback = callback;
  }

  onAnswer(callback: (answer: RTCSessionDescriptionInit, peerId: string) => void): void {
    console.log("WebSocketSignalingClient: Setting answer callback");
    this.answerCallback = callback;
  }

  onIceCandidate(callback: (candidate: RTCIceCandidate, peerId: string) => void): void {
    console.log("WebSocketSignalingClient: Setting ICE candidate callback");
    this.iceCandidateCallback = callback;
  }

  onDisconnect(callback: () => void): void {
    console.log("WebSocketSignalingClient: Setting disconnect callback");
    this.disconnectCallback = callback;
  }

  onNewPeer(callback: (peerId: string) => void): void {
    console.log("WebSocketSignalingClient: Setting new peer callback");
    this.newPeerCallback = callback;
  }

  onPeerDisconnected(callback: (peerId: string) => void): void {
    console.log("WebSocketSignalingClient: Setting peer disconnected callback");
    this.peerDisconnectedCallback = callback;
  }
}
