'use client';

import { useEffect, useState } from 'react';
import { Ambassador } from '@/types/ambassador';
import {
  calculateMissionMetrics,
  generateAmbassadorGoals,
  calculateGoalProgress,
  isGoalCompleted,
  isGoalUrgent,
  generateInsights,
  getPerformanceTier,
  getNextTierProgress,
  prepareLineChartData,
  getLast7DaysLabels,
  analyzeActivityPatterns,
} from '@/lib/mission-control-utils';
import { fetchAmbassadorDailyStats, DailyStatsSnapshot } from '@/lib/firestore-helpers';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Target,
  Zap,
  Users,
  Share2,
  Eye,
  Award,
  Clock,
  BarChart3,
} from 'lucide-react';

interface MissionControlDashboardProps {
  ambassador: Ambassador;
  leaderboard?: { rank: number; totalScore: number; ambassador: Ambassador }[];
}

/**
 * Mission Control Dashboard
 *
 * Advanced analytics dashboard for power-user ambassadors.
 *
 * Features:
 * - Performance tier and progression
 * - 7-day trend charts (mini sparklines)
 * - Advanced metrics (virality, influence, consistency)
 * - Goals tracking with progress bars
 * - Strategic insights and recommendations
 * - Activity pattern analysis
 */
export function MissionControlDashboard({
  ambassador,
  leaderboard = [],
}: MissionControlDashboardProps) {
  const [dailyStats, setDailyStats] = useState<DailyStatsSnapshot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const prefersReducedMotion = useReducedMotion();

  // Fetch historical data from Firestore
  useEffect(() => {
    async function loadDailyStats() {
      setIsLoading(true);
      const stats = await fetchAmbassadorDailyStats(ambassador.id, 7);
      setDailyStats(stats);
      setIsLoading(false);
    }

    loadDailyStats();
  }, [ambassador.id]);

  // Calculate metrics using real data if available, otherwise use ambassador data
  const metrics = dailyStats.length > 0
    ? calculateMissionMetrics(ambassador, dailyStats)
    : calculateMissionMetrics(ambassador);

  const goals = generateAmbassadorGoals(ambassador);
  const insights = generateInsights(metrics);
  const tier = getPerformanceTier(metrics.totalImpactScore);
  const tierProgress = getNextTierProgress(metrics.totalImpactScore);
  const activityPattern = analyzeActivityPatterns(metrics.dailyScores);

  return (
    <div className="space-y-4">
      {/* Header: Performance Tier */}
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-indigo-100 text-sm mb-1">Niveau de performance</p>
            <div className="flex items-center gap-2">
              <span className="text-3xl">{tier.icon}</span>
              <h2 className="text-2xl font-bold">{tier.name}</h2>
            </div>
          </div>
          <div className="text-right">
            <p className="text-indigo-100 text-xs mb-1">Score total</p>
            <p className="text-3xl font-bold">{Math.round(metrics.totalImpactScore)}</p>
          </div>
        </div>

        {/* Tier progression */}
        {tierProgress.progress < 100 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-indigo-100">
                Prochain: {tierProgress.nextTier}
              </span>
              <span className="font-semibold">
                {tierProgress.pointsNeeded} pts restants
              </span>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div
                className={`h-full bg-white transition-all duration-500 ${
                  prefersReducedMotion ? '' : 'animate-pulse'
                }`}
                style={{ width: `${tierProgress.progress}%` }}
              />
            </div>
          </div>
        )}

        {tierProgress.progress === 100 && (
          <div className="text-center py-2 bg-white/10 rounded-xl">
            <p className="text-sm font-semibold">🏆 Niveau maximum atteint !</p>
          </div>
        )}
      </div>

      {/* Advanced Metrics Grid */}
      <div className="grid grid-cols-2 gap-3">
        <MetricCard
          icon={<Zap className="w-5 h-5" />}
          label="Vélocité"
          value={`${metrics.impactVelocity.toFixed(1)} pts/j`}
          color="orange"
          trend={activityPattern.trend}
        />
        <MetricCard
          icon={<Target className="w-5 h-5" />}
          label="Régularité"
          value={`${Math.round(metrics.consistency)}%`}
          color="blue"
          badge={metrics.consistency > 70 ? '✓' : undefined}
        />
        <MetricCard
          icon={<Share2 className="w-5 h-5" />}
          label="Viralité"
          value={`${Math.round(metrics.viralityScore)}/100`}
          color="purple"
          trend={metrics.viralityScore > 50 ? 'up' : 'stable'}
        />
        <MetricCard
          icon={<Users className="w-5 h-5" />}
          label="Influence"
          value={`${Math.round(metrics.influenceScore)}/100`}
          color="green"
          badge={metrics.networkSize > 10 ? '🌟' : undefined}
        />
      </div>

      {/* 7-Day Trend Charts */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-4">
        <h3 className="font-bold text-gray-900 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-gray-600" />
          Tendances 7 jours
        </h3>

        <div className="space-y-3">
          <MiniChart
            label="Score quotidien"
            data={metrics.dailyScores}
            color="indigo"
            suffix="pts"
          />
          <MiniChart
            label="Partages"
            data={metrics.dailyShares}
            color="blue"
            suffix=""
          />
          <MiniChart
            label="Vues générées"
            data={metrics.dailyViews}
            color="purple"
            suffix=""
          />
        </div>

        {/* Activity pattern summary */}
        <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
          <span className="text-gray-500">
            Tendance:{' '}
            <span className={`font-semibold ${
              activityPattern.trend === 'up' ? 'text-green-600' :
              activityPattern.trend === 'down' ? 'text-red-600' :
              'text-gray-600'
            }`}>
              {activityPattern.trend === 'up' ? '📈 Croissance' :
               activityPattern.trend === 'down' ? '📉 Décroissance' :
               '➡️ Stable'}
            </span>
          </span>
          <span className="text-gray-400">
            Volatilité: {activityPattern.volatility}%
          </span>
        </div>
      </div>

      {/* Goals Tracking */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-4">
        <h3 className="font-bold text-gray-900 flex items-center gap-2">
          <Target className="w-5 h-5 text-gray-600" />
          Objectifs actifs
        </h3>

        <div className="space-y-3">
          {goals.map((goal) => (
            <GoalCard key={goal.id} goal={goal} />
          ))}
        </div>
      </div>

      {/* Strategic Insights */}
      {insights.length > 0 && (
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-3">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-gray-600" />
            Insights stratégiques
          </h3>

          {insights.map((insight, idx) => (
            <InsightCard key={idx} insight={insight} />
          ))}
        </div>
      )}

      {/* Engagement Breakdown */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-4">
        <h3 className="font-bold text-gray-900">Détails engagement</h3>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500 text-xs mb-1">Vues par partage</p>
            <p className="text-2xl font-bold text-gray-900">
              {metrics.viewsPerShare.toFixed(1)}
            </p>
          </div>
          <div>
            <p className="text-gray-500 text-xs mb-1">Taux conversion</p>
            <p className="text-2xl font-bold text-gray-900">
              {metrics.conversionRate.toFixed(1)}%
            </p>
          </div>
          <div>
            <p className="text-gray-500 text-xs mb-1">Taille réseau</p>
            <p className="text-2xl font-bold text-gray-900">
              {metrics.networkSize}
            </p>
          </div>
          <div>
            <p className="text-gray-500 text-xs mb-1">Impact réseau</p>
            <p className="text-2xl font-bold text-gray-900">
              {metrics.networkImpact.toLocaleString('fr-FR')}
            </p>
          </div>
        </div>
      </div>

      {/* Peak Activity */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-orange-200 rounded-2xl p-5 space-y-2">
        <div className="flex items-center gap-2 text-orange-800">
          <Clock className="w-5 h-5" />
          <span className="font-semibold text-sm">Heure de pic</span>
        </div>
        <p className="text-3xl font-bold text-orange-600">
          {metrics.peakHour}h00
        </p>
        <p className="text-xs text-orange-700">
          Partage tes alertes autour de cette heure pour maximiser l'impact !
        </p>
      </div>
    </div>
  );
}

// ─── MetricCard Component ─────────────────────────────────────────────────────

interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: 'orange' | 'blue' | 'purple' | 'green';
  trend?: 'up' | 'down' | 'stable';
  badge?: string;
}

function MetricCard({ icon, label, value, color, trend, badge }: MetricCardProps) {
  const colorClasses = {
    orange: 'bg-gradient-to-br from-orange-50 to-red-50 border-orange-200',
    blue: 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200',
    purple: 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200',
    green: 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200',
  };

  const iconColorClasses = {
    orange: 'text-orange-600',
    blue: 'text-blue-600',
    purple: 'text-purple-600',
    green: 'text-green-600',
  };

  return (
    <div className={`${colorClasses[color]} border rounded-xl p-4`}>
      <div className="flex items-center justify-between mb-2">
        <div className={iconColorClasses[color]}>{icon}</div>
        {trend && (
          <div className="text-xs">
            {trend === 'up' && <TrendingUp className="w-4 h-4 text-green-600" />}
            {trend === 'down' && <TrendingDown className="w-4 h-4 text-red-600" />}
            {trend === 'stable' && <Minus className="w-4 h-4 text-gray-400" />}
          </div>
        )}
        {badge && <span className="text-lg">{badge}</span>}
      </div>
      <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
      <p className="text-xs text-gray-600">{label}</p>
    </div>
  );
}

// ─── MiniChart Component ──────────────────────────────────────────────────────

interface MiniChartProps {
  label: string;
  data: number[];
  color: 'indigo' | 'blue' | 'purple';
  suffix: string;
}

function MiniChart({ label, data, color, suffix }: MiniChartProps) {
  const labels = getLast7DaysLabels();
  const chartData = prepareLineChartData(data, labels);
  const max = chartData.max || 1;

  const colorClasses = {
    indigo: 'bg-indigo-500',
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-gray-700">{label}</span>
        <span className="text-gray-500 text-xs">
          Moy: {chartData.avg}{suffix}
        </span>
      </div>

      {/* Mini bar chart */}
      <div className="flex items-end gap-1 h-12">
        {chartData.values.map((value, idx) => {
          const height = max > 0 ? (value / max) * 100 : 0;
          return (
            <div key={idx} className="flex-1 flex flex-col items-center gap-1">
              <div
                className={`w-full ${colorClasses[color]} rounded-t transition-all duration-300`}
                style={{ height: `${height}%` }}
                title={`${labels[idx]}: ${value}${suffix}`}
              />
              <span className="text-[9px] text-gray-400">{labels[idx]}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── GoalCard Component ───────────────────────────────────────────────────────

interface GoalCardProps {
  goal: ReturnType<typeof generateAmbassadorGoals>[0];
}

function GoalCard({ goal }: GoalCardProps) {
  const progress = calculateGoalProgress(goal);
  const completed = isGoalCompleted(goal);
  const urgent = isGoalUrgent(goal);

  const typeColors = {
    daily: 'border-orange-200 bg-orange-50',
    weekly: 'border-blue-200 bg-blue-50',
    monthly: 'border-purple-200 bg-purple-50',
  };

  const typeIcons = {
    daily: '☀️',
    weekly: '📅',
    monthly: '🗓️',
  };

  return (
    <div
      className={`border rounded-xl p-4 ${typeColors[goal.type]} ${
        completed ? 'opacity-60' : ''
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{typeIcons[goal.type]}</span>
          <div>
            <p className="text-sm font-semibold text-gray-900 capitalize">
              {goal.type === 'daily' && 'Quotidien'}
              {goal.type === 'weekly' && 'Hebdomadaire'}
              {goal.type === 'monthly' && 'Mensuel'}
            </p>
            <p className="text-xs text-gray-600">
              {goal.metric === 'shares' && `${goal.target} partages`}
              {goal.metric === 'views' && `${goal.target} vues`}
              {goal.metric === 'recruits' && `${goal.target} recrutements`}
              {goal.metric === 'score' && `${goal.target} points`}
            </p>
          </div>
        </div>
        {completed && <span className="text-2xl">✅</span>}
        {!completed && urgent && (
          <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-semibold">
            Urgent
          </span>
        )}
      </div>

      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-600">
            {goal.current} / {goal.target}
          </span>
          <span className="font-semibold text-gray-900">{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${
              completed ? 'bg-green-500' : 'bg-gradient-to-r from-indigo-500 to-purple-500'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
        {goal.reward && (
          <p className="text-xs text-gray-500">
            🎁 Récompense: <span className="font-semibold">{goal.reward}</span>
          </p>
        )}
      </div>
    </div>
  );
}

// ─── InsightCard Component ────────────────────────────────────────────────────

interface InsightCardProps {
  insight: ReturnType<typeof generateInsights>[0];
}

function InsightCard({ insight }: InsightCardProps) {
  const priorityColors = {
    high: 'border-red-200 bg-red-50',
    medium: 'border-orange-200 bg-orange-50',
    low: 'border-green-200 bg-green-50',
  };

  return (
    <div className={`border rounded-xl p-4 ${priorityColors[insight.priority]}`}>
      <div className="flex items-start gap-3">
        <span className="text-2xl flex-shrink-0">{insight.icon}</span>
        <div className="flex-1">
          <p className={`font-semibold text-sm mb-1 ${insight.color}`}>
            {insight.title}
          </p>
          <p className="text-xs text-gray-700">{insight.message}</p>
        </div>
      </div>
    </div>
  );
}
