import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

type User = {
  id: string;
  username: string;
}

type Message = {
  id: string;
  username: string;
  content: string;
  timestamp: Date | string;
  type: 'user' | 'system';
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [username, setUsername] = useState('');
  const [isUsernameSet, setIsUsernameSet] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const serverUrl = import.meta.env.VITE_SOCKET_URL || window.location.origin;
    const socketInstance = io(serverUrl, {
      transports: ['websocket', 'polling'],
      forceNew: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 10000
    });

    setSocket(socketInstance);

    socketInstance.on('connect', () => {
      setIsConnected(true);
    });

    socketInstance.on('disconnect', () => {
      setIsConnected(false);
    });

    socketInstance.on('message', (msg: Message) => {
      setMessages(prev => [...prev, msg]);
    });

    socketInstance.on('user-joined', (data: { user: User; message: Message }) => {
      setMessages(prev => [...prev, data.message]);
    });

    socketInstance.on('user-left', (data: { user: User; message: Message }) => {
      setMessages(prev => [...prev, data.message]);
    });

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const handleJoin = () => {
    if (socket && username.trim() && isConnected) {
      socket.emit('join', { username: username.trim() });
      setIsUsernameSet(true);
    }
  };

  const sendMessage = () => {
    if (socket && inputMessage.trim() && username.trim()) {
      socket.emit('message', {
        content: inputMessage.trim(),
        username: username.trim()
      });
      setInputMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-[#020817] text-white flex items-center justify-center p-4">
      <div className="container mx-auto max-w-2xl">
        <Card className="bg-zinc-900 border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-white">
              WebSocket Chat
              <span className={`text-sm px-2 py-1 rounded ${isConnected ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!isUsernameSet ? (
              <div className="space-y-2">
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleJoin();
                    }
                  }}
                  placeholder="Enter your username..."
                  disabled={!isConnected}
                  className="flex-1 bg-white/5 border-white/10 text-white"
                />
                <Button
                  onClick={handleJoin}
                  disabled={!isConnected || !username.trim()}
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-black"
                >
                  Join Chat
                </Button>
              </div>
            ) : (
              <>
                <ScrollArea className="h-80 w-full border border-white/10 rounded-md p-4">
                  <div className="space-y-2">
                    {messages.length === 0 ? (
                      <p className="text-gray-500 text-center">No messages yet</p>
                    ) : (
                      messages.map((msg) => (
                        <div key={msg.id} className="border-b border-white/10 pb-2 last:border-b-0">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <p className={`text-sm font-medium ${msg.type === 'system'
                                  ? 'text-emerald-400 italic'
                                  : 'text-gray-300'
                                }`}>
                                {msg.username}
                              </p>
                              <p className={`${msg.type === 'system'
                                  ? 'text-emerald-300 italic'
                                  : 'text-white'
                                }`}>
                                {msg.content}
                              </p>
                            </div>
                            <span className="text-xs text-gray-500">
                              {new Date(msg.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>

                <div className="flex space-x-2">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    disabled={!isConnected}
                    className="flex-1 bg-white/5 border-white/10 text-white"
                  />
                  <Button
                    onClick={sendMessage}
                    disabled={!isConnected || !inputMessage.trim()}
                    className="bg-emerald-500 hover:bg-emerald-400 text-black"
                  >
                    Send
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
