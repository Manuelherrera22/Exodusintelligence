import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';

const SimulatorContext = createContext();

export const useSimulator = () => {
  const context = useContext(SimulatorContext);
  if (!context) {
    throw new Error('useSimulator must be used within a SimulatorProvider');
  }
  return context;
};

const SCORING = {
  education: { none: 1, high_school: 2, technical: 3, university: 4, postgraduate: 5 },
  work: { no: 1, informal: 2, contract: 3 },
  dependents: { yes: 1, no: 2 },
  languages: { no: 1, learning: 2, yes: 3 },
  passport: { no: 1, yes: 3 },
  commitment: 1, // each commitment option adds 1 point
};

export const SimulatorProvider = ({ children }) => {
  const getInitialState = () => {
    if (typeof window !== 'undefined') {
      const savedState = localStorage.getItem('simulatorState');
      if (savedState) {
        try {
          return JSON.parse(savedState);
        } catch (e) {
          console.error("Failed to parse simulator state from localStorage", e);
        }
      }
    }
    return {
      step: 1, // Start at welcome
      answers: {
        motivation: null,
        education: null,
        work: null,
        dependents: null,
        languages: null,
        passport: null,
        commitment: [],
        destination: null,
      },
      result: null,
    };
  };

  const [state, setState] = useState(getInitialState);

  useEffect(() => {
    localStorage.setItem('simulatorState', JSON.stringify(state));
  }, [state]);

  const setAnswer = (questionId, answer) => {
    setState(prevState => ({
      ...prevState,
      answers: {
        ...prevState.answers,
        [questionId]: answer,
      },
    }));
  };
  
  const toggleCommitment = (option) => {
    setState(prevState => {
      const currentCommitments = prevState.answers.commitment || [];
      const newCommitments = currentCommitments.includes(option)
        ? currentCommitments.filter(c => c !== option)
        : [...currentCommitments, option];
      return {
        ...prevState,
        answers: {
          ...prevState.answers,
          commitment: newCommitments,
        },
      };
    });
  };

  const nextStep = () => {
    setState(prevState => ({ ...prevState, step: prevState.step + 1 }));
  };

  const prevStep = () => {
    setState(prevState => ({ ...prevState, step: prevState.step - 1 }));
  };
  
  const calculateResult = () => {
    const { answers } = state;
    let score = 0;
    score += SCORING.education[answers.education] || 0;
    score += SCORING.work[answers.work] || 0;
    score += SCORING.dependents[answers.dependents] || 0;
    score += SCORING.languages[answers.languages] || 0;
    score += SCORING.passport[answers.passport] || 0;
    score += (answers.commitment?.length || 0) * SCORING.commitment;

    const maxScore = SCORING.education.postgraduate + SCORING.work.contract + SCORING.dependents.no + SCORING.languages.yes + SCORING.passport.yes + 5 * SCORING.commitment;
    const percentage = (score / maxScore) * 100;

    let viability;
    if (percentage > 70) viability = 'high';
    else if (percentage > 40) viability = 'medium';
    else viability = 'low';
    
    // Simple recommendation logic (can be expanded)
    const recommendedCountries = ['ES', 'PT', 'CA']; 

    const resultData = { score: Math.round(percentage), viability, recommendedCountries };
    setState(prevState => ({ ...prevState, result: resultData, step: 5 })); // Go to result step

    localStorage.setItem('simulator_data', JSON.stringify({ ...state.answers, migratory_score: Math.round(percentage) }));
  };

  const resetSimulator = () => {
    localStorage.removeItem('simulatorState');
    localStorage.removeItem('simulator_data');
    setState(getInitialState());
  };

  const value = useMemo(() => ({
    ...state,
    setAnswer,
    toggleCommitment,
    nextStep,
    prevStep,
    calculateResult,
    resetSimulator,
  }), [state]);

  return (
    <SimulatorContext.Provider value={value}>
      {children}
    </SimulatorContext.Provider>
  );
};