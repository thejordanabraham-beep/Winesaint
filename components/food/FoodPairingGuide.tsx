/**
 * FOOD PAIRING GUIDE
 *
 * Interactive food and wine pairing suggestions
 * Educational and practical
 */

'use client';

import { useState } from 'react';

interface PairingCategory {
  name: string;
  icon: string;
  pairings: Array<{
    food: string;
    wine: string;
    why: string;
  }>;
}

export default function FoodPairingGuide() {
  const [selectedCategory, setSelectedCategory] = useState('meat');

  const categories: Record<string, PairingCategory> = {
    meat: {
      name: 'Meat & Poultry',
      icon: '🥩',
      pairings: [
        {
          food: 'Beef Steak',
          wine: 'Cabernet Sauvignon',
          why: 'High tannins cut through fat, bold flavors match richness'
        },
        {
          food: 'Duck',
          wine: 'Pinot Noir',
          why: 'Earthy notes complement gamey flavor, acidity balances richness'
        },
        {
          food: 'Roast Chicken',
          wine: 'Chardonnay',
          why: 'Medium body matches protein, butter notes enhance roasted flavors'
        },
      ]
    },
    seafood: {
      name: 'Seafood',
      icon: '🦞',
      pairings: [
        {
          food: 'Oysters',
          wine: 'Chablis',
          why: 'High acidity & mineral notes match brininess'
        },
        {
          food: 'Grilled Salmon',
          wine: 'Pinot Noir',
          why: 'Light tannins & red fruit complement fatty fish'
        },
        {
          food: 'Lobster',
          wine: 'White Burgundy',
          why: 'Rich, buttery wine matches sweet, delicate meat'
        },
      ]
    },
    cheese: {
      name: 'Cheese',
      icon: '🧀',
      pairings: [
        {
          food: 'Aged Cheddar',
          wine: 'Cabernet Sauvignon',
          why: 'Bold wine stands up to sharp, intense flavors'
        },
        {
          food: 'Brie',
          wine: 'Champagne',
          why: 'Acidity cuts through creamy texture, bubbles cleanse palate'
        },
        {
          food: 'Blue Cheese',
          wine: 'Sauternes',
          why: 'Sweetness balances salty, pungent flavors'
        },
      ]
    },
    pasta: {
      name: 'Pasta & Grains',
      icon: '🍝',
      pairings: [
        {
          food: 'Pasta Carbonara',
          wine: 'Vermentino',
          why: 'Bright acidity cuts through creamy, eggy richness'
        },
        {
          food: 'Bolognese',
          wine: 'Chianti',
          why: 'High acidity balances tomato, tannins match meat'
        },
        {
          food: 'Mushroom Risotto',
          wine: 'Pinot Noir',
          why: 'Earthy notes mirror mushrooms, acidity cuts cream'
        },
      ]
    },
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-wine-600 to-wine-700 text-white p-6">
        <h2 className="text-2xl font-bold mb-2">Food & Wine Pairing Guide</h2>
        <p className="text-wine-100">Learn the science and art of perfect pairings</p>
      </div>

      {/* Category Tabs */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex flex-wrap gap-2">
          {Object.entries(categories).map(([key, category]) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(key)}
              className={`
                px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2
                ${selectedCategory === key
                  ? 'bg-wine-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
            >
              <span className="text-xl">{category.icon}</span>
              <span>{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Pairings */}
      <div className="p-6">
        <div className="space-y-4">
          {categories[selectedCategory].pairings.map((pairing, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-gray-50 to-white rounded-lg p-5 border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="text-lg font-bold text-gray-900">{pairing.food}</h4>
                  <p className="text-wine-600 font-semibold">{pairing.wine}</p>
                </div>
                <span className="text-3xl">🍷</span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                <span className="font-medium text-gray-700">Why it works:</span> {pairing.why}
              </p>
            </div>
          ))}
        </div>

        {/* Pairing Principles */}
        <div className="mt-8 bg-wine-50 rounded-lg p-4 border border-wine-200">
          <h4 className="font-semibold text-wine-900 mb-3">Key Pairing Principles</h4>
          <ul className="space-y-2 text-sm text-wine-800">
            <li className="flex gap-2">
              <span>•</span>
              <span><strong>Match weight:</strong> Light foods with light wines, heavy with heavy</span>
            </li>
            <li className="flex gap-2">
              <span>•</span>
              <span><strong>Acidity balances richness:</strong> High-acid wines cut through fatty foods</span>
            </li>
            <li className="flex gap-2">
              <span>•</span>
              <span><strong>Tannins need protein:</strong> Tannic reds pair best with meat</span>
            </li>
            <li className="flex gap-2">
              <span>•</span>
              <span><strong>Sweet with salty/spicy:</strong> Off-dry wines balance heat and salt</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
