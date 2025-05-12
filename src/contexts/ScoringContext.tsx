import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { SCORING_THRESHOLDS, DEFAULT_WEIGHTS, LOAN_TYPE_WEIGHTS } from '../utils/scoringConstants';

// Define types for scoring data
export type CreditStatus = 'good' | 'average' | 'negative';
export type LoanType = 'general' | 'equipment' | 'realestate';

// Individual parameter for scoring
export interface ScoringParameter {
  id: string;
  name: string;
  value: string | number;
  status: CreditStatus;
  points: number;
  dataSource?: string;
}

// Category for grouping parameters
export interface ScoringCategory {
  id: keyof typeof DEFAULT_WEIGHTS;
  name: string;
  description: string;
  enabled: boolean;
  parameters: ScoringParameter[];
  weight: number;
  score: number;
  maxScore: number;
  traditionalCMapping: string; // Maps to traditional "C" of credit
}

// Profile to save weights and thresholds
export interface ScoringProfile {
  id: string;
  name: string;
  description?: string;
  weights: Record<string, number>;
  thresholds: typeof SCORING_THRESHOLDS;
  createdAt: Date;
  updatedAt: Date;
  isDefault?: boolean;
}

// Complete borrower data with all categories
export interface BorrowerData {
  id: string;
  name: string;
  loanType: LoanType;
  loanAmount?: number;
  categories: Record<string, ScoringCategory>;
  totalScore: number;
  maxPossibleScore: number;
  recommendation?: string;
}

// Context interface definition
interface ScoringContextType {
  weights: Record<string, number>;
  setWeights: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  thresholds: typeof SCORING_THRESHOLDS;
  setThresholds: React.Dispatch<React.SetStateAction<typeof SCORING_THRESHOLDS>>;
  profiles: ScoringProfile[];
  setProfiles: React.Dispatch<React.SetStateAction<ScoringProfile[]>>;
  currentProfile: ScoringProfile | null;
  setCurrentProfile: React.Dispatch<React.SetStateAction<ScoringProfile | null>>;
  borrowerData: BorrowerData | null;
  setBorrowerData: React.Dispatch<React.SetStateAction<BorrowerData | null>>;
  scores: Record<string, number> | null;
  setScores: React.Dispatch<React.SetStateAction<Record<string, number> | null>>;
  loanType: LoanType;
  setLoanType: React.Dispatch<React.SetStateAction<LoanType>>;
  calculateScores: (data: BorrowerData) => Record<string, number>;
  saveProfile: (profile: Omit<ScoringProfile, 'id' | 'createdAt' | 'updatedAt'>) => void;
  loadProfile: (profileId: string) => void;
  resetToDefaults: () => void;
}

// Create the context
export const ScoringContext = createContext<ScoringContextType | undefined>(undefined);

