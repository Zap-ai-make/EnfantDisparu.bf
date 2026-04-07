# Firestore Schema - Phase 2 Backend Integration

**Date:** 2026-04-02
**Purpose:** Define Firestore collections structure for Phase 2 features

---

## 📚 Collections Overview

```
firestore/
├── ambassadors/              (existing)
│   └── {ambassadorId}/
│       ├── dailyStats/       (NEW - subcollection)
│       │   └── {YYYY-MM-DD}
│       └── goals/            (NEW - subcollection)
│           └── {goalId}
│
├── activityFeed/             (NEW - collection)
│   └── {eventId}
│
├── system/                   (NEW - collection)
│   ├── globalStats           (singleton document)
│   └── config                (optional)
│
└── announcements/            (existing)
    └── {announcementId}
```

---

## 🔷 1. Collection: `activityFeed`

**Purpose:** Store community activity events for real-time feed

### Document Structure

```typescript
activityFeed/{eventId}: {
  // Identity
  id: string;                    // Same as document ID
  type: ActivityType;            // 'share' | 'badge' | 'recruit' | ...

  // Ambassador info (denormalized for performance)
  ambassadorId: string;
  ambassadorName: string;        // First name only (privacy)

  // Timestamp
  timestamp: Timestamp;          // Server timestamp
  ttl: Timestamp;                // Auto-delete after 7 days (TTL policy)

  // Type-specific metadata
  metadata?: {
    // For 'badge' type:
    badgeId?: string;
    badgeName?: string;
    badgeTier?: 'bronze' | 'silver' | 'gold' | 'platinum';

    // For 'recruit' type:
    recruitedCount?: number;

    // For 'streak' type:
    streakDays?: number;

    // For 'rank_up' type:
    oldRank?: number;
    newRank?: number;

    // For 'zone_added' type:
    zoneId?: string;
    zoneName?: string;

    // For 'share' | 'sighting' | 'retrouvaille' types:
    announcementCode?: string;
  }
}
```

### Example Documents

```javascript
// Example 1: Badge unlock event
{
  id: "evt_2026-04-02_12345",
  type: "badge",
  ambassadorId: "amb_123",
  ambassadorName: "Amadou",
  timestamp: Timestamp(2026-04-02 14:30:00),
  ttl: Timestamp(2026-04-09 14:30:00),  // 7 days later
  metadata: {
    badgeId: "super_partageur",
    badgeName: "Super Partageur",
    badgeTier: "gold"
  }
}

// Example 2: Share event
{
  id: "evt_2026-04-02_67890",
  type: "share",
  ambassadorId: "amb_456",
  ambassadorName: "Fatou",
  timestamp: Timestamp(2026-04-02 15:45:00),
  ttl: Timestamp(2026-04-09 15:45:00),
  metadata: {
    announcementCode: "EP1234"
  }
}
```

### Indexes Required

```javascript
// Composite index for query optimization
activityFeed:
  - timestamp (descending)
  - type (ascending)

// Query example:
db.collection('activityFeed')
  .orderBy('timestamp', 'desc')
  .limit(50)
```

### TTL Policy Setup

```javascript
// Firestore TTL policy (setup via Firebase Console or gcloud)
// Field: ttl
// Collection: activityFeed
// Delete documents where ttl < current time
```

---

## 🔷 2. Collection: `system` (Singleton Documents)

### Document: `system/globalStats`

**Purpose:** Store aggregated platform-wide statistics

```typescript
system/globalStats: {
  // Core metrics
  totalAnnouncements: number;
  activeAnnouncements: number;
  resolvedAnnouncements: number;
  totalAmbassadors: number;

  // Engagement
  totalShares: number;
  totalViews: number;
  totalPushSent: number;
  totalSightings: number;

  // Success
  resolutionRate: number;        // Percentage (0-100)
  avgResolutionTime: number;     // Hours

  // Velocity (24h)
  last24hAnnouncements: number;
  last24hShares: number;
  last24hViews: number;

  // Metadata
  lastUpdated: Timestamp;        // Server timestamp
  calculatedBy: string;          // "cloud-function-v1"
  version: number;               // Schema version
}
```

### Example Document

```javascript
{
  totalAnnouncements: 487,
  activeAnnouncements: 175,
  resolvedAnnouncements: 312,
  totalAmbassadors: 156,
  totalShares: 22889,
  totalViews: 1665540,
  totalPushSent: 434408,
  totalSightings: 185,
  resolutionRate: 64.1,
  avgResolutionTime: 18.5,
  last24hAnnouncements: 3,
  last24hShares: 147,
  last24hViews: 8234,
  lastUpdated: Timestamp(2026-04-02 16:00:00),
  calculatedBy: "cloud-function-v1",
  version: 1
}
```

