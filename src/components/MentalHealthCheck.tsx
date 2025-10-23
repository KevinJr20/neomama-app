import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { 
  ArrowLeft,
  Heart,
  Brain,
  Phone,
  MessageCircle,
  Users,
  CheckCircle,
  AlertTriangle,
  Headphones,
  Moon,
  Smile
} from 'lucide-react';

interface MentalHealthCheckProps {
  onBack: () => void;
  userName?: string;
}

interface Question {
  id: string;
  text: string;
  options: { value: number; text: string }[];
}

interface RelaxationSession {
  id: string;
  title: string;
  duration: string;
  type: 'breathing' | 'meditation' | 'affirmation';
  description: string;
  culturalContext: string;
}

export function MentalHealthCheck({ onBack, userName = "Brenda" }: MentalHealthCheckProps) {
  const [currentStep, setCurrentStep] = useState<'intro' | 'questionnaire' | 'results' | 'relaxation'>('intro');
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Edinburgh Postnatal Depression Scale (EPDS) adapted questions
  const questions: Question[] = [
    {
      id: 'laugh',
      text: 'I have been able to laugh and see the funny side of things',
      options: [
        { value: 0, text: 'As much as I always could' },
        { value: 1, text: 'Not quite so much now' },
        { value: 2, text: 'Definitely not so much now' },
        { value: 3, text: 'Not at all' }
      ]
    },
    {
      id: 'enjoyment',
      text: 'I have looked forward with enjoyment to things',
      options: [
        { value: 0, text: 'As much as I ever did' },
        { value: 1, text: 'Rather less than I used to' },
        { value: 2, text: 'Definitely less than I used to' },
        { value: 3, text: 'Hardly at all' }
      ]
    },
    {
      id: 'blame',
      text: 'I have blamed myself unnecessarily when things went wrong',
      options: [
        { value: 3, text: 'Yes, most of the time' },
        { value: 2, text: 'Yes, some of the time' },
        { value: 1, text: 'Not very often' },
        { value: 0, text: 'No, never' }
      ]
    },
    {
      id: 'anxiety',
      text: 'I have been anxious or worried for no good reason',
      options: [
        { value: 0, text: 'No, not at all' },
        { value: 1, text: 'Hardly ever' },
        { value: 2, text: 'Yes, sometimes' },
        { value: 3, text: 'Yes, very often' }
      ]
    },
    {
      id: 'scared',
      text: 'I have felt scared or panicky for no very good reason',
      options: [
        { value: 3, text: 'Yes, quite a lot' },
        { value: 2, text: 'Yes, sometimes' },
        { value: 1, text: 'No, not much' },
        { value: 0, text: 'No, not at all' }
      ]
    },
    {
      id: 'overwhelmed',
      text: 'Things have been getting on top of me',
      options: [
        { value: 3, text: 'Yes, most of the time I haven\'t been able to cope' },
        { value: 2, text: 'Yes, sometimes I haven\'t been coping as well' },
        { value: 1, text: 'No, most of the time I have coped quite well' },
        { value: 0, text: 'No, I have been coping as well as ever' }
      ]
    },
    {
      id: 'sleep',
      text: 'I have been so unhappy that I have had difficulty sleeping',
      options: [
        { value: 3, text: 'Yes, most of the time' },
        { value: 2, text: 'Yes, sometimes' },
        { value: 1, text: 'Not very often' },
        { value: 0, text: 'No, not at all' }
      ]
    },
    {
      id: 'sadness',
      text: 'I have felt sad or miserable',
      options: [
        { value: 3, text: 'Yes, most of the time' },
        { value: 2, text: 'Yes, quite often' },
        { value: 1, text: 'Not very often' },
        { value: 0, text: 'No, not at all' }
      ]
    }
  ];

  const relaxationSessions: RelaxationSession[] = [
    {
      id: '1',
      title: 'Ubuntu Breathing',
      duration: '5 min',
      type: 'breathing',
      description: 'Connect with your community through mindful breathing',
      culturalContext: 'Based on Ubuntu philosophy - breathing in strength from your sisters'
    },
    {
      id: '2',
      title: 'Mama\'s Meditation',
      duration: '10 min',
      type: 'meditation',
      description: 'Guided meditation for expectant African mothers',
      culturalContext: 'Drawing from ancestral wisdom and mother\'s intuition'
    },
    {
      id: '3',
      title: 'Positive Affirmations',
      duration: '3 min',
      type: 'affirmation',
      description: 'Uplifting affirmations in Swahili and English',
      culturalContext: 'Celebrating the strength of African motherhood'
    }
  ];

  const calculateScore = () => {
    return Object.values(answers).reduce((sum, score) => sum + score, 0);
  };

  const getScoreInterpretation = (score: number) => {
    if (score <= 8) {
      return {
        level: 'low',
        title: 'You\'re doing well, Mama!',
        description: 'Your responses suggest you\'re managing well emotionally. Keep taking care of yourself.',
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200'
      };
    } else if (score <= 12) {
      return {
        level: 'moderate',
        title: 'Consider reaching out for support',
        description: 'You may be experiencing some emotional challenges. Talking to someone can help.',
        color: 'text-orange-600',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-200'
      };
    } else {
      return {
        level: 'high',
        title: 'Please seek professional support',
        description: 'Your responses suggest you may benefit from professional mental health support.',
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200'
      };
    }
  };

  const handleAnswer = (questionId: string, value: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setCurrentStep('results');
    }
  };

  const startQuestionnaire = () => {
    setCurrentStep('questionnaire');
    setCurrentQuestionIndex(0);
    setAnswers({});
  };

  const currentQuestion = questions[currentQuestionIndex];
  const totalScore = calculateScore();
  const scoreInterpretation = getScoreInterpretation(totalScore);

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-background max-w-sm mx-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-card border-b border-border">
        <Button variant="ghost" size="sm" onClick={onBack} className="p-2">
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </Button>
        <h1 className="text-lg text-foreground">Mental Wellness</h1>
        <Button 
          variant="ghost" 
          size="sm" 
          className="p-2"
          onClick={() => setCurrentStep('relaxation')}
        >
          <Heart className="w-6 h-6 text-primary" />
        </Button>
      </div>

      <div className="pb-20">
        {/* Introduction */}
        {currentStep === 'intro' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 space-y-6"
          >
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-6 text-center space-y-4">
                <Brain className="w-12 h-12 text-primary mx-auto" />
                <h2 className="text-foreground">Your Mental Health Matters</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  As an African mother, your emotional wellbeing is just as important as your physical health. 
                  This quick check-in helps you understand how you're feeling and connects you with support when needed.
                </p>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <h3 className="text-foreground">Why mental health screening?</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    1 in 5 mothers experience perinatal depression or anxiety
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    Early detection leads to better outcomes for you and baby
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    Support is available - you don't have to face this alone
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Button 
                onClick={startQuestionnaire}
                className="w-full bg-primary hover:bg-primary/90"
              >
                <Brain className="w-4 h-4 mr-2" />
                Start Wellness Check
              </Button>
              <Button 
                variant="outline" 
                className="w-full border-primary/30 text-primary"
                onClick={() => setCurrentStep('relaxation')}
              >
                <Heart className="w-4 h-4 mr-2" />
                Relaxation Sessions
              </Button>
            </div>

            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="text-blue-800 text-sm">Privacy Notice</h4>
                    <p className="text-blue-700 text-xs mt-1">
                      Your responses are private and confidential. This screening is not a diagnosis 
                      but a tool to help you understand your mental health.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Questionnaire */}
        {currentStep === 'questionnaire' && currentQuestion && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-4 space-y-6"
          >
            {/* Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </span>
                <span className="text-muted-foreground">
                  {Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}%
                </span>
              </div>
              <Progress value={((currentQuestionIndex + 1) / questions.length) * 100} />
            </div>

            {/* Question */}
            <Card className="border-border">
              <CardContent className="p-6 space-y-6">
                <h3 className="text-foreground leading-relaxed">
                  {currentQuestion.text}
                </h3>

                <RadioGroup
                  value={answers[currentQuestion.id]?.toString() || ''}
                  onValueChange={(value) => handleAnswer(currentQuestion.id, parseInt(value))}
                >
                  <div className="space-y-3">
                    {currentQuestion.options.map((option, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <RadioGroupItem value={option.value.toString()} id={`option-${index}`} />
                        <Label 
                          htmlFor={`option-${index}`} 
                          className="text-sm text-foreground leading-relaxed cursor-pointer flex-1"
                        >
                          {option.text}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            <div className="flex space-x-3">
              {currentQuestionIndex > 0 && (
                <Button 
                  variant="outline" 
                  onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                  className="flex-1"
                >
                  Previous
                </Button>
              )}
              <Button 
                onClick={nextQuestion}
                disabled={!answers[currentQuestion.id] && answers[currentQuestion.id] !== 0}
                className="flex-1 bg-primary hover:bg-primary/90"
              >
                {currentQuestionIndex === questions.length - 1 ? 'See Results' : 'Next'}
              </Button>
            </div>
          </motion.div>
        )}

        {/* Results */}
        {currentStep === 'results' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 space-y-6"
          >
            <Card className={`${scoreInterpretation.bgColor} ${scoreInterpretation.borderColor}`}>
              <CardContent className="p-6 text-center space-y-4">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto ${
                  scoreInterpretation.level === 'low' ? 'bg-green-100' :
                  scoreInterpretation.level === 'moderate' ? 'bg-orange-100' : 'bg-red-100'
                }`}>
                  <span className={`text-2xl ${scoreInterpretation.color}`}>
                    {totalScore}
                  </span>
                </div>
                <h2 className={scoreInterpretation.color}>{scoreInterpretation.title}</h2>
                <p className={`text-sm ${scoreInterpretation.color} leading-relaxed`}>
                  {scoreInterpretation.description}
                </p>
              </CardContent>
            </Card>

            {/* Support Resources */}
            <div className="space-y-4">
              <h3 className="text-foreground">Support Resources</h3>
              
              <Card className="border-border hover:shadow-sm transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-foreground">Kenya Mental Health Helpline</p>
                      <p className="text-sm text-muted-foreground">0800 720 811 (Toll Free)</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border hover:shadow-sm transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <MessageCircle className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-foreground">Ubuntu Sister Support</p>
                      <p className="text-sm text-muted-foreground">Connect with understanding mothers</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border hover:shadow-sm transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <Users className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-foreground">Local Support Groups</p>
                      <p className="text-sm text-muted-foreground">Find mothers near you</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-3">
              <Button 
                onClick={() => setCurrentStep('relaxation')}
                className="w-full bg-primary hover:bg-primary/90"
              >
                <Heart className="w-4 h-4 mr-2" />
                Try Relaxation Exercises
              </Button>
              <Button 
                variant="outline" 
                onClick={startQuestionnaire}
                className="w-full"
              >
                Retake Assessment
              </Button>
            </div>
          </motion.div>
        )}

        {/* Relaxation Sessions */}
        {currentStep === 'relaxation' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 space-y-6"
          >
            <div className="text-center space-y-2">
              <Heart className="w-12 h-12 text-primary mx-auto" />
              <h2 className="text-foreground">Relaxation & Wellness</h2>
              <p className="text-sm text-muted-foreground">
                Culturally-rooted practices to support your mental wellbeing
              </p>
            </div>

            <div className="space-y-4">
              {relaxationSessions.map((session) => {
                const IconComponent = session.type === 'breathing' ? Headphones :
                                   session.type === 'meditation' ? Moon : Smile;
                
                return (
                  <Card key={session.id} className="border-border hover:shadow-sm transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <IconComponent className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="text-foreground">{session.title}</h4>
                            <Badge variant="outline">{session.duration}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {session.description}
                          </p>
                          <p className="text-xs text-primary">
                            {session.culturalContext}
                          </p>
                        </div>
                      </div>
                      <Button className="w-full mt-4 bg-primary hover:bg-primary/90">
                        Start Session
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <Card className="bg-purple-50 border-purple-200">
              <CardContent className="p-4">
                <h4 className="text-purple-800 mb-2">Remember, Mama</h4>
                <div className="text-xs text-purple-700 space-y-1">
                  <p>"Ubuntu ngumuntu ngabantu" - You are supported by your community</p>
                  <p>Taking care of your mental health makes you a stronger mother</p>
                  <p>It's okay to ask for help - that's what sisters are for</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}