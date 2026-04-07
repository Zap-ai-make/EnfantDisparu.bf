# Phase 2 Backend Integration - Deployment Guide

**Date:** 2026-04-02
**Purpose:** Step-by-step guide to deploy Phase 2 Cloud Functions and configure Firestore

---

## 📋 Prerequisites

### Required Tools
- [ ] Firebase CLI installed (`npm install -g firebase-tools`)
- [ ] Node.js 18+ installed
- [ ] Git repository access
- [ ] Firebase project access (admin permissions)

### Firebase Project Setup
- [ ] Project ID: `enfantperdu-bf` (or your project ID)
- [ ] Billing enabled (Cloud Functions require Blaze plan)
- [ ] Firestore database created
- [ ] Functions initialized in project

---

## 🚀 Part 1: Deploy Cloud Functions

### Step 1.1: Navigate to Functions Directory

```bash
cd "c:\Users\X1 Carbon\Desktop\EnfantPerdu.bf\functions"
```

### Step 1.2: Install Dependencies

```bash
npm install
```

### Step 1.3: Update Main Index File

Add Phase 2 exports to `functions/src/index.ts`:

```typescript
// ... existing exports ...

// Phase 2: Engagement Quotidien
export * from './phase2';
```

### Step 1.4: Build Functions

```bash
npm run build
```

**Expected output:** No TypeScript errors, compiled to `lib/` directory.

### Step 1.5: Deploy to Firebase

**Deploy all functions:**
```bash
firebase deploy --only functions
```

**Or deploy specific functions:**
```bash
# Deploy only Phase 2 functions
firebase deploy --only functions:aggregateGlobalStats,functions:aggregateDailyStats,functions:onBadgeUnlock,functions:onAmbassadorRecruit,functions:onStreakMilestone,functions:onZoneAdded,functions:onRetrouvaille,functions:createManualActivityEvent,functions:calculatePeakHours
```

**Expected output:**
```
✔  Deploy complete!

Functions:
  ✔ aggregateGlobalStats (scheduled)
  ✔ aggregateDailyStats (scheduled)
  ✔ calculatePeakHours (scheduled)
  ✔ onBadgeUnlock (firestore trigger)
  ✔ onAmbassadorRecruit (firestore trigger)
  ✔ onStreakMilestone (firestore trigger)
  ✔ onZoneAdded (firestore trigger)
  ✔ onRetrouvaille (firestore trigger)
  ✔ createManualActivityEvent (callable)
```

### Step 1.6: Verify Deployment

Check Firebase Console:
1. Go to https://console.firebase.google.com
2. Select your project
3. Navigate to **Functions** section
4. Verify all 9 functions are deployed

---

## 🗄️ Part 2: Configure Firestore

### Step 2.1: Create Collections

**Via Firebase Console:**

1. Navigate to **Firestore Database** → **Data** tab

2. **Create `system` collection:**
   - Click "Start collection"
   - Collection ID: `system`
   - First document ID: `globalStats`
   - Add initial fields:
     ```json
     {
       "totalAnnouncements": 0,
       "activeAnnouncements": 0,
       "resolvedAnnouncements": 0,
       "totalAmbassadors": 0,
       "totalShares": 0,
       "totalViews": 0,
       "totalPushSent": 0,
       "totalSightings": 0,
       "resolutionRate": 0,
       "avgResolutionTime": 0,
       "last24hAnnouncements": 0,
       "last24hShares": 0,
       "last24hViews": 0,
       "lastUpdated": "2026-04-02T00:00:00Z",
       "calculatedBy": "manual-init",
       "version": 1
     }
     ```

3. **Create `activityFeed` collection:**
   - Click "Start collection"
   - Collection ID: `activityFeed`
   - Add placeholder document (will be auto-deleted):
     ```json
     {
       "id": "placeholder",
       "type": "system",
       "ambassadorId": "system",
       "ambassadorName": "System",
       "timestamp": "2026-04-02T00:00:00Z"
     }
     ```

### Step 2.2: Create Composite Indexes

**Via Firebase Console:**

1. Navigate to **Firestore Database** → **Indexes** tab

2. **Create composite index for activityFeed:**
   - Click "Create Index"
   - Collection ID: `activityFeed`
   - Fields to index:
     - `timestamp` - Descending
     - `type` - Ascending
   - Query scopes: Collection
   - Click "Create"

**Wait 5-10 minutes for index to build.**

**Verify index is ready:**
- Status should show "Enabled" (green check)

### Step 2.3: Setup TTL Policy (Time-To-Live)

