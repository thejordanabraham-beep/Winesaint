# Review Generation System Analysis

## Current Problems

### 1. **No Duplicate Check**
The `generateReview()` function does NOT check if a wine already has a review before generating a new one. It just creates reviews blindly.

### 2. **Wine Documents Never Updated During Generation**
- Line 268-282 creates the review document
- **Missing**: No code to update the wine's `review` field
- This means wines NEVER get linked to their reviews during generation
- We had to manually link 5,025 reviews afterwards

### 3. **Parallel Batches Create Race Conditions**
- Running 10 batches in parallel
- All query for "wines without reviews" at the same time
- Since wines never get marked as "has review", all batches try to generate for the same wines
- Result: Massive duplicates (379 wines had 10 reviews each!)

### 4. **Inefficient API Usage**
- Generating reviews for wines that already have them
- No batching or caching
- Each API call costs money

## What Needs to Happen

### 1. Add Duplicate Prevention
```typescript
// Check if wine already has a review
const existingReview = await client.fetch(`
  *[_type == 'review' && wine._ref == $wineId][0]
`, { wineId: wine._id });

if (existingReview) {
  console.log('⏭️  Wine already has a review, skipping');
  return;
}
```

### 2. Update Wine Document Atomically
After creating review, immediately update the wine:
```typescript
// Create review
const reviewDoc = await client.create({ ... });

// Update wine to reference this review
await client
  .patch(wine._id)
  .set({ review: { _type: 'reference', _ref: reviewDoc._id } })
  .commit();
```

### 3. Run Sequential Batches or Use Locking
- Don't run 10 batches in parallel
- OR implement a locking mechanism
- OR use Sanity transactions

### 4. Better Cost Estimation
- Count wines needing reviews FIRST
- Estimate cost: ~$0.01 per review (rough estimate)
- For 4,592 wines = ~$46

## Recommended Approach

1. Fix the generation script to:
   - Check for existing reviews
   - Update wine documents atomically

2. Run ONE batch at a time with verification

3. Monitor progress with check script between batches

4. Only generate what's needed
