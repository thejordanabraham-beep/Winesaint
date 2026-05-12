import type { CollectionConfig } from 'payload'

/**
 * Lessons — one row per markdown file in wine-saint-certified/.
 *
 * The importer parses each markdown file's metadata + prose sections into
 * a `lessons` record, and the embedded Quiz Q's into linked `exercises`.
 *
 * `level` + `track` together identify location:
 *   - L1 modules:        level='foundations', track=null
 *   - L2 modules:        level='intermediate', track=null  (not in v1)
 *   - L3 modules:        level='advanced', track=null      (not in v1)
 *   - France Mastery:    level='mastery', track='france'
 *   - Italy Mastery:     level='mastery', track='italy'    (not in v1)
 *   - WPM:               level='mastery', track='wine-program-management' (not in v1)
 */
export const Lessons: CollectionConfig = {
  slug: 'lessons',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'level', 'track', 'order', 'isPublished'],
  },
  // versions: { drafts: true } — disabled for v1; causes payload.delete to
  // throw on partially-imported rows. Re-enable once content is stable.
  access: {
    read: () => true, // public reading is open in v1
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  fields: [
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    { name: 'title', type: 'text', required: true },
    {
      name: 'level',
      type: 'select',
      required: true,
      options: [
        { label: 'Foundations (L1)', value: 'foundations' },
        { label: 'Intermediate (L2)', value: 'intermediate' },
        { label: 'Advanced (L3)', value: 'advanced' },
        { label: 'Mastery', value: 'mastery' },
      ],
    },
    {
      name: 'track',
      type: 'select',
      admin: {
        description: 'Required for Mastery level. Leave blank for L1/L2/L3.',
      },
      options: [
        { label: 'France', value: 'france' },
        { label: 'Italy', value: 'italy' },
        { label: 'California', value: 'california' },
        { label: 'Germany', value: 'germany' },
        { label: 'Spain', value: 'spain' },
        { label: 'Portugal', value: 'portugal' },
        { label: 'Australia', value: 'australia' },
        { label: 'Austria', value: 'austria' },
        { label: 'Argentina', value: 'argentina' },
        { label: 'Chile', value: 'chile' },
        { label: 'Greece', value: 'greece' },
        { label: 'New Zealand', value: 'new-zealand' },
        { label: 'Pacific Northwest', value: 'pacific-northwest' },
        { label: 'South Africa', value: 'south-africa' },
        { label: 'Wine Program Management', value: 'wine-program-management' },
      ],
    },
    {
      name: 'order',
      type: 'number',
      required: true,
      admin: { description: 'Display order within level/track' },
    },
    {
      name: 'intro',
      type: 'richText',
      admin: { description: 'The lesson prose — Section 1, Section 2, etc., consolidated' },
    },
    {
      name: 'audience',
      type: 'text',
      admin: { description: 'e.g., "Servers, Bartenders, Front-of-House Staff"' },
    },
    { name: 'durationMinutes', type: 'number' },
    {
      name: 'learningObjectives',
      type: 'array',
      admin: { description: 'From "Learning Objectives" section of the markdown' },
      fields: [{ name: 'objective', type: 'text', required: true }],
    },
    {
      name: 'keyTerms',
      type: 'array',
      admin: { description: 'Glossary terms from the lesson' },
      fields: [
        { name: 'term', type: 'text', required: true },
        { name: 'definition', type: 'text', required: true },
      ],
    },
    {
      name: 'topicTags',
      type: 'array',
      admin: {
        description:
          'Hierarchical kebab-case, geography-first. e.g., ["france", "france-bordeaux", "france-bordeaux-left-bank"]',
      },
      fields: [{ name: 'tag', type: 'text', required: true }],
    },
    { name: 'isPublished', type: 'checkbox', defaultValue: false },
    {
      name: 'sourceFile',
      type: 'text',
      admin: { description: 'Path to original markdown for traceability' },
    },
    { name: 'reviewedBy', type: 'relationship', relationTo: 'users' },
    { name: 'reviewedAt', type: 'date' },
  ],
}