**Via gcloud CLI** (Firebase Console doesn't support TTL yet):

```bash
# Install gcloud if not already
# https://cloud.google.com/sdk/docs/install

# Authenticate
gcloud auth login

# Set project
gcloud config set project enfantperdu-bf

# Create TTL policy for activityFeed
gcloud firestore fields ttls update ttl \
  --collection-group=activityFeed \
  --enable-ttl
```

**Alternative:** Skip TTL for now, manually clean old events via Cloud Function.

### Step 2.4: Update Security Rules

Add rules for new collections in Firestore Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // ... existing rules ...

    // Activity Feed - Read only for authenticated users
    match /activityFeed/{eventId} {
      allow read: if request.auth != null;
      allow write: if false;  // Only Cloud Functions can write
    }

    // Global Stats - Public read
    match /system/globalStats {
      allow read: if true;
      allow write: if false;  // Only Cloud Functions
    }

    // Daily Stats - Read own only
    match /ambassadors/{ambassadorId}/dailyStats/{date} {
      allow read: if request.auth != null &&
                     request.auth.uid == ambassadorId;
      allow write: if false;  // Only Cloud Functions
    }

    // Goals - Read own only
    match /ambassadors/{ambassadorId}/goals/{goalId} {
      allow read: if request.auth != null &&
                     request.auth.uid == ambassadorId;
      allow write: if false;  // Only Cloud Functions
    }
  }
}
```

**Deploy rules:**
```bash
firebase deploy --only firestore:rules
```

---

## 🔄 Part 3: Initial Data Population

### Step 3.1: Trigger Global Stats Aggregation

**Manual trigger via gcloud:**

```bash
gcloud functions call aggregateGlobalStats --project=enfantperdu-bf
```

**Or wait 5 minutes** for scheduled function to run automatically.

**Verify:**
- Check Firestore `system/globalStats` document
- Should have real data now (not zeros)

### Step 3.2: Backfill Daily Stats (Optional)

Run one-time script to create last 7 days of daily stats:

```bash
# In functions directory
npm run shell

# In Firebase shell:
> aggregateDailyStats()
```

**Note:** This will create TODAY's snapshot. For historical data, you'd need a custom script.

### Step 3.3: Seed Activity Feed (Optional)

Generate sample activity events for testing:

Create `functions/src/scripts/seedActivityFeed.ts`:

```typescript
import * as admin from 'firebase-admin';

admin.initializeApp();
const db = admin.firestore();

async function seedActivityFeed() {
  const events = [
    {
      type: 'badge',
      ambassadorId: 'test_amb_1',
      ambassadorName: 'Amadou',
      metadata: { badgeId: 'super_partageur', badgeName: 'Super Partageur', badgeTier: 'gold' },
    },
    {
      type: 'recruit',
      ambassadorId: 'test_amb_2',
      ambassadorName: 'Fatou',
      metadata: { recruitedCount: 2 },
    },
    // Add more sample events...
  ];

  for (const event of events) {
    const eventId = `seed_${Date.now()}_${Math.random()}`;
    const ttl = admin.firestore.Timestamp.fromDate(
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    );

    await db.collection('activityFeed').doc(eventId).set({
      id: eventId,
      ...event,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      ttl,
    });
  }

  console.log('Activity feed seeded!');
}

seedActivityFeed();
```

Run with:
```bash
npx ts-node src/scripts/seedActivityFeed.ts
```

---

## 🧪 Part 4: Testing

### Step 4.1: Test Global Stats

**Via Frontend:**
1. Open app in browser
2. Navigate to homepage
3. Check Live Status Bar
4. Should show real stats (not mock data)

**Via Console:**
1. Check Firestore `system/globalStats`
2. Verify `lastUpdated` is recent (< 5 min ago)
3. Verify values match reality

### Step 4.2: Test Activity Feed

**Via Frontend:**
1. Navigate to ambassador dashboard
2. Scroll to Activity Feed
3. Should show real events (if any exist)

**Trigger test event:**
```bash
# Call createManualActivityEvent
gcloud functions call createManualActivityEvent \
  --data '{
    "type": "share",
    "ambassadorId": "YOUR_AMBASSADOR_ID",
    "metadata": {"announcementCode": "EP1234"}
  }' \
  --project=enfantperdu-bf
