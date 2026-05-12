import type { CollectionConfig } from 'payload'

/**
 * Certificates — one row per issued certificate.
 *
 * PDF lives in Vercel Blob; `pdfUrl` is the public link.
 *
 * `certificateNumber` is a human-friendly sequential identifier per track:
 *   - WSC-F-{counter}   for Foundations (e.g., WSC-F-001247)
 *   - WSC-FR-{counter}  for France Mastery (e.g., WSC-FR-000142)
 *
 * Counter is per-track, assigned in afterChange hook on exam-attempts
 * when passed=true.
 */
export const Certificates: CollectionConfig = {
  slug: 'certificates',
  admin: {
    useAsTitle: 'certificateNumber',
    defaultColumns: ['certificateNumber', 'track', 'displayName', 'issuedAt'],
  },
  access: {
    read: () => true, // public — cert PDF link works without auth
    create: () => true,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  fields: [
    {
      name: 'certificateNumber',
      type: 'text',
      required: true,
      unique: true,
      index: true,
    },
    { name: 'user', type: 'relationship', relationTo: 'users', required: true },
    {
      name: 'examAttempt',
      type: 'relationship',
      relationTo: 'exam-attempts',
      required: true,
    },
    {
      name: 'track',
      type: 'select',
      required: true,
      options: [
        { label: 'Foundations', value: 'foundations' },
        { label: 'France Mastery', value: 'france-mastery' },
      ],
    },
    { name: 'displayName', type: 'text', required: true },
    { name: 'issuedAt', type: 'date', required: true },
    {
      name: 'score',
      type: 'number',
      admin: { description: 'Final exam score, % correct' },
    },
    {
      name: 'pdfUrl',
      type: 'text',
      admin: { description: 'Public Vercel Blob URL for the PDF' },
    },
  ],
}
