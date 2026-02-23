/**
 * ENHANCED GUIDE RENDERER
 *
 * Beautiful, professional rendering of wine region guides with:
 * - Auto-generated table of contents
 * - Smooth scroll navigation
 * - Reading progress indicator
 * - Enhanced typography
 * - Quick facts sidebar
 */

'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';

interface Section {
  id: string;
  title: string;
  level: number;
}

interface EnhancedGuideRendererProps {
  content: string;
  title: string;
  level: 'country' | 'region' | 'sub-region';
  quickFacts?: {
    climate?: string;
    primaryGrapes?: string[];
    wineStyles?: string[];
    notableProducers?: string[];
  };
}

export default function EnhancedGuideRenderer({
  content,
  title,
  level,
  quickFacts
}: EnhancedGuideRendererProps) {
  const [sections, setSections] = useState<Section[]>([]);
  const [activeSection, setActiveSection] = useState<string>('');
  const [readingProgress, setReadingProgress] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  // Extract sections from HTML content
  useEffect(() => {
    if (!content) return;

    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    const headings = doc.querySelectorAll('h2, h3');

    const extractedSections: Section[] = [];
    headings.forEach((heading, index) => {
      const level = parseInt(heading.tagName.substring(1));
      const title = heading.textContent || '';
      const id = `section-${index}`;

      // Add ID to heading for scroll targeting
      heading.id = id;

      extractedSections.push({ id, title, level });
    });

    setSections(extractedSections);

    // Update content with IDs
    if (contentRef.current) {
      contentRef.current.innerHTML = doc.body.innerHTML;
    }
  }, [content]);

  // Track reading progress
  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return;

      const element = contentRef.current;
      const windowHeight = window.innerHeight;
      const documentHeight = element.scrollHeight;
      const scrollTop = window.scrollY;

      const progress = (scrollTop / (documentHeight - windowHeight)) * 100;
      setReadingProgress(Math.min(100, Math.max(0, progress)));

      // Determine active section
      const sectionElements = sections.map(s => document.getElementById(s.id));
      const currentSection = sectionElements.find(el => {
        if (!el) return false;
        const rect = el.getBoundingClientRect();
        return rect.top >= 0 && rect.top <= windowHeight / 3;
      });

      if (currentSection) {
        setActiveSection(currentSection.id);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // Header height
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="relative">
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
        <div
          className="h-full bg-wine-600 transition-all duration-150"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Table of Contents - Sticky Sidebar */}
          {sections.length > 0 && (
            <aside className="hidden lg:block lg:col-span-3">
              <div className="sticky top-24 space-y-4">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">
                    Table of Contents
                  </h3>
                  <nav className="space-y-1">
                    {sections.map((section) => (
                      <button
                        key={section.id}
                        onClick={() => scrollToSection(section.id)}
                        className={`
                          block w-full text-left text-sm py-1.5 px-2 rounded transition-colors
                          ${section.level === 3 ? 'pl-4 text-xs' : ''}
                          ${activeSection === section.id
                            ? 'bg-wine-50 text-wine-700 font-medium'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                          }
                        `}
                      >
                        {section.title}
                      </button>
                    ))}
                  </nav>
                </div>

                {/* Quick Facts Card */}
                {quickFacts && (
                  <div className="bg-gradient-to-br from-wine-50 to-amber-50 rounded-lg shadow-sm border border-wine-200 p-4">
                    <h3 className="text-sm font-semibold text-wine-900 uppercase tracking-wide mb-3">
                      Quick Facts
                    </h3>
                    <dl className="space-y-3 text-sm">
                      {quickFacts.climate && (
                        <div>
                          <dt className="font-medium text-wine-700">Climate</dt>
                          <dd className="text-gray-700 mt-0.5">{quickFacts.climate}</dd>
                        </div>
                      )}
                      {quickFacts.primaryGrapes && quickFacts.primaryGrapes.length > 0 && (
                        <div>
                          <dt className="font-medium text-wine-700">Primary Grapes</dt>
                          <dd className="text-gray-700 mt-0.5 flex flex-wrap gap-1">
                            {quickFacts.primaryGrapes.map(grape => (
                              <span key={grape} className="inline-block bg-white px-2 py-0.5 rounded text-xs">
                                {grape}
                              </span>
                            ))}
                          </dd>
                        </div>
                      )}
                      {quickFacts.wineStyles && quickFacts.wineStyles.length > 0 && (
                        <div>
                          <dt className="font-medium text-wine-700">Wine Styles</dt>
                          <dd className="text-gray-700 mt-0.5">
                            {quickFacts.wineStyles.join(', ')}
                          </dd>
                        </div>
                      )}
                    </dl>
                  </div>
                )}
              </div>
            </aside>
          )}

          {/* Main Content */}
          <main className={sections.length > 0 ? "lg:col-span-9" : "lg:col-span-12"}>
            <article className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 lg:p-12">
              {/* Guide Header */}
              <header className="mb-8 pb-6 border-b border-gray-200">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                  <span className="px-2 py-1 bg-wine-100 text-wine-700 rounded-md font-medium capitalize">
                    {level.replace('-', ' ')}
                  </span>
                  <span>•</span>
                  <span>Comprehensive Guide</span>
                </div>
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-3">
                  {title}
                </h1>
                <p className="text-lg text-gray-600">
                  An in-depth exploration of {title}'s terroir, wines, and winemaking tradition
                </p>
              </header>

              {/* Enhanced Content with Beautiful Typography */}
              <div
                ref={contentRef}
                className="prose prose-lg max-w-none
                  prose-headings:font-bold prose-headings:text-gray-900
                  prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-4 prose-h2:pb-2 prose-h2:border-b prose-h2:border-gray-200
                  prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-3
                  prose-p:text-gray-700 prose-p:leading-relaxed
                  prose-a:text-wine-600 prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-gray-900 prose-strong:font-semibold
                  prose-ul:my-4 prose-li:my-1
                  prose-blockquote:border-l-4 prose-blockquote:border-wine-500 prose-blockquote:bg-wine-50 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:italic
                "
                dangerouslySetInnerHTML={{ __html: content }}
              />

              {/* Share/Save Actions */}
              <footer className="mt-12 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">
                    Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </p>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                      Save Guide
                    </button>
                    <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                      Share
                    </button>
                  </div>
                </div>
              </footer>
            </article>
          </main>
        </div>
      </div>
    </div>
  );
}