```

Refresh dashboard → new event should appear.

### Step 4.3: Test Daily Stats

**Wait for midnight (00:05 AM)** or manually trigger:

```bash
gcloud functions call aggregateDailyStats --project=enfantperdu-bf
```

**Verify:**
1. Check Firestore: `ambassadors/{id}/dailyStats/2026-04-02`
2. Should exist with snapshot values
3. Mission Control should show real historical data

### Step 4.4: Test Cloud Function Triggers

**Trigger badge unlock:**
1. Via admin panel, manually add a badge to an ambassador
2. Check logs: `firebase functions:log`
3. Should see "Activity event created: badge by [name]"
4. Check `activityFeed` collection → new event

**Trigger recruitment:**
1. Approve a new ambassador with `referredBy` field
2. Check logs
3. Activity feed should have recruit event

---

## 📊 Part 5: Monitoring & Optimization

### Step 5.1: Setup Cloud Function Alerts

**Via Firebase Console:**

1. Navigate to **Functions** → Select function → **Metrics**
2. Click "Create Alert"
3. Configure:
   - Metric: Error rate
   - Threshold: > 5% for 5 minutes
   - Notification: Email to admin

**Repeat for critical functions:**
- `aggregateGlobalStats`
- `aggregateDailyStats`
- `onBadgeUnlock`

### Step 5.2: Monitor Firestore Costs

**Via Firebase Console:**

1. Navigate to **Usage and Billing** → **Details**
2. Check:
   - Firestore reads: Target < 100K/day
   - Firestore writes: Target < 10K/day
   - Cloud Functions invocations: Target < 50K/day

**Set budget alert:**
1. Go to Google Cloud Console
2. Navigate to Billing → Budgets & alerts
3. Create budget: $10/month
4. Alert at 50%, 90%, 100%

### Step 5.3: Optimize Query Costs

**Reduce reads:**
1. Use cached `globalStats` instead of aggregating client-side
2. Use pagination for `activityFeed` (limit 50)
3. Debounce real-time listeners

**Reduce writes:**
1. Batch activity events (if high volume)
2. Consider rate limiting (max 1 event per user per minute)

### Step 5.4: Check Function Logs

```bash
# Stream logs live
firebase functions:log

# Filter by function
firebase functions:log --only aggregateGlobalStats

# Check for errors
firebase functions:log | grep ERROR
```

---

## 🔧 Part 6: Troubleshooting

### Issue: Function not deploying

**Solution:**
```bash
# Check Firebase login
firebase login --reauth

# Check project
firebase use --add

# Force redeploy
firebase deploy --only functions --force
```

### Issue: Index not ready

**Solution:**
- Wait 10-15 minutes
- Check Console → Firestore → Indexes
- Status should be "Enabled"

### Issue: Permission denied in Firestore

**Solution:**
- Check Firestore Rules are deployed
- Verify user authentication
- Check collection/document path spelling

### Issue: Stats not updating

**Solution:**
```bash
# Check function logs
firebase functions:log --only aggregateGlobalStats

# Manually trigger
gcloud functions call aggregateGlobalStats

# Verify cron schedule
gcloud scheduler jobs list
```

### Issue: Activity feed empty

**Solution:**
- Seed data (see Step 3.3)
- Trigger test events
- Check if Cloud Function triggers are working
- Verify security rules allow reads

---

## ✅ Deployment Checklist

### Pre-Deployment
- [ ] Code reviewed and tested locally
- [ ] All TypeScript errors resolved
- [ ] Environment variables configured
- [ ] Firestore indexes created
- [ ] Security rules updated

### Deployment
- [ ] Functions deployed successfully
- [ ] No deployment errors
- [ ] All 9 functions appear in console
- [ ] Scheduled functions show next run time

### Post-Deployment
- [ ] `system/globalStats` has real data
- [ ] `activityFeed` collection exists
- [ ] Composite index status: Enabled
- [ ] Security rules prevent unauthorized writes
- [ ] Frontend connects successfully

### Testing
- [ ] Live Status Bar shows real stats
- [ ] Activity Feed displays events
- [ ] Mission Control loads historical data
- [ ] Morning Briefing fetches real yesterday stats
- [ ] No console errors
- [ ] Mobile responsive works

### Monitoring
- [ ] Cloud Function logs show no errors
- [ ] Firestore costs within budget
- [ ] Alerts configured for critical functions
- [ ] Performance acceptable (< 2s load)

---

## 📚 Additional Resources

- [Firebase Cloud Functions Docs](https://firebase.google.com/docs/functions)
- [Firestore Query Optimization](https://firebase.google.com/docs/firestore/query-data/queries)
- [TTL Policy Setup](https://cloud.google.com/firestore/docs/ttl)
- [Security Rules Guide](https://firebase.google.com/docs/firestore/security/get-started)

---

## 🚨 Rollback Plan

If deployment causes issues:

```bash
# List previous deployments
firebase functions:log --only deployments

# Rollback to previous version
# (Manual: redeploy from previous git commit)

git checkout <previous-commit>
firebase deploy --only functions
```

---

**Deployment Guide Version:** 1.0
**Last Updated:** 2026-04-02
**Estimated Time:** 2-3 hours (including wait times for indexes)

---

*EnfantPerdu.bf - Phase 2 Backend Integration*
