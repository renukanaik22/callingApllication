import { useState, useCallback } from 'react';
import { copyToClipboard as copyUtil } from '../utils/room';
import { COPY_TIMEOUT } from '../constants/webrtc';

interface UseCopyToClipboardReturn {
  copied: boolean;
  copyToClipboard: (text: string) => Promise<void>;
}

export const useCopyToClipboard = (): UseCopyToClipboardReturn => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = useCallback(async (text: string): Promise<void> => {
    const success = await copyUtil(text);
    
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), COPY_TIMEOUT);
    }
  }, []);

  return {
    copied,
    copyToClipboard
  };
};