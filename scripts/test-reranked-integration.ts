/**
 * Test the integrated reranked RAG system
 */

import dotenv from 'dotenv';
import path from 'path';
import { getReferenceNotes } from './lib/reference-sources';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function testRerankedSystem() {
  console.log('🧪 Testing Integrated Reranked RAG System');
  console.log('='.repeat(50));

  // Test 1: K&L notes (should find)
  console.log('\nTest 1: Jolie Laide Trousseau 2018 (K&L notes)');
  const test1 = await getReferenceNotes('Trousseau', 'Jolie Laide', 2018, 'California');
  console.log(`Source: ${test1.source}`);
  console.log(`Notes: ${test1.notes?.substring(0, 150)}...`);

  // Test 2: Producer not in K&L (should use RAG with reranking)
  console.log('\n\nTest 2: Random Producer (RAG with reranking)');
  const test2 = await getReferenceNotes('Pinot Noir', 'Domaine de la Romanée-Conti', 2015, 'Burgundy');
  console.log(`Source: ${test2.source}`);
  console.log(`Notes: ${test2.notes?.substring(0, 200)}...`);

  // Test 3: Another RAG test
  console.log('\n\nTest 3: Champagne Producer (RAG with reranking)');
  const test3 = await getReferenceNotes('Champagne', 'Krug', 2008, 'Champagne');
  console.log(`Source: ${test3.source}`);
  console.log(`Notes: ${test3.notes?.substring(0, 200)}...`);

  console.log('\n' + '='.repeat(50));
  console.log('✅ Integration test complete!');
  console.log('\nReranking is now active in production pipeline!');
}

testRerankedSystem().catch(console.error);
