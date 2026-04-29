'use client';

import { useChat } from '@ai-sdk/react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

export default function ChatSidebar() {
  const [input, setInput] = useState('');
  const { messages, sendMessage, status } = useChat();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage({ text: input });
      setInput('');
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-background border-l">
      <div className="p-4">
        <h2 className="font-semibold text-lg">Asistente IA</h2>
        <p className="text-xs text-muted-foreground mt-1">
          Haz preguntas sobre la propuesta
        </p>
      </div>
      <Separator />

      <ScrollArea className="flex-1 w-full">
        <div className="p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <p className="text-sm">
                No hay mensajes. ¡Comienza una conversación!
              </p>
            </div>
          ) : (
            messages.map((m) => (
              <div
                key={m.id}
                className={cn(
                  'flex gap-3 whitespace-pre-wrap',
                  m.role === 'user' ? 'justify-end' : 'justify-start',
                )}
              >
                <div
                  className={cn(
                    'max-w-xs px-3 py-2 rounded-lg text-sm',
                    m.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-br-none'
                      : 'bg-muted text-muted-foreground rounded-bl-none',
                  )}
                >
                  {m.parts.map((part, idx) => {
                    switch (part.type) {
                      case 'text':
                        return <p key={idx}>{part.text}</p>;
                      default:
                        return null;
                    }
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      <Separator />

      <form
        onSubmit={handleSubmit}
        className="flex flex-row gap-2 p-4 bg-background"
      >
        <Input
          value={input}
          onChange={(e) => setInput(e.currentTarget.value)}
          placeholder="Escribe tu pregunta..."
          className="text-sm flex-1"
          disabled={status === 'submitted'}
        />
        <Button type="submit" disabled={status === 'submitted'} size="sm">
          <Send className="h-4 w-4 mr-2" />
          {status === 'submitted' ? 'Enviando...' : 'Enviar'}
        </Button>
      </form>
    </div>
  );
}
