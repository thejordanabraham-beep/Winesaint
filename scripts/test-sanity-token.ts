// Test if Sanity token has write permissions
import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'hj3ee4sp',
  dataset: 'production',
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
});

async function test() {
  try {
    console.log('Testing Sanity write permissions...\n');

    // Try to create a simple region document
    const testDoc = {
      _type: 'region',
      name: 'Test Region',
      slug: { current: 'test-region' },
      fullSlug: 'test-region',
      level: 'region',
      country: 'Test',
    };

    console.log('Creating test document...');
    const result = await client.create(testDoc);
    console.log('✅ Success! Document created:', result._id);

    // Clean up
    console.log('Deleting test document...');
    await client.delete(result._id);
    console.log('✅ Test document deleted\n');

    console.log('Token works! Ready to migrate.');
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    console.error('\nFull error:', error);
  }
}

test();
