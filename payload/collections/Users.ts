import type { CollectionConfig } from 'payload'

/**
 * Users collection — extended for Wine Saint Certified v1.
 *
 * Holds three user types discriminated by `userType`:
 *
 *   - editorial:  Real Payload admin users (Abe, future editors).
 *                 Have real email + password, log in via Payload admin.
 *                 The default admin list filter only shows these.
 *
 *   - anonymous:  Device-tracked learners (no auth in v1).
 *                 Synthetic email: anon-{deviceId}@anon.winesaint.com.
 *                 No usable password (random system-generated).
 *                 Identified by cookie UUID stored in `deviceId`.
 *
 *   - registered: A learner who later signed up with a real email
 *                 (Phase 2 when Premium + auth ships). Same row as
 *                 their prior anonymous self — userType flipped from
 *                 'anonymous' to 'registered' and email updated.
 *                 Progress carries over with zero migration.
 *
 * One-time backfill at deploy: existing editorial users get
 *   UPDATE users SET user_type = 'editorial' WHERE user_type IS NULL;
 */
export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'userType', 'displayName', 'currentStreak', 'lastSessionAt'],
    // Default admin list shows only editorial users so the team isn't wading
    // through thousands of anonymous device rows. Override the filter to see
    // learners.
    baseListFilter: () => ({ userType: { equals: 'editorial' } }),
  },
  fields: [
    // ── Existing fields, preserved ──
    { name: 'name', type: 'text' },
    {
      name: 'role',
      type: 'select',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
      ],
      defaultValue: 'editor',
      admin: { description: 'Editorial role. Only meaningful when userType is "editorial".' },
    },

    // ── User type discriminator ──
    {
      name: 'userType',
      type: 'select',
      required: true,
      defaultValue: 'editorial',
      options: [
        { label: 'Editorial Staff', value: 'editorial' },
        { label: 'Anonymous Learner', value: 'anonymous' },
        { label: 'Registered Learner', value: 'registered' },
      ],
    },

    // ── Anonymous + registered learner identity ──
    {
      name: 'deviceId',
      type: 'text',
      unique: true,
      index: true,
      admin: { description: 'Cookie UUID. Set for anonymous + registered users. Null for editorial.' },
    },
    {
      name: 'displayName',
      type: 'text',
      admin: { description: 'Public-facing name on certificates. Collected at exam time.' },
    },
    { name: 'firstSeenAt', type: 'date' },
    { name: 'lastSeenAt', type: 'date' },

    // ── Learning state (denormalized for fast read) ──
    { name: 'currentStreak', type: 'number', defaultValue: 0 },
    { name: 'longestStreak', type: 'number', defaultValue: 0 },
    { name: 'lastSessionAt', type: 'date' },
    {
      name: 'topicIQ',
      type: 'json',
      admin: {
        description:
          'Shape: { "france": 78, "france-bordeaux": 84, "foundations": 71 }. Recomputed on session complete.',
      },
    },
    {
      name: 'startingLevel',
      type: 'select',
      admin: { description: 'For future onboarding. Not used in v1.' },
      options: [
        { label: 'Beginner', value: 'beginner' },
        { label: 'Some Experience', value: 'some' },
        { label: 'Advanced', value: 'advanced' },
      ],
    },
  ],
}
