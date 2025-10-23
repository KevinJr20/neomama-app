import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import { Progress } from './ui/progress';
import {
  X,
  Baby,
  Heart,
  Activity,
  Ruler,
  Weight,
  Calendar,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Eye,
  Ear,
  Hand,
  Brain,
  Smile,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface BabyDevelopmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentWeek: number;
  dueDate: string;
  babySize: string;
  babyWeight: string;
  babyHeight: string;
}

// Enhanced pregnancy milestones
const weeklyDevelopment: Record<number, {
  week: number;
  babySize: string;
  babyWeight: string;
  babyHeight: string;
  milestone: string;
  details: string;
  developmentHighlights: string[];
  mamaBody: string[];
  emoji: string;
  trimester: number;
}> = {
  4: {
    week: 4,
    babySize: 'poppy seed',
    babyWeight: '<1g',
    babyHeight: '2mm',
    milestone: 'Neural tube developing',
    details: 'Your baby is just a tiny embryo, but amazing things are already happening!',
    developmentHighlights: ['Heart begins to form', 'Neural tube closes', 'Placenta starts developing'],
    mamaBody: ['Missed period', 'Possible light spotting', 'Breast tenderness'],
    emoji: '🌱',
    trimester: 1
  },
  8: {
    week: 8,
    babySize: 'raspberry',
    babyWeight: '1g',
    babyHeight: '1.6cm',
    milestone: 'Fingers and toes forming',
    details: 'Baby is moving constantly, though you can\'t feel it yet. All major organs are developing.',
    developmentHighlights: ['Tiny fingers and toes', 'Heart beating strongly', 'Facial features emerging'],
    mamaBody: ['Morning sickness may peak', 'Fatigue', 'Food aversions'],
    emoji: '🫐',
    trimester: 1
  },
  12: {
    week: 12,
    babySize: 'lime',
    babyWeight: '14g',
    babyHeight: '5.4cm',
    milestone: 'All major organs formed',
    details: 'Your baby can open and close fingers, and may start to make sucking motions.',
    developmentHighlights: ['Reflexes developing', 'Vocal cords forming', 'Intestines in place'],
    mamaBody: ['Energy returning', 'Morning sickness easing', 'Baby bump starting'],
    emoji: '🥝',
    trimester: 1
  },
  16: {
    week: 16,
    babySize: 'avocado',
    babyWeight: '100g',
    babyHeight: '11.6cm',
    milestone: 'Baby can hear your voice',
    details: 'Your baby\'s eyes can move and they may be able to hear sounds from outside.',
    developmentHighlights: ['Hearing developing', 'Facial expressions', 'Grip reflex'],
    mamaBody: ['Feeling baby move soon', 'Glowing skin', 'Growing bump'],
    emoji: '🥑',
    trimester: 2
  },
  20: {
    week: 20,
    babySize: 'banana',
    babyWeight: '300g',
    babyHeight: '25.6cm',
    milestone: 'Halfway there!',
    details: 'You\'re at the halfway mark! Baby is very active and you can feel those movements.',
    developmentHighlights: ['Swallowing amniotic fluid', 'Producing meconium', 'Sensory development'],
    mamaBody: ['Regular baby movements', 'Round ligament pain', 'Growing appetite'],
    emoji: '🍌',
    trimester: 2
  },
  24: {
    week: 24,
    babySize: 'corn',
    babyWeight: '600g',
    babyHeight: '30cm',
    milestone: 'Baby can hear and respond to sounds',
    details: 'Baby is viable now! Their lungs are developing and they\'re gaining weight.',
    developmentHighlights: ['Lung development', 'Sleep-wake cycles', 'Taste buds working'],
    mamaBody: ['Braxton Hicks contractions', 'Back pain', 'Glucose screening'],
    emoji: '🌽',
    trimester: 2
  },
  28: {
    week: 28,
    babySize: 'eggplant',
    babyWeight: '1000g',
    babyHeight: '37.6cm',
    milestone: 'Eyes can open and close',
    details: 'Welcome to the third trimester! Baby is getting stronger every day.',
    developmentHighlights: ['Eyes opening', 'Brain development rapid', 'Can dream'],
    mamaBody: ['Feeling heavier', 'Shortness of breath', 'Frequent urination'],
    emoji: '🍆',
    trimester: 3
  },
  32: {
    week: 32,
    babySize: 'butternut squash',
    babyWeight: '1700g',
    babyHeight: '42cm',
    milestone: 'Practicing breathing movements',
    details: 'Baby is perfecting essential skills like breathing, sucking, and swallowing.',
    developmentHighlights: ['Breathing practice', 'Soft bones hardening', 'Fat accumulating'],
    mamaBody: ['Braxton Hicks increasing', 'Nesting instinct', 'Difficulty sleeping'],
    emoji: '🥒',
    trimester: 3
  },
  36: {
    week: 36,
    babySize: 'papaya',
    babyWeight: '2500g',
    babyHeight: '47cm',
    milestone: 'Baby is almost ready',
    details: 'Your baby is now considered "early term" and could arrive any day now!',
    developmentHighlights: ['Lungs nearly mature', 'Gaining 30g per day', 'Settling into position'],
    mamaBody: ['Pelvic pressure', 'Baby dropping', 'Weekly checkups'],
    emoji: '🥭',
    trimester: 3
  },
  40: {
    week: 40,
    babySize: 'watermelon',
    babyWeight: '3400g',
    babyHeight: '51cm',
    milestone: 'Due date!',
    details: 'Your baby is fully developed and ready to meet you! The wait is almost over.',
    developmentHighlights: ['Fully developed', 'All systems go', 'Ready for birth'],
    mamaBody: ['Ready for labor', 'Excited and nervous', 'Watching for signs'],
    emoji: '🍉',
    trimester: 3
  }
};

