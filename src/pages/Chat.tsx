import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Mic, Bot, User } from "lucide-react";

interface Message { id: number; role: "user" | "assistant"; text: string; }

const initial: Message[] = [
  { id: 1, role: "assistant", text: "Hey! 👋 I'm your AI Fitness Assistant. Ask me anything about your workouts, nutrition, or goals." },
  { id: 2, role: "user", text: "How many calories did I burn today?" },
  { id: 3, role: "assistant", text: "Based on your activity log, you've burned approximately 487 kcal today across 2 workouts — a 35-min run and a 45-min yoga session. Keep it up! 🔥" },
  { id: 4, role: "user", text: "What should I eat for dinner?" },
  { id: 5, role: "assistant", text: "Since you've burned 487 kcal and eaten about 1,100 kcal so far, I'd recommend a protein-rich dinner — grilled salmon with steamed veggies would give you ~450 kcal and 34g protein. 🐟" },
];

const botReplies = [
  "That's a great question! Based on your recent data, you're on track to hit your weekly goals. 💪",
  "I'd recommend increasing your water intake — you're at 1.5L today, aim for 2.5L!",
  "Your heart rate has been averaging 72 BPM, which is right in the healthy zone. 👍",
  "Try adding a 15-minute stretching session before bed to improve recovery.",
];

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>(initial);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const send = () => {
    if (!input.trim()) return;
    const userMsg: Message = { id: Date.now(), role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTimeout(() => {
      setMessages((prev) => [...prev, {
        id: Date.now() + 1, role: "assistant",
        text: botReplies[Math.floor(Math.random() * botReplies.length)],
      }]);
    }, 800);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)]">
      <h1 className="text-2xl font-bold text-foreground mb-4">AI Fitness Assistant</h1>

      <div className="flex-1 overflow-y-auto space-y-4 pr-2 pb-4">
        {messages.map((m) => (
          <div key={m.id} className={`flex gap-3 ${m.role === "user" ? "justify-end" : ""}`}>
            {m.role === "assistant" && (
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-muted-foreground" />
              </div>
            )}
            <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm ${
              m.role === "user"
                ? "stat-card-teal text-white rounded-br-md"
                : "bg-muted text-foreground rounded-bl-md"
            }`}>
              {m.text}
            </div>
            {m.role === "user" && (
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                <User className="w-4 h-4 text-primary-foreground" />
              </div>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="flex gap-2 pt-3 border-t border-border">
        <Button variant="outline" size="icon" className="shrink-0" title="Voice input (coming soon)">
          <Mic className="w-4 h-4" />
        </Button>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Ask me anything..."
          className="flex-1"
        />
        <Button onClick={send} size="icon" className="shrink-0"><Send className="w-4 h-4" /></Button>
      </div>
    </div>
  );
};

export default Chat;
