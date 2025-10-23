import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { ChevronLeft, ChevronRight, Calendar, Heart, Baby, X } from 'lucide-react';
import exampleImage from 'figma:asset/2f589e9818de1513b5deb44b12d30d24ee390625.png';

interface PregnancyStageVisualizationProps {
  isOpen: boolean;
  onClose: () => void;
  currentWeek: number;
}

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function PregnancyStageVisualization({ isOpen, onClose, currentWeek }: PregnancyStageVisualizationProps) {
  const [selectedWeek, setSelectedWeek] = useState(currentWeek);
  const currentDate = new Date(2025, 9, 16); // October 16, 2025
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Calculate pregnancy progress
  const progressPercentage = (selectedWeek / 40) * 100;
  const circumference = 2 * Math.PI * 85;
  const strokeDashoffset = circumference - (progressPercentage / 100) * circumference;

  // Generate calendar for current month
  const generateCalendarDays = () => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const startingDayOfWeek = (firstDay.getDay() + 6) % 7; // Make Monday = 0
    const daysInMonth = lastDay.getDate();
    
    const days = [];
    
    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays();
  const isToday = (day: number | null) => {
    if (!day) return false;
    return day === currentDate.getDate();
  };

  const handleWeekChange = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && selectedWeek > 1) {
      setSelectedWeek(selectedWeek - 1);
    } else if (direction === 'next' && selectedWeek < 40) {
      setSelectedWeek(selectedWeek + 1);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-0 gap-0 rounded-3xl overflow-hidden">
        <DialogHeader className="sr-only">
          <DialogTitle>Pregnancy Stage Visualization</DialogTitle>
          <DialogDescription>
            View your pregnancy progress and milestones with interactive calendar and week navigation
          </DialogDescription>
        </DialogHeader>
        {/* Header with close button */}
        <div className="relative bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 p-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute right-2 top-2 rounded-full w-8 h-8 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 p-6 space-y-6">
          {/* Mini Calendar */}
          <Card className="p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl">
            <div className="text-center mb-3">
              <h3 className="text-sm text-muted-foreground">{monthNames[currentMonth]}, {currentYear}</h3>
            </div>
            <div className="grid grid-cols-7 gap-1">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                <div key={i} className="text-center text-xs text-muted-foreground mb-1">
                  {day}
                </div>
              ))}
              {calendarDays.map((day, index) => (
                <div
                  key={index}
                  className={`aspect-square flex items-center justify-center text-xs rounded-full ${
                    day && isToday(day)
                      ? 'bg-gradient-to-br from-primary to-pink-400 text-white'
                      : day
                      ? 'text-foreground'
                      : ''
                  }`}
                >
                  {day}
                </div>
              ))}
            </div>
          </Card>

          {/* Circular Progress Visualization */}
          <div className="relative flex items-center justify-center">
            <svg className="w-64 h-64" viewBox="0 0 200 200">
              {/* Background circle */}
              <circle
                cx="100"
                cy="100"
                r="85"
                fill="none"
                stroke="currentColor"
                strokeWidth="12"
                className="text-gray-200 dark:text-gray-700"
              />
              {/* Progress circle with gradient */}
              <circle
                cx="100"
                cy="100"
                r="85"
                fill="none"
                stroke="url(#pregnancyGradient)"
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-500"
                style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
              />
              <defs>
                <linearGradient id="pregnancyGradient" x1="0%" y1="0%" x2="100%\" y2="100%">
                  <stop offset="0%" stopColor="#e06b75" />
                  <stop offset="50%" stopColor="#f4a5b9" />
                  <stop offset="100%" stopColor="#c8a2c8" />
                </linearGradient>
              </defs>
            </svg>
            
            {/* Center content with baby emoji */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="text-7xl mb-2"
              >
                👶
              </motion.div>
              <div className="text-center">
                <p className="text-3xl text-foreground">{selectedWeek}</p>
                <p className="text-sm text-muted-foreground">weeks</p>
              </div>
              <div className="mt-2 px-4 py-1 bg-primary/10 rounded-full">
                <p className="text-xs text-primary">{Math.round(progressPercentage)}% Complete</p>
              </div>
            </div>
          </div>

          {/* Week Navigation */}
          <div className="flex items-center justify-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleWeekChange('prev')}
              disabled={selectedWeek <= 1}
              className="rounded-full w-10 h-10 p-0"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            <div className="flex items-center gap-2">
              <Button
                variant={selectedWeek === currentWeek ? 'default' : 'outline'}
                size="sm"
                className="rounded-full w-10 h-10 p-0"
                onClick={() => setSelectedWeek(currentWeek)}
              >
                <Calendar className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full w-10 h-10 p-0"
              >
                <Heart className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full w-10 h-10 p-0"
              >
                <Baby className="w-4 h-4" />
              </Button>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleWeekChange('next')}
              disabled={selectedWeek >= 40}
              className="rounded-full w-10 h-10 p-0"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Week Info */}
          <Card className="p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Trimester</span>
                <span className="text-sm text-foreground">
                  {selectedWeek <= 13 ? '1st' : selectedWeek <= 27 ? '2nd' : '3rd'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Weeks Remaining</span>
                <span className="text-sm text-foreground">{40 - selectedWeek} weeks</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Days to Due Date</span>
                <span className="text-sm text-foreground">{(40 - selectedWeek) * 7} days</span>
              </div>
            </div>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
