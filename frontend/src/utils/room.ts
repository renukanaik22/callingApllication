import { ROOM_ID_LENGTH } from '../constants/webrtc';

export const generateRoomId = (): string => {
  return Math.random().toString(36).substring(2, 2 + ROOM_ID_LENGTH);
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    return false;
  }
};