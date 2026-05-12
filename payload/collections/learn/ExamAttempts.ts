import type { CollectionConfig } from 'payload'

/**
 * ExamAttempts — one row per exam sitting.
 *
 * Records what was asked, what the user answered, and the final score.
 * On pass: certificate auto-generated via afterChange hook (implemented
 * in Week 5).
 */
export const ExamAttempts: CollectionConfig = {
  slug: 'exam-attempts',
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['user', 'exam', 'score', 'passed', 'submittedAt'],
  },
  access: {
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
    { name: 'exam', type: 'relationship', relationTo: 'exams', required: true },
    {
      name: 'displayName',
      type: 'text',
      required: true,
      admin: { description: 'Collected at exam start for certificate' },
    },
    { name: 'startedAt', type: 'date', required: true },
    { name: 'submittedAt', type: 'date' },
    {
      name: 'answers',
      type: 'json',
      required: true,
      admin: {
        description:
          'Array of { exerciseId, userAnswer, correct }. Stored as JSON to avoid joins on every grade lookup.',
      },
    },
    {
      name: 'score',
      type: 'number',
      admin: { description: 'Percent correct, populated on submit' },
    },
    { name: 'passed', type: 'checkbox' },
    {
      name: 'certificate',
      type: 'relationship',
      relationTo: 'certificates',
      admin: { description: 'Set when cert is generated' },
    },
  ],
}
