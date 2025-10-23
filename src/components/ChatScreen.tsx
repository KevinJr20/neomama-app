import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useScrollToTop } from './utils/useScrollToTop';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Avatar, AvatarFallback } from './ui/avatar';
import { 
  ArrowLeft,
  Send,
  Phone,
  Video,
  MoreVertical,
  Paperclip,
  Camera,
  Mic,
  Image as ImageIcon,
  Smile,
  User,
  Bell,
  BellOff,
  Search,
  Trash2,
  Ban
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';

interface ChatScreenProps {
  chatId: string;
  onBack: () => void;
}

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: Date;
  isMe: boolean;
}

interface UserProfile {
  name: string;
  pregnancyWeek: number;
  location: string;
  dueDate: string;
  bio: string;
}

export function ChatScreen({ chatId, onBack }: ChatScreenProps) {
  useScrollToTop();
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [showOptions, setShowOptions] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showCallDialog, setShowCallDialog] = useState(false);
  const [showVideoDialog, setShowVideoDialog] = useState(false);
  const [callType, setCallType] = useState<'voice' | 'video'>('voice');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Mock chat data
  const chatInfo = {
    id: chatId,
    name: chatId === '2' ? 'Faith Wanjiru' : chatId === '4' ? 'Grace Muthoni' : 'Sister Circle - Dec 2024',
    isGroup: chatId === '1' || chatId === '3' || chatId === '5',
    avatar: '/api/placeholder/40/40',
    isOnline: chatId === '2' || chatId === '1',
    lastSeen: new Date(),
    pregnancyWeek: 28,
    location: 'Nairobi',
    dueDate: 'March 15, 2025',
    bio: 'First-time mama, excited for this journey! 💕'
  };

  // Initialize with mock messages
  useEffect(() => {
    const initialMessages: Message[] = [
      {
        id: '1',
        senderId: '2',
        senderName: chatInfo.name,
        text: 'Good morning, sister! How are you feeling today?',
        timestamp: new Date(Date.now() - 3600000),
        isMe: false
      },
      {
        id: '2',
        senderId: 'me',
        senderName: 'You',
        text: 'Morning! I\'m feeling much better. The ginger tea really helped!',
        timestamp: new Date(Date.now() - 3500000),
        isMe: true
      },
      {
        id: '3',
        senderId: '2',
        senderName: chatInfo.name,
        text: 'That\'s wonderful! Remember to stay hydrated too 💙',
        timestamp: new Date(Date.now() - 3400000),
        isMe: false
      },
    ];
    setMessages(initialMessages);
  }, [chatId]);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        senderId: 'me',
        senderName: 'You',
        text: newMessage,
        timestamp: new Date(),
        isMe: true
      };
      setMessages([...messages, message]);
      setNewMessage('');
    }
  };

  const handleVoiceCall = () => {
    setCallType('voice');
    setShowCallDialog(true);
  };

  const handleVideoCall = () => {
    setCallType('video');
    setShowVideoDialog(true);
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-background w-full flex flex-col"
    >
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 flex items-center justify-between p-4 bg-card/95 backdrop-blur-md border-b border-border shadow-sm">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" onClick={onBack} className="p-2">
            <ArrowLeft className="w-6 h-6 text-foreground" />
          </Button>
          
          <div 
            className="flex items-center space-x-3 cursor-pointer hover:bg-accent/50 rounded-lg p-2 -ml-2 transition-colors"
            onClick={() => setShowProfile(true)}
          >
            <div className="relative">
              <Avatar className="w-10 h-10">
                <AvatarFallback className="bg-primary/10 text-primary">
                  {chatInfo.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              {chatInfo.isOnline && (
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-card rounded-full" />
              )}
            </div>
            
            <div>
              <h3 className="text-foreground">{chatInfo.name}</h3>
              <p className="text-xs text-muted-foreground">
                {chatInfo.isOnline ? 'Online' : 'Last seen recently'}
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-2 hover:bg-accent"
            onClick={handleVoiceCall}
          >
            <Phone className="w-5 h-5 text-foreground" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-2 hover:bg-accent"
            onClick={handleVideoCall}
          >
            <Video className="w-5 h-5 text-foreground" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-2 hover:bg-accent"
            onClick={() => setShowOptions(true)}
          >
            <MoreVertical className="w-5 h-5 text-foreground" />
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${message.isMe ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[75%] ${message.isMe ? 'items-end' : 'items-start'} flex flex-col`}>
              {!message.isMe && !chatInfo.isGroup && (
                <span className="text-xs text-muted-foreground mb-1 ml-3">
                  {message.senderName}
                </span>
              )}
              <div
                className={`rounded-2xl px-4 py-2 ${
                  message.isMe
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card border border-border'
                }`}
              >
                <p className="text-sm">{message.text}</p>
              </div>
              <span className="text-xs text-muted-foreground mt-1 mx-3">
                {formatTimestamp(message.timestamp)}
              </span>
            </div>
          </motion.div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="sticky bottom-0 border-t border-border bg-card p-4">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="flex-shrink-0"
          >
            <Paperclip className="w-5 h-5 text-muted-foreground" />
          </Button>
          
          <div className="flex-1 relative">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="pr-20 bg-input-background"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex space-x-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8"
              >
                <Camera className="w-4 h-4 text-muted-foreground" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8"
              >
                <Smile className="w-4 h-4 text-muted-foreground" />
              </Button>
            </div>
          </div>
          
          <Button
            type="submit"
            size="icon"
            className="flex-shrink-0 bg-primary hover:bg-primary/90"
            disabled={!newMessage.trim()}
          >
            <Send className="w-5 h-5" />
          </Button>
        </form>
      </div>

      {/* Profile Dialog */}
      <Dialog open={showProfile} onOpenChange={setShowProfile}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Profile</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            View profile information and contact details
          </DialogDescription>
          <div className="space-y-4 pt-4">
            <div className="flex flex-col items-center space-y-3">
              <Avatar className="w-24 h-24">
                <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                  {chatInfo.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h3 className="text-lg text-foreground">{chatInfo.name}</h3>
                {!chatInfo.isGroup && (
                  <>
                    <p className="text-sm text-muted-foreground">Week {chatInfo.pregnancyWeek}</p>
                    <p className="text-sm text-muted-foreground">{chatInfo.location}</p>
                  </>
                )}
              </div>
            </div>
            
            {!chatInfo.isGroup && (
              <div className="space-y-3 pt-4 border-t">
                <div>
                  <p className="text-xs text-muted-foreground">Due Date</p>
                  <p className="text-sm text-foreground">{chatInfo.dueDate}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Bio</p>
                  <p className="text-sm text-foreground">{chatInfo.bio}</p>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-3 gap-2 pt-4">
              <Button variant="outline" size="sm" className="flex flex-col h-auto py-3">
                <Phone className="w-5 h-5 mb-1" />
                <span className="text-xs">Call</span>
              </Button>
              <Button variant="outline" size="sm" className="flex flex-col h-auto py-3">
                <Video className="w-5 h-5 mb-1" />
                <span className="text-xs">Video</span>
              </Button>
              <Button variant="outline" size="sm" className="flex flex-col h-auto py-3">
                <Search className="w-5 h-5 mb-1" />
                <span className="text-xs">Search</span>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Options Dialog */}
      <Dialog open={showOptions} onOpenChange={setShowOptions}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Chat Options</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Manage this conversation and preferences
          </DialogDescription>
          <div className="space-y-2 pt-4">
            <Button variant="ghost" className="w-full justify-start" onClick={() => setShowProfile(true)}>
              <User className="w-4 h-4 mr-3" />
              View profile
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Search className="w-4 h-4 mr-3" />
              Search in chat
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <BellOff className="w-4 h-4 mr-3" />
              Mute notifications
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <ImageIcon className="w-4 h-4 mr-3" />
              View media
            </Button>
            <div className="border-t pt-2 mt-2">
              <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive">
                <Ban className="w-4 h-4 mr-3" />
                Block user
              </Button>
              <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive">
                <Trash2 className="w-4 h-4 mr-3" />
                Delete chat
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Voice Call Dialog */}
      <Dialog open={showCallDialog} onOpenChange={setShowCallDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="sr-only">Voice Call</DialogTitle>
          </DialogHeader>
          <DialogDescription className="sr-only">
            Voice call in progress
          </DialogDescription>
          <div className="flex flex-col items-center space-y-6 py-8">
            <Avatar className="w-32 h-32">
              <AvatarFallback className="bg-primary/10 text-primary text-4xl">
                {chatInfo.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="text-center">
              <h3 className="text-xl text-foreground">{chatInfo.name}</h3>
              <p className="text-muted-foreground mt-2">Calling...</p>
            </div>
            <div className="flex space-x-4 pt-4">
              <Button
                size="lg"
                variant="destructive"
                className="rounded-full w-16 h-16"
                onClick={() => setShowCallDialog(false)}
              >
                <Phone className="w-6 h-6 rotate-135" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Video Call Dialog */}
      <Dialog open={showVideoDialog} onOpenChange={setShowVideoDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="sr-only">Video Call</DialogTitle>
          </DialogHeader>
          <DialogDescription className="sr-only">
            Video call in progress
          </DialogDescription>
          <div className="flex flex-col items-center space-y-6 py-8">
            <Avatar className="w-32 h-32">
              <AvatarFallback className="bg-primary/10 text-primary text-4xl">
                {chatInfo.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="text-center">
              <h3 className="text-xl text-foreground">{chatInfo.name}</h3>
              <p className="text-muted-foreground mt-2">Starting video call...</p>
            </div>
            <div className="flex space-x-4 pt-4">
              <Button
                size="lg"
                variant="destructive"
                className="rounded-full w-16 h-16"
                onClick={() => setShowVideoDialog(false)}
              >
                <Video className="w-6 h-6" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
