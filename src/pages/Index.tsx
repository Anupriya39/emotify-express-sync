
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EmojiMode from "@/components/emoji-mode/EmojiMode";
import VoiceNoteMode from "@/components/voice-note-mode/VoiceNoteMode";
import Navbar from "@/components/layout/Navbar";
import { Camera, Mic } from "lucide-react";

const Index = () => {
  const [activeMode, setActiveMode] = useState<"emoji" | "voice">("emoji");

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-light to-white flex flex-col">
      <Navbar />
      
      <main className="flex-1 container max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-purple-dark mb-4">
            Emotify
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Express yourself with AI-powered emoji animations and smart voice notes.
          </p>
        </div>

        <Tabs 
          defaultValue="emoji" 
          className="w-full max-w-4xl mx-auto"
          onValueChange={(value) => setActiveMode(value as "emoji" | "voice")}
        >
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="emoji" className="flex items-center justify-center gap-2 py-3">
              <Camera size={20} />
              <span>Emoji Puppeteer</span>
            </TabsTrigger>
            <TabsTrigger value="voice" className="flex items-center justify-center gap-2 py-3">
              <Mic size={20} />
              <span>Smart Voice Notes</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="emoji" className="mt-4 animate-fade-in">
            <EmojiMode />
          </TabsContent>
          
          <TabsContent value="voice" className="mt-4 animate-fade-in">
            <VoiceNoteMode />
          </TabsContent>
        </Tabs>
      </main>

      <footer className="py-6 border-t border-gray-200 bg-white">
        <div className="container max-w-7xl mx-auto px-4 text-center text-gray-500">
          <p>© 2025 Emotify - AI-Powered Expressive Communication Suite</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
