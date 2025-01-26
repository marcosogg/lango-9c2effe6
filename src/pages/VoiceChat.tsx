import { useState } from 'react';
import VoiceInterface from '@/components/voice-chat/VoiceInterface';
import { Card } from '@/components/ui/card';

const VoiceChat = () => {
  const [isAISpeaking, setIsAISpeaking] = useState(false);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">English Conversation Practice</h1>
          <p className="text-xl text-muted-foreground">
            Practice your English speaking skills with our AI language tutor
          </p>
        </div>

        {/* How to Use Section */}
        <Card className="p-6 space-y-4">
          <h2 className="text-2xl font-semibold">How to Use</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>Click the "Start Conversation" button below</li>
            <li>Allow microphone access when prompted</li>
            <li>Start speaking in either English or Portuguese</li>
            <li>The AI tutor will respond in English and help you practice</li>
            <li>Click "End Conversation" when you're finished</li>
          </ol>
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              Tips:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Speak clearly and at a natural pace</li>
                <li>Don't worry about making mistakes - they're part of learning!</li>
                <li>Feel free to ask questions about pronunciation or vocabulary</li>
                <li>The AI tutor will understand you in Portuguese but respond in English</li>
              </ul>
            </p>
          </div>
        </Card>

        {/* Status Indicator */}
        {isAISpeaking && (
          <div className="text-center py-4">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary">
              <span className="mr-2">●</span> AI is speaking...
            </div>
          </div>
        )}

        {/* Voice Interface */}
        <VoiceInterface onSpeakingChange={setIsAISpeaking} />
      </div>
    </div>
  );
};

export default VoiceChat;