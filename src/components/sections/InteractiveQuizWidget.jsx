import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from '@/components/ui/progress';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const InteractiveQuizWidget = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({ country: '', purpose: '' });
  const [score, setScore] = useState(0);

  const questions = [
    {
      id: 'country',
      question: '¿De dónde vienes?',
      options: ['Venezuela', 'Colombia', 'Argentina', 'México', 'Perú', 'Otro'],
    },
    {
      id: 'purpose',
      question: '¿Para qué tipo de proyecto migras?',
      options: ['Trabajo', 'Estudio', 'Inversión', 'Reagrupación Familiar', 'Otro'],
    },
  ];

  const handleSelect = (id, value) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
    setTimeout(() => {
      if (step < questions.length) {
        setStep(step + 1);
      }
    }, 300);
  };

  const calculateScore = () => {
    let calculatedScore = 32; // Base score
    if (answers.country === 'Colombia') calculatedScore += 5;
    if (answers.purpose === 'Inversión') calculatedScore += 15;
    if (answers.purpose === 'Trabajo') calculatedScore += 10;
    setScore(calculatedScore);
    setStep(step + 1);
  };

  const currentQuestion = questions[step];
  const progress = (step / (questions.length + 1)) * 100;

  return (
    <section className="py-24 px-4">
      <div className="max-w-2xl mx-auto bg-gray-800/50 border border-purple-500/20 rounded-2xl p-8 shadow-2xl shadow-purple-500/10">
        <AnimatePresence mode="wait">
          {step <= questions.length && (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
            >
              <Progress value={progress} className="mb-6" />
              {currentQuestion ? (
                <div>
                  <h3 className="text-2xl font-bold text-center mb-6">{currentQuestion.question}</h3>
                  <Select onValueChange={(value) => handleSelect(currentQuestion.id, value)}>
                    <SelectTrigger className="w-full text-lg py-6">
                      <SelectValue placeholder="Selecciona una opción..." />
                    </SelectTrigger>
                    <SelectContent>
                      {currentQuestion.options.map(opt => (
                        <SelectItem key={opt} value={opt} className="text-lg">{opt}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-4">¡Casi listo!</h3>
                  <p className="text-gray-300 mb-6">Basado en tus respuestas, podemos generar un score inicial.</p>
                  <Button onClick={calculateScore} size="lg">Calcular mi Score Inicial</Button>
                </div>
              )}
            </motion.div>
          )}

          {step > questions.length && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: 'backOut' }}
              className="text-center"
            >
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Tu Score Inicial es</h3>
              <p className="text-8xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-4">
                {score}
                <span className="text-4xl">/100</span>
              </p>
              <p className="text-gray-300 mb-6">Este es un estimado. Tu potencial real puede ser mucho mayor.</p>
              <Button onClick={() => navigate('/registro')} size="lg" className="w-full">
                Regístrate y desbloquea tu ruta completa
                <ArrowRight className="ml-2" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default InteractiveQuizWidget;