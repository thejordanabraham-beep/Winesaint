export const climat = {
  name: 'climat',
  title: 'Climat/Cru',
  type: 'document',
  description: 'Single-vineyard designations: Burgundy climats, Barolo MGAs, German einzellagen, etc.',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
      description: 'Official climat/cru name (e.g., "Les Amoureuses", "Cannubi", "Ürziger Würzgarten")',
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'appellation',
      title: 'Appellation/Village',
      type: 'reference',
      to: [{ type: 'appellation' }],
      validation: (Rule: any) => Rule.required(),
      description: 'The village/appellation this climat belongs to (e.g., Chambolle-Musigny, Barolo)',
    },
    {
      name: 'classification',
      title: 'Classification Level',
      type: 'string',
      options: {
        list: [
          { title: 'Grand Cru', value: 'grand_cru' },
          { title: 'Premier Cru', value: 'premier_cru' },
          { title: 'Village', value: 'village' },
          { title: 'Régionale', value: 'regionale' },
          { title: 'MGA (Menzioni Geografiche Aggiuntive)', value: 'mga' },
          { title: 'Einzellage', value: 'einzellage' },
          { title: 'Grosses Gewächs (GG)', value: 'grosses_gewachs' },
          { title: 'Erste Lage', value: 'erste_lage' },
          { title: 'Single Vineyard', value: 'single_vineyard' },
        ],
      },
      validation: (Rule: any) => Rule.required(),
      description: 'Official classification tier',
    },
    {
      name: 'region',
      title: 'Wine Region',
      type: 'reference',
      to: [{ type: 'region' }],
      description: 'Top-level region (e.g., Burgundy, Piedmont, Mosel)',
    },
    {
      name: 'boundaries',
      title: 'Boundary Coordinates (GeoJSON)',
      type: 'object',
      fields: [
        {
          name: 'type',
          title: 'Type',
          type: 'string',
          initialValue: 'Feature',
        },
        {
          name: 'geometry',
          title: 'Geometry',
          type: 'object',
          fields: [
            {
              name: 'type',
              title: 'Geometry Type',
              type: 'string',
              initialValue: 'Polygon',
            },
            {
              name: 'coordinates',
              title: 'Coordinates',
              type: 'array',
              of: [
                {
                  type: 'array',
                  of: [
                    {
                      type: 'array',
                      of: [{ type: 'number' }],
                    },
                  ],
                },
              ],
              description: 'GeoJSON polygon coordinates [lng, lat]',
            },
          ],
        },
        {
          name: 'properties',
          title: 'Properties',
          type: 'object',
          fields: [
            { name: 'fillColor', title: 'Fill Color', type: 'string' },
            { name: 'strokeColor', title: 'Stroke Color', type: 'string' },
          ],
        },
      ],
      description: 'Official climat boundaries (if available)',
    },
    {
      name: 'acreage',
      title: 'Total Acreage/Hectares',
      type: 'number',
      description: 'Total size of the climat',
    },
    {
      name: 'elevationRange',
      title: 'Elevation Range',
      type: 'object',
      fields: [
        { name: 'min', title: 'Min (meters)', type: 'number' },
        { name: 'max', title: 'Max (meters)', type: 'number' },
      ],
    },
    {
      name: 'soilTypes',
      title: 'Soil Composition',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Limestone (Calcaire)', value: 'limestone' },
          { title: 'Clay (Argile)', value: 'clay' },
          { title: 'Marl (Marne)', value: 'marl' },
          { title: 'Gravel', value: 'gravel' },
          { title: 'Sand', value: 'sand' },
          { title: 'Slate (Schiefer)', value: 'slate' },
          { title: 'Volcanic', value: 'volcanic' },
          { title: 'Granite', value: 'granite' },
          { title: 'Chalk', value: 'chalk' },
        ],
      },
    },
    {
      name: 'aspect',
      title: 'Aspect/Exposure',
      type: 'string',
      options: {
        list: [
          { title: 'North', value: 'north' },
          { title: 'Northeast', value: 'northeast' },
          { title: 'East', value: 'east' },
          { title: 'Southeast', value: 'southeast' },
          { title: 'South', value: 'south' },
          { title: 'Southwest', value: 'southwest' },
          { title: 'West', value: 'west' },
          { title: 'Northwest', value: 'northwest' },
        ],
      },
      description: 'Primary slope orientation',
    },
    {
      name: 'slope',
      title: 'Slope Percentage',
      type: 'number',
      description: 'Average slope gradient (%)',
    },
    {
      name: 'producers',
      title: 'Producers/Owners',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'producer' }] }],
      description: 'Producers who own parcels in this climat',
    },
    {
      name: 'primaryGrapes',
      title: 'Authorized Grape Varieties',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Grapes allowed/grown in this climat',
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 6,
      description: 'Historical context, terroir characteristics, typical wine style',
    },
    {
      name: 'historicalNotes',
      title: 'Historical Notes',
      type: 'text',
      rows: 3,
      description: 'Historical significance, origin of name, notable facts',
    },
    {
      name: 'officialDesignationYear',
      title: 'Year of Official Designation',
      type: 'number',
      description: 'When this climat received its official classification',
    },
    {
      name: 'image',
      title: 'Featured Image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        { name: 'alt', title: 'Alt Text', type: 'string' },
      ],
    },
    {
      name: 'sources',
      title: 'Data Sources',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'References: INAO, VDP, official registries, etc.',
    },
  ],
  preview: {
    select: {
      title: 'name',
      classification: 'classification',
      appellation: 'appellation.name',
      media: 'image',
    },
    prepare({ title, classification, appellation, media }: any) {
      const classificationLabels: Record<string, string> = {
        grand_cru: 'Grand Cru',
        premier_cru: 'Premier Cru',
        village: 'Village',
        mga: 'MGA',
        einzellage: 'Einzellage',
        grosses_gewachs: 'GG',
      };
      return {
        title,
        subtitle: `${classificationLabels[classification] || classification} • ${appellation}`,
        media,
      };
    },
  },
};