### Update Frequency

- **Cloud Function scheduled:** Every 5 minutes
- **Trigger:** `pubsub.schedule('every 5 minutes')`

---

## 🔷 3. Subcollection: `ambassadors/{id}/dailyStats`

**Purpose:** Store daily snapshot of ambassador stats for historical trends

### Document Structure

```typescript
ambassadors/{ambassadorId}/dailyStats/{YYYY-MM-DD}: {
  // Date
  date: Timestamp;               // Start of day (00:00:00)

  // Snapshot values (end of day)
  score: number;                 // Total impact score
  shares: number;                // Cumulative shares
  views: number;                 // Cumulative views
  recruits: number;              // Cumulative recruits
  notifications: number;         // Cumulative notifications activated

  // Activity tracking
  minutesActive: number;         // Time spent on platform (minutes)
  actionsCount: number;          // Number of actions taken
  peakHour: number;              // Hour with most activity (0-23)

  // Metadata
  createdAt: Timestamp;
}
```

### Example Document

```javascript
// ambassadors/amb_123/dailyStats/2026-04-02
{
  date: Timestamp(2026-04-02 00:00:00),
  score: 156,
  shares: 12,
  views: 842,
  recruits: 2,
  notifications: 5,
  minutesActive: 23,
  actionsCount: 8,
  peakHour: 14,
  createdAt: Timestamp(2026-04-03 00:05:00)  // Created by nightly job
}
```

### Aggregation Schedule

- **Cloud Function scheduled:** Every day at 00:05 AM
- **Trigger:** `pubsub.schedule('every day 00:05').timeZone('Africa/Ouagadougou')`

---

## 🔷 4. Subcollection: `ambassadors/{id}/goals`

**Purpose:** Track ambassador goals progress

### Document Structure

```typescript
ambassadors/{ambassadorId}/goals/{goalId}: {
  // Identity
  id: string;
  type: 'daily' | 'weekly' | 'monthly';

  // Goal definition
  metric: 'shares' | 'views' | 'recruits' | 'score';
  target: number;
  current: number;

  // Timeline
  createdAt: Timestamp;
  deadline: Timestamp;
  completedAt?: Timestamp;       // If completed

  // Reward
  reward?: string;               // "Badge 'X'" or "+100 pts"
  rewardClaimed: boolean;

  // Status
  status: 'active' | 'completed' | 'failed' | 'expired';
}
```

### Example Document

```javascript
// ambassadors/amb_123/goals/goal_daily_2026-04-02
{
  id: "goal_daily_2026-04-02",
  type: "daily",
  metric: "shares",
  target: 3,
  current: 2,
  createdAt: Timestamp(2026-04-02 00:00:00),
  deadline: Timestamp(2026-04-02 23:59:59),
  reward: "+20 pts bonus",
  rewardClaimed: false,
  status: "active"
}
```

### Lifecycle

1. **Creation:** Daily at 00:00 (Cloud Function)
2. **Update:** Real-time when action occurs (Cloud Function trigger)
3. **Completion:** When `current >= target` (Cloud Function)
4. **Cleanup:** Delete after 30 days (TTL or scheduled)

---

## 🔷 5. Extended: `ambassadors/{id}` (Modifications)

**New Fields to Add:**

```typescript
// Add to existing Ambassador document
{
  // ... existing fields ...

  // Briefing tracking
  lastBriefingDate?: Timestamp;
  briefingStats?: {
    totalViews: number;
    currentStreak: number;
    longestStreak: number;
    lastCompletedChallenge?: string;
    challengesCompleted: number;
  };

  // Badges
  badges?: Badge[];
  globalRank?: number;

  // Peak activity (for Mission Control)
  peakActivityHour?: number;     // 0-23

  // Network size (cached)
  networkSize?: number;          // Direct + indirect recruits
  lastNetworkUpdate?: Timestamp;
}
```

---

## 📊 Query Patterns & Indexes

### 1. Activity Feed Queries

```javascript
// Get latest 50 events
db.collection('activityFeed')
  .orderBy('timestamp', 'desc')
  .limit(50);

// Get events by type
db.collection('activityFeed')
  .where('type', '==', 'badge')
  .orderBy('timestamp', 'desc')
  .limit(20);

// Real-time listener
db.collection('activityFeed')
  .orderBy('timestamp', 'desc')
  .limit(50)
  .onSnapshot((snapshot) => { ... });
```

**Required Index:**
- Collection: `activityFeed`
- Fields: `timestamp` (desc), `type` (asc)

### 2. Daily Stats Queries

```javascript
// Get last 7 days for ambassador
const sevenDaysAgo = new Date();
sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

db.collection('ambassadors')
  .doc(ambassadorId)
  .collection('dailyStats')
  .where('date', '>=', sevenDaysAgo)
  .orderBy('date', 'asc')
  .get();
```

