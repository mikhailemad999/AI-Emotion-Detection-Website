import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SparklesIcon, MicrophoneIcon, DocumentArrowDownIcon, StopIcon } from '@heroicons/react/24/outline';
import useEmotion from '../hooks/useEmotion';
import EmotionCard from '../components/EmotionCard';
import AdvicePanel from '../components/AdvicePanel';

const Analyzer = () => {
  const [text, setText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const { analyzeEmotion, currentAnalysis, isLoading, error, clearCurrentAnalysis } = useEmotion();
  
  const textareaRef = useRef(null);
  const recognitionRef = useRef(null);

  // Initialize Speech Recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        
        if (currentTranscript) {
          setText(prev => {
            // Simple way to handle continuous dictation
            const withoutLastWord = prev.endsWith(' ') ? prev : prev + ' ';
            return withoutLastWord + currentTranscript.trim();
          });
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setIsRecording(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in your browser.");
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      setText(''); // Clear text when starting new recording
      clearCurrentAnalysis();
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
    await analyzeEmotion(text);
  };

  const handleExportPDF = () => {
    // Basic implementation for now - just alerts
    // In a real app, we'd use html2canvas and jsPDF here
    alert("PDF Export functionality will generate a report of the current analysis.");
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
    if (currentAnalysis) {
      clearCurrentAnalysis();
    }
    
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 300)}px`;
    }
  };

  return (
    <div className="flex flex-col gap-8 pb-12">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold mb-2">Emotion Analyzer</h1>
          <p className="text-text-muted">Type or speak to understand your emotional state.</p>
        </div>
        
        {currentAnalysis && (
          <button
            onClick={handleExportPDF}
            className="hidden sm:flex items-center gap-2 px-4 py-2 glass-panel hover:bg-surface-hover rounded-lg text-sm font-medium transition-colors"
          >
            <DocumentArrowDownIcon className="w-4 h-4" />
            Export PDF
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl">
          {error}
        </div>
      )}

      {/* Input Section */}
      <div className="glass-panel p-2 rounded-2xl relative z-20">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleTextChange}
          placeholder="How are you feeling right now? Type your thoughts here..."
          className="w-full bg-transparent p-4 min-h-[150px] outline-none resize-none text-lg"
          disabled={isLoading}
        />
        
        <div className="flex items-center justify-between p-2 border-t border-border mt-2">
          <div className="flex items-center gap-2">
            <button
              onClick={toggleRecording}
              disabled={isLoading}
              className={`p-3 rounded-xl transition-all flex items-center justify-center ${
                isRecording 
                  ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/30' 
                  : 'bg-surface hover:bg-surface-hover text-text-muted hover:text-text border border-border'
              }`}
              title={isRecording ? "Stop recording" : "Start voice input"}
            >
              {isRecording ? <StopIcon className="w-5 h-5" /> : <MicrophoneIcon className="w-5 h-5" />}
            </button>
            {isRecording && (
              <span className="text-sm font-medium text-red-500 animate-pulse">Listening...</span>
            )}
          </div>
          
          <button
            onClick={handleAnalyze}
            disabled={!text.trim() || isLoading}
            aria-label="Analyze"
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
              !text.trim() || isLoading
                ? 'bg-surface border border-border text-text-muted cursor-not-allowed'
                : 'bg-gradient-to-r from-primary to-secondary text-white hover:shadow-lg hover:shadow-primary/20 active:scale-95'
            }`}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <SparklesIcon className="w-5 h-5" />
                Analyze
              </>
            )}
          </button>
        </div>
      </div>

      {/* Results Section */}
      <AnimatePresence mode="wait">
        {currentAnalysis && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10"
          >
            {/* Primary Emotion */}
            <EmotionCard
              emotion={currentAnalysis.emotion}
              confidence={currentAnalysis.confidence}
              emoji={currentAnalysis.emoji}
              color={currentAnalysis.color}
              isPrimary={true}
              index={0}
            />
            
            {/* Advice Panel */}
            <div className="col-span-full md:col-span-2 md:row-start-2">
              <AdvicePanel 
                aiResponse={currentAnalysis.ai_response}
                tips={currentAnalysis.tips}
                color={currentAnalysis.color}
              />
            </div>
            
            {/* Secondary Emotions Column */}
            <div className="col-span-1 md:col-span-1 md:row-span-2 md:col-start-3 md:row-start-1 space-y-6">
              <h3 className="text-lg font-bold font-display px-2">Secondary Emotions</h3>
              
              {currentAnalysis.secondary_emotions.length > 0 ? (
                currentAnalysis.secondary_emotions.map((em, idx) => (
                  <EmotionCard
                    key={em.emotion}
                    emotion={em.emotion}
                    confidence={em.score}
                    emoji={em.emoji}
                    color="#64748b" // Neutral color for secondary
                    isPrimary={false}
                    index={idx + 1}
                  />
                ))
              ) : (
                <div className="glass-panel p-6 rounded-2xl text-center text-text-muted">
                  <p>No significant secondary emotions detected.</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Analyzer;
