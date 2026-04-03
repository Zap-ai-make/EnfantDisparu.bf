/**
 * Phase 2 Cloud Functions - Engagement Quotidien
 *
 * Exports all Cloud Functions for Phase 2 backend integration:
 * - Global stats aggregation
 * - Daily stats snapshots
 * - Activity feed event triggers
 * - Peak hour calculations
 *
 * Import in main functions/src/index.ts:
 * export * from './phase2';
 */

// Global Stats Aggregation
export { aggregateGlobalStats } from './aggregateGlobalStats';

// Daily Stats Aggregation
export { aggregateDailyStats, calculatePeakHours } from './aggregateDailyStats';

// Activity Feed Events
export {
  onBadgeUnlock,
  onAmbassadorRecruit,
  onStreakMilestone,
  onZoneAdded,
  onRetrouvaille,
  createManualActivityEvent,
} from './activityFeedEvents';

// Note: updateBriefing API route already exists in src/app/api/ambassador/update-briefing/route.ts
// No Cloud Function needed for that (handled by Next.js API route)
