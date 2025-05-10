// Export risk components that actually exist in the directory
// Import and export newly added components from their respective directories
import AssetInventoryManager from '../asset/AssetInventoryManager';
import DealPipeline from '../broker/DealPipeline';
import RoleAnalyticsDisplay from '../analytics/RoleAnalyticsDisplay';
import SimplifiedBorrowerInterface from '../borrower/SimplifiedBorrowerInterface';

export { default as RiskAccordionHeader } from './RiskAccordionHeader';
export { default as RiskAccordionItem } from './RiskAccordionItem';
export { default as RiskAdvisorChat } from './RiskAdvisorChat';
export { default as RiskAdvisorWrapper } from './RiskAdvisorWrapper';
export { default as RiskCategoryDetail } from './RiskCategoryDetail';
export { default as RiskConfiguration } from './RiskConfiguration';
export { default as RiskLab } from './RiskLab';
export { default as RiskMapEvaReport } from './RiskMapEvaReport';
export { default as RiskMapNavigator } from './RiskMapNavigator';
export { default as RiskMapOptimized } from './RiskMapOptimized';
export { default as RiskMapSelector } from './RiskMapSelector';
export { default as RiskMetricsDisplay } from './RiskMetricsDisplay';
export { default as RiskScoreChart } from './RiskScoreChart';
export { default as SmartMatchingVariables } from './SmartMatchingVariables';
export { default as EvaScore } from './EvaScore';
export { default as EvaScoreLoader } from './EvaScoreLoader';

export { AssetInventoryManager, DealPipeline, RoleAnalyticsDisplay, SimplifiedBorrowerInterface };
