import type { CollectionConfig } from 'payload'

/**
 * Exams — one row per certifiable exam.
 *
 * v1 ships two:
 *   - Foundations (L1 Final)
 *   - France Mastery
 *
 * Each draws N questions from a pool of `examOnly: true` exercises
 * (typically parsed from the corresponding exam markdown file).
 */
export const Exams: CollectionConfig = {
  slug: 'exams',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'track', 'passThreshold', 'questionCount', 'isPublished'],
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  fields: [
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'title', type: 'text', required: true },
    {
      name: 'track',
      type: 'select',
      required: true,
      options: [
        { label: 'Foundations (L1 Final)', value: 'foundations' },
        { label: 'France Mastery', value: 'france-mastery' },
        // Future tracks added here as Mastery imports land
      ],
    },
    {
      name: 'passThreshold',
      type: 'number',
      required: true,
      defaultValue: 70,
      admin: { description: 'Percent correct required to pass' },
    },
    {
      name: 'questionCount',
      type: 'number',
      required: true,
      defaultValue: 50,
      admin: { description: 'Number of Qs pulled per attempt' },
    },
    {
      name: 'timeLimitMinutes',
      type: 'number',
      admin: { description: 'Optional time limit. Null = untimed.' },
    },
    {
      name: 'questionPool',
      type: 'relationship',
      relationTo: 'exercises',
      hasMany: true,
      required: true,
    },
    { name: 'description', type: 'textarea' },
    { name: 'isPublished', type: 'checkbox', defaultValue: false },
  ],
}
