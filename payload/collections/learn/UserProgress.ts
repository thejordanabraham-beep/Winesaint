import type { CollectionConfig } from 'payload'

/**
 * UserProgress — one row per exercise attempt.
 *
 * Every attempt logged (not just final outcome) so we can track learning
 * curve + SRS scheduling. SRS state lives on the most-recent attempt for
 * a given (user, exercise) pair.
 *
 * SRS v1: simple doubling intervals (1→2→4→8 days on correct, reset to 1
 * on wrong). Forward-compatible with full SuperMemo-2 in v2.
 */
export const UserProgress: CollectionConfig = {
  slug: 'user-progress',
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['user', 'exercise', 'correct', 'attemptedAt'],
  },
  access: {
    // Server-only collection — writes happen via API routes validating the
    // device cookie. Read open for v1 simplicity.
    read: () => true,
    create: () => true,
    update: () => true,
    delete: ({ req: { user } }) => !!user,
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      index: true,
    },
    {
      name: 'exercise',
      type: 'relationship',
      relationTo: 'exercises',
      required: true,
      index: true,
    },
    { name: 'attemptedAt', type: 'date', required: true },
    { name: 'correct', type: 'checkbox', required: true },
    { name: 'responseTimeMs', type: 'number' },
    {
      name: 'userAnswer',
      type: 'json',
      admin: { description: 'What the user submitted (for review/debugging)' },
    },
    {
      name: 'attemptCount',
      type: 'number',
      defaultValue: 1,
      admin: { description: 'Nth attempt at this specific exercise' },
    },
    {
      name: 'srsInterval',
      type: 'number',
      admin: {
        description: 'Days until next review. Doubles on correct, resets to 1 on wrong.',
      },
    },
    {
      name: 'srsDueAt',
      type: 'date',
      index: true,
      admin: { description: 'When this exercise re-enters the review queue' },
    },
  ],
}