**Required Index:** Built-in (single field)

### 3. Global Stats Query

```javascript
// Simple document fetch (singleton)
db.collection('system')
  .doc('globalStats')
  .get();

// Real-time listener
db.collection('system')
  .doc('globalStats')
  .onSnapshot((doc) => { ... });
```

**No index required** (single document fetch)

---

## 🔐 Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Activity Feed - Read only for all authenticated users
    match /activityFeed/{eventId} {
      allow read: if request.auth != null;
      allow write: if false;  // Only Cloud Functions can write
    }

    // Global Stats - Read only for all
    match /system/globalStats {
      allow read: if true;  // Public read
      allow write: if false;  // Only Cloud Functions
    }

    // Ambassador Daily Stats - Read own only
    match /ambassadors/{ambassadorId}/dailyStats/{date} {
      allow read: if request.auth != null &&
                     request.auth.uid == ambassadorId;
      allow write: if false;  // Only Cloud Functions
    }

    // Ambassador Goals - Read own only
    match /ambassadors/{ambassadorId}/goals/{goalId} {
      allow read: if request.auth != null &&
                     request.auth.uid == ambassadorId;
      allow write: if false;  // Only Cloud Functions (for now)
    }
  }
}
```

---

## 🚀 Migration Plan

### Step 1: Create Collections (Manual)

1. Create `system` collection with `globalStats` document (empty shell)
2. Create `activityFeed` collection (empty)
3. No need to create subcollections (auto-created on first write)

### Step 2: Deploy Cloud Functions

1. `aggregateGlobalStats` - Every 5 min
2. `aggregateDailyStats` - Every day 00:05
3. `onAmbassadorShare` - Trigger on share
4. `onBadgeUnlock` - Trigger on badge unlock
5. `onAmbassadorRecruit` - Trigger on recruit approval

### Step 3: Backfill Data (Optional)

1. Run one-time script to populate `globalStats` from existing data
2. Generate last 7 days of `dailyStats` for all ambassadors (if possible)
3. Generate sample `activityFeed` events from recent actions

### Step 4: Update Frontend

1. Replace mock data in components with Firestore queries
2. Add real-time listeners where needed
3. Add error handling for failed queries

---

## 📈 Storage & Cost Estimates

### Activity Feed

- **Retention:** 7 days TTL
- **Write rate:** ~100 events/day (estimated)
- **Storage:** ~700 documents steady state
- **Read cost:** ~5000 reads/day (50 events × 100 users)
- **Write cost:** ~100 writes/day

**Monthly cost:** ~$0.50 (negligible)

### Global Stats

- **Documents:** 1 (singleton)
- **Update rate:** Every 5 min = 288/day = 8,640/month
- **Read rate:** ~1000/day = 30,000/month
- **Monthly cost:** ~$0.20

### Daily Stats

- **Per ambassador:** 1 doc/day
- **Total ambassadors:** 156
- **Monthly writes:** 156 × 30 = 4,680
- **Storage:** 156 × 30 = 4,680 docs/month (grows over time)
- **Read cost:** Minimal (only queried for Mission Control)
- **Monthly cost:** ~$0.15

**Total estimated cost Phase 2 backend:** ~$0.85/month

---

## ✅ Checklist

### Firestore Setup
- [ ] Create `system` collection
- [ ] Create `globalStats` document template
- [ ] Create `activityFeed` collection
- [ ] Setup TTL policy on `activityFeed`
- [ ] Create composite index (activityFeed: timestamp desc, type asc)
- [ ] Update security rules

### Cloud Functions
- [ ] Deploy `aggregateGlobalStats`
- [ ] Deploy `aggregateDailyStats`
- [ ] Deploy `onAmbassadorShare`
- [ ] Deploy `onBadgeUnlock`
- [ ] Deploy `onAmbassadorRecruit`
- [ ] Deploy `updateBriefing` (already exists, verify)
- [ ] Test all functions in development

### Frontend Updates
- [ ] Update MorningBriefingModal to fetch real yesterday stats
- [ ] Update ActivityFeed to use Firestore real-time listener
- [ ] Update LiveStatusBar to fetch from system/globalStats
- [ ] Update MissionControl to query dailyStats subcollection
- [ ] Add loading states
- [ ] Add error handling

### Testing
- [ ] Verify all queries return expected data
- [ ] Verify real-time listeners update correctly
- [ ] Load test with 100+ concurrent users
- [ ] Monitor Firestore costs dashboard

---

*Schema Version: 1.0*
*Last Updated: 2026-04-02*
*EnfantPerdu.bf - Phase 2 Backend Integration*
