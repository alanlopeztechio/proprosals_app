import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Editor } from '@tiptap/core';
import { Sparkles, X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '../ui/scroll-area';

interface Messages {
  author: 'user' | 'assistant';
  message: string;
}

export default function PopUp() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<Messages[]>([
    {
      author: 'assistant',
      message:
        'Hola, soy tu asistente de IA. ¿Qué orden deseas ejecutar para esta propuesta?',
    },
  ]);

  const ref = useRef<HTMLInputElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      });
    }
  }, [messages]);

  return (
    <div className="absolute right-0 bottom-0 px-5 py-5 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="w-80 h-96 bg-background border rounded-2xl shadow-2xl flex flex-col overflow-hidden origin-bottom-right"
          >
            <div className="flex justify-between items-center p-3 border-b bg-muted/40">
              <div className="flex items-center gap-2">
                <div className="bg-blue-600 p-1.5 rounded-full">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <h3 className="font-semibold text-sm">Asistente IA</h3>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex-1 p-4 overflow-y-auto bg-muted/10">
              <ScrollArea ref={scrollAreaRef}>
                <div className="flex flex-col gap-4 w-full">
                  {messages?.map((msg, index) => (
                    <div
                      key={index}
                      //   className={`self-${msg.author === 'user' ? 'end' : 'start'} bg-muted px-4 py-2 rounded-2xl rounded-tl-sm text-sm max-w-[85%]`}
                      className={cn(
                        'bg-muted px-4 py-2 rounded-2xl text-sm max-w-[85%]',
                        msg.author === 'user'
                          ? 'self-end rounded-tr-sm'
                          : 'self-start rounded-tl-sm',
                      )}
                    >
                      {msg.message}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
            <div className="p-3 border-t bg-background">
              <div className="relative flex items-center">
                <input
                  ref={ref}
                  type="text"
                  placeholder="Escribe tu orden..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const value = ref.current?.value.trim();
                      if (value && ref.current) {
                        setMessages((prev) => [
                          ...prev,
                          { author: 'user', message: value },
                        ]);
                        ref.current.value = '';
                      }
                    }
                  }}
                  className="w-full pl-4 pr-10 py-2.5 text-sm rounded-full border bg-muted/50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-background transition-all"
                />
                <Button
                  onClick={() => {
                    const value = ref.current?.value.trim();
                    if (value && ref.current) {
                      setMessages((prev) => [
                        ...prev,
                        { author: 'user', message: value },
                      ]);
                      ref.current.value = '';
                    }
                  }}
                  size="icon"
                  className="absolute right-1 h-8 w-8 rounded-full bg-blue-600 hover:bg-blue-700"
                >
                  <Send className="h-3.5 w-3.5 text-white" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button // onClick={onRequestAI}
        // disabled={isAILoading}
        onClick={() => {
          setIsOpen(!isOpen);
        }}
        onMouseDown={(event) => {
          event.preventDefault();
        }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 25,
        }}
        animate={isOpen ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }}
        style={{ pointerEvents: isOpen ? 'none' : 'auto' }}
        className="rounded-full shadow-lg h-14 w-14 p-0 shrink-0 bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center"
        title="Preguntar a IA"
      >
        <Sparkles className="h-6 w-6" />
      </motion.button>
    </div>
  );
}