// Provider component
export const ScoringProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [weights, setWeights] = useState<Record<string, number>>(DEFAULT_WEIGHTS);
  const [thresholds, setThresholds] = useState(SCORING_THRESHOLDS);
  const [profiles, setProfiles] = useState<ScoringProfile[]>([]);
  const [currentProfile, setCurrentProfile] = useState<ScoringProfile | null>(null);
  const [borrowerData, setBorrowerData] = useState<BorrowerData | null>(null);
  const [scores, setScores] = useState<Record<string, number> | null>(null);
  const [loanType, setLoanType] = useState<LoanType>('general');

  // Initialize profiles
  useEffect(() => {
    import('../utils/scoringConstants').then(({ DEFAULT_PROFILES }) => {
      setProfiles(DEFAULT_PROFILES);
      // Load default profile
      const defaultProfile = DEFAULT_PROFILES.find(profile => profile.isDefault) || DEFAULT_PROFILES[0];
      if (defaultProfile) {
        setCurrentProfile(defaultProfile);
        setWeights(defaultProfile.weights);
        setThresholds(defaultProfile.thresholds);
      }
    });
  }, []);

  // Update weights when loan type changes
  useEffect(() => {
    // Only change weights when no profile is specifically selected
    if (!currentProfile) {
      if (loanType === 'general') {
        setWeights(DEFAULT_WEIGHTS);
      } else if (loanType === 'equipment' && LOAN_TYPE_WEIGHTS.equipment) {
        setWeights(LOAN_TYPE_WEIGHTS.equipment);
      } else if (loanType === 'realestate' && LOAN_TYPE_WEIGHTS.realestate) {
        setWeights(LOAN_TYPE_WEIGHTS.realestate);
      }
    }
  }, [loanType, currentProfile]);

  // Calculate scores based on the current weights and thresholds
  const calculateScores = (data: BorrowerData): Record<string, number> => {
    if (!data) return {};

    const categoryScores: Record<string, number> = {};
    let totalWeightedScore = 0;
    let totalPossibleWeightedScore = 0;

    // Calculate score for each category
    Object.entries(data.categories).forEach(([categoryId, category]) => {
      if (!category.enabled) return;

      // Get category weight
      const weight = weights[categoryId] || 0;
      
      // Calculate raw score from parameters
      let categoryScore = 0;
      let maxCategoryScore = 0;
      
      category.parameters.forEach(param => {
        categoryScore += param.points;
        // Assuming each parameter can have a max of 2 points
        maxCategoryScore += 2;
      });

      // Calculate weighted score
      const weightedScore = (categoryScore / maxCategoryScore) * weight;
      const possibleWeightedScore = weight;
      
      // Store category score
      categoryScores[categoryId] = Math.round((categoryScore / maxCategoryScore) * 100);
      
      // Add to totals
      totalWeightedScore += weightedScore;
      totalPossibleWeightedScore += possibleWeightedScore;
    });

    // Calculate overall score as a percentage
    categoryScores.overall = Math.round((totalWeightedScore / totalPossibleWeightedScore) * 100);
    
    return categoryScores;
  };

  // Save a new profile
  const saveProfile = (profileData: Omit<ScoringProfile, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProfile: ScoringProfile = {
      ...profileData,
      id: `profile-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setProfiles(prevProfiles => [...prevProfiles, newProfile]);
    setCurrentProfile(newProfile);
  };

  // Load an existing profile
  const loadProfile = (profileId: string) => {
    const profile = profiles.find(p => p.id === profileId);
    if (profile) {
      setCurrentProfile(profile);
      setWeights(profile.weights);
      setThresholds(profile.thresholds);
    }
  };

  // Reset to default settings
  const resetToDefaults = () => {
    const defaultProfile = profiles.find(profile => profile.isDefault);
    if (defaultProfile) {
      loadProfile(defaultProfile.id);
    } else {
      // Reset based on current loan type
      if (loanType === 'general') {
        setWeights(DEFAULT_WEIGHTS);
      } else if (loanType === 'equipment') {
        setWeights(LOAN_TYPE_WEIGHTS.equipment);
      } else if (loanType === 'realestate') {
        setWeights(LOAN_TYPE_WEIGHTS.realestate);
      }
      setThresholds(SCORING_THRESHOLDS);
    }
  };

  return (
    <ScoringContext.Provider value={{
      weights,
      setWeights,
      thresholds,
      setThresholds,
      profiles,
      setProfiles,
      currentProfile,
      setCurrentProfile,
      borrowerData,
      setBorrowerData,
      scores,
      setScores,
      loanType,
      setLoanType,
      calculateScores,
      saveProfile,
      loadProfile,
      resetToDefaults
    }}>
      {children}
    </ScoringContext.Provider>
  );
};

// Custom hook for using the scoring context
export const useScoring = (): ScoringContextType => {
  const context = useContext(ScoringContext);
  if (context === undefined) {
    throw new Error('useScoring must be used within a ScoringProvider');
  }
  return context;
}; 