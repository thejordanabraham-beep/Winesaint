/**
 * LEARNING PATH CARD
 *
 * Guided educational journeys through wine knowledge
 * From beginner to expert, structured learning paths
 */

'use client';

import Link from 'next/link';

interface LearningModule {
  title: string;
  description: string;
  duration: string;
  slug: string;
  completed?: boolean;
}

interface LearningPathCardProps {
  title: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  modules: LearningModule[];
  totalDuration: string;
  icon: string;
}

export default function LearningPathCard({
  title,
  description,
  level,
  modules,
  totalDuration,
  icon
}: LearningPathCardProps) {
  const completedModules = modules.filter(m => m.completed).length;
  const progress = (completedModules / modules.length) * 100;

  const levelColors = {
    beginner: 'bg-green-100 text-green-700',
    intermediate: 'bg-blue-100 text-blue-700',
    advanced: 'bg-purple-100 text-purple-700',
    expert: 'bg-wine-100 text-wine-700'
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="bg-gradient-to-br from-wine-600 to-wine-700 text-white p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="text-4xl">{icon}</div>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${levelColors[level]}`}>
            {level.charAt(0).toUpperCase() + level.slice(1)}
          </span>
        </div>
        <h3 className="text-2xl font-bold mb-2">{title}</h3>
        <p className="text-wine-100 text-sm">{description}</p>
      </div>

      {/* Body */}
      <div className="p-6">
        {/* Progress */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="font-medium text-gray-700">Progress</span>
            <span className="text-gray-600">{completedModules}/{modules.length} modules</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-wine-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Modules List */}
        <div className="space-y-2 mb-4">
          {modules.slice(0, 3).map((module, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className={`
                w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                ${module.completed ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'}
              `}>
                {module.completed ? '✓' : index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {module.title}
                </p>
                <p className="text-xs text-gray-500">{module.duration}</p>
              </div>
            </div>
          ))}
          {modules.length > 3 && (
            <p className="text-xs text-gray-500 text-center py-2">
              +{modules.length - 3} more modules
            </p>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
          <div>
            <span className="font-medium">{modules.length}</span> modules
          </div>
          <div>
            <span className="font-medium">{totalDuration}</span> total
          </div>
        </div>

        {/* CTA */}
        <Link
          href={`/learn/${title.toLowerCase().replace(/\s+/g, '-')}`}
          className="block w-full text-center px-4 py-3 bg-wine-600 text-white font-semibold rounded-lg hover:bg-wine-700 transition-colors"
        >
          {progress > 0 ? 'Continue Learning' : 'Start Path'}
        </Link>
      </div>
    </div>
  );
}
