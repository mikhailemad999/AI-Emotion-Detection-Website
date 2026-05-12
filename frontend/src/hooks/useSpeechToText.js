import { useState, useRef, useEffect, useCallback } from 'react';

/**
 * Custom hook for handling browser Speech Recognition.
 * 
 * @returns {Object} { isRecording, toggleRecording, transcript, setTranscript, isSupported }
 */
const useSpeechToText = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;

    recognitionRef.current.onresult = (event) => {
      let currentTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        currentTranscript += event.results[i][0].transcript;
      }
      
      if (currentTranscript) {
        setTranscript(prev => {
          const space = prev && !prev.endsWith(' ') ? ' ' : '';
          return prev + space + currentTranscript.trim();
        });
      }
    };

    recognitionRef.current.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      setIsRecording(false);
    };

    recognitionRef.current.onend = () => {
      setIsRecording(false);
    };

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const startRecording = useCallback(() => {
    if (!recognitionRef.current) return;
    setTranscript('');
    recognitionRef.current.start();
    setIsRecording(true);
  }, []);

  const stopRecording = useCallback(() => {
    if (!recognitionRef.current) return;
    recognitionRef.current.stop();
    setIsRecording(false);
  }, []);

  const toggleRecording = useCallback(() => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  }, [isRecording, startRecording, stopRecording]);

  return {
    isRecording,
    toggleRecording,
    transcript,
    setTranscript,
    isSupported,
    startRecording,
    stopRecording
  };
};

export default useSpeechToText;