export function BabyDevelopmentModal({ 
  isOpen, 
  onClose, 
  currentWeek,
  dueDate,
  babySize,
  babyWeight,
  babyHeight
}: BabyDevelopmentModalProps) {
  const [selectedWeek, setSelectedWeek] = useState(currentWeek);

  // Find closest available week data
  const getWeekData = (week: number) => {
    const availableWeeks = Object.keys(weeklyDevelopment).map(Number).sort((a, b) => a - b);
    let closestWeek = availableWeeks[0];
    
    for (const availableWeek of availableWeeks) {
      if (availableWeek <= week) {
        closestWeek = availableWeek;
      } else {
        break;
      }
    }
    
    return weeklyDevelopment[closestWeek];
  };

  const currentData = getWeekData(selectedWeek);
  const progress = (selectedWeek / 40) * 100;
  const daysLeft = Math.max(0, Math.ceil((new Date(dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)));

  const handlePreviousWeek = () => {
    if (selectedWeek > 4) {
      const availableWeeks = Object.keys(weeklyDevelopment).map(Number).sort((a, b) => a - b);
      const currentIndex = availableWeeks.findIndex(w => w >= selectedWeek);
      if (currentIndex > 0) {
        setSelectedWeek(availableWeeks[currentIndex - 1]);
      }
    }
  };

  const handleNextWeek = () => {
    if (selectedWeek < 40) {
      const availableWeeks = Object.keys(weeklyDevelopment).map(Number).sort((a, b) => a - b);
      const currentIndex = availableWeeks.findIndex(w => w >= selectedWeek);
      if (currentIndex < availableWeeks.length - 1) {
        setSelectedWeek(availableWeeks[currentIndex + 1]);
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-4 md:inset-8 z-50 overflow-y-auto"
          >
            <Card className="max-w-4xl mx-auto bg-gradient-to-br from-card to-accent/20 border-border shadow-2xl">
              <CardContent className="p-0">
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-primary/90 to-pink-500/90 backdrop-blur-md p-4 md:p-6 z-10">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                        <Baby className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl text-white">Baby Development Journey</h3>
                        <p className="text-sm text-white/90">Week by week progress</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={onClose}
                      className="rounded-full bg-white/10 hover:bg-white/20 text-white"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-white/90">
                      <span>Week {selectedWeek} of 40</span>
                      <span>{Math.round(progress)}% Complete</span>
                    </div>
                    <Progress value={progress} className="h-2 bg-white/20" />
                    <div className="flex justify-between text-xs text-white/80">
                      <span>Trimester {currentData.trimester}</span>
                      <span>{daysLeft} days to go</span>
                    </div>
                  </div>
                </div>

                {/* Week Navigation */}
                <div className="flex items-center justify-between p-4 border-b border-border bg-card/50">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePreviousWeek}
                    disabled={selectedWeek <= 4}
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Previous
                  </Button>
                  <div className="text-center">
                    <p className="text-2xl">{currentData.emoji}</p>
                    <p className="text-sm text-muted-foreground">Week {selectedWeek}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNextWeek}
                    disabled={selectedWeek >= 40}
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                  {/* Baby Size Visualization */}
                  <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-200 dark:border-purple-900">
                    <CardContent className="p-6">
                      <div className="text-center space-y-3">
                        <div className="text-6xl mb-2">👶</div>
                        <h4 className="text-lg text-foreground">Size of a {currentData.babySize}</h4>
                        <div className="grid grid-cols-2 gap-4 mt-4">
                          <div className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-3">
                            <Ruler className="w-5 h-5 text-primary mx-auto mb-1" />
                            <p className="text-xs text-muted-foreground">Length</p>
                            <p className="text-foreground">{currentData.babyHeight}</p>
                          </div>
                          <div className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-3">
                            <Weight className="w-5 h-5 text-primary mx-auto mb-1" />
                            <p className="text-xs text-muted-foreground">Weight</p>
                            <p className="text-foreground">{currentData.babyWeight}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Milestone */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="w-5 h-5 text-primary" />
                      <h4 className="text-foreground">This Week's Milestone</h4>
                    </div>
                    <Card className="bg-accent/50">
                      <CardContent className="p-4">
                        <p className="text-lg text-foreground mb-2">{currentData.milestone}</p>
                        <p className="text-sm text-muted-foreground">{currentData.details}</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Tabs for Development Details */}
                  <Tabs defaultValue="baby" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="baby">Baby's Development</TabsTrigger>
                      <TabsTrigger value="mama">Your Body</TabsTrigger>
                    </TabsList>

                    <TabsContent value="baby" className="space-y-3 mt-4">
                      <div className="space-y-2">
                        {currentData.developmentHighlights.map((highlight, index) => (
                          <div key={index} className="flex items-start space-x-2">
                            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-foreground">{highlight}</p>
                          </div>
                        ))}
                      </div>

                      {/* Development Systems */}
                      <div className="grid grid-cols-2 gap-3 mt-4">
                        <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
                          <CardContent className="p-3 text-center">
                            <Brain className="w-6 h-6 text-blue-500 mx-auto mb-1" />
                            <p className="text-xs text-muted-foreground">Brain</p>
                            <p className="text-xs text-foreground">Developing</p>
                          </CardContent>
                        </Card>
                        <Card className="bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900">
                          <CardContent className="p-3 text-center">
                            <Heart className="w-6 h-6 text-red-500 mx-auto mb-1" />
                            <p className="text-xs text-muted-foreground">Heart</p>
                            <p className="text-xs text-foreground">Beating</p>
                          </CardContent>
                        </Card>
                        <Card className="bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-900">
                          <CardContent className="p-3 text-center">
                            <Eye className="w-6 h-6 text-purple-500 mx-auto mb-1" />
                            <p className="text-xs text-muted-foreground">Eyes</p>
                            <p className="text-xs text-foreground">{selectedWeek >= 28 ? 'Opening' : 'Forming'}</p>
                          </CardContent>
                        </Card>
                        <Card className="bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-900">
                          <CardContent className="p-3 text-center">
                            <Ear className="w-6 h-6 text-orange-500 mx-auto mb-1" />
                            <p className="text-xs text-muted-foreground">Ears</p>
                            <p className="text-xs text-foreground">{selectedWeek >= 16 ? 'Hearing' : 'Forming'}</p>
                          </CardContent>
                        </Card>
                      </div>
                    </TabsContent>

                    <TabsContent value="mama" className="space-y-3 mt-4">
                      <div className="space-y-2">
                        <h4 className="text-sm text-muted-foreground mb-2">What to expect:</h4>
                        {currentData.mamaBody.map((change, index) => (
                          <div key={index} className="flex items-start space-x-2">
                            <AlertCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-foreground">{change}</p>
                          </div>
                        ))}
                      </div>

                      <Card className="bg-accent/30 mt-4">
                        <CardContent className="p-4">
                          <div className="flex items-start space-x-2">
                            <Heart className="w-5 h-5 text-primary mt-0.5" />
                            <div>
                              <p className="text-sm text-foreground">Remember, mama:</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                Every pregnancy is unique. Talk to your healthcare provider if you have any concerns.
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-3 gap-3">
                    <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
                      <CardContent className="p-4 text-center">
                        <Calendar className="w-5 h-5 text-green-600 mx-auto mb-2" />
                        <p className="text-xs text-muted-foreground">Due Date</p>
                        <p className="text-sm text-foreground">{new Date(dueDate).toLocaleDateString()}</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20">
                      <CardContent className="p-4 text-center">
                        <Activity className="w-5 h-5 text-blue-600 mx-auto mb-2" />
                        <p className="text-xs text-muted-foreground">Trimester</p>
                        <p className="text-sm text-foreground">{currentData.trimester} of 3</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-950/20 dark:to-rose-950/20">
                      <CardContent className="p-4 text-center">
                        <Baby className="w-5 h-5 text-pink-600 mx-auto mb-2" />
                        <p className="text-xs text-muted-foreground">Days Left</p>
                        <p className="text-sm text-foreground">{daysLeft}</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
