export type SignalingClient = {
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  sendOffer: (offer: RTCSessionDescriptionInit) => Promise<void>;
  sendAnswer: (answer: RTCSessionDescriptionInit) => Promise<void>;
  sendIceCandidate: (candidate: RTCIceCandidate) => Promise<void>;
  onOffer: (callback: (offer: RTCSessionDescriptionInit, peerId: string) => void) => void;
  onAnswer: (callback: (answer: RTCSessionDescriptionInit, peerId: string) => void) => void;
  onIceCandidate: (callback: (candidate: RTCIceCandidate, peerId: string) => void) => void;
  onDisconnect: (callback: () => void) => void;
  onNewPeer: (callback: (peerId: string) => void) => void;
  onPeerDisconnected: (callback: (peerId: string) => void) => void;
};
