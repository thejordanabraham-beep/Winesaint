'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface WinemakingData {
  title: string;
  subtitle: string;
  sections: {
    overview: {
      title: string;
      description: string;
      philosophy: {
        interventionist: { title: string; description: string; key_principles: string[] };
        non_interventionist: { title: string; description: string; key_principles: string[] };
        balance: string;
      };
      key_terminology: Array<{ term: string; definition: string }>;
    };
    reception: { title: string; description: string; stages: Array<Record<string, unknown>> };
    fermentation: { title: string; description: string; techniques: Array<Record<string, unknown>> };
    pressing: { title: string; description: string; techniques: Array<Record<string, unknown>> };
    mlf: { title: string; description: string; techniques: Array<Record<string, unknown>> };
    aging: { title: string; description: string; techniques: Array<Record<string, unknown>> };
    blending: { title: string; description: string; techniques: Array<Record<string, unknown>> };
    clarification: { title: string; description: string; techniques: Array<Record<string, unknown>> };
    bottling: { title: string; description: string; techniques: Array<Record<string, unknown>> };
    sparkling: { title: string; description: string; methods: Array<Record<string, unknown>> };
    sweet: { title: string; description: string; methods: Array<Record<string, unknown>> };
    fortified: { title: string; description: string; styles: Array<Record<string, unknown>> };
    orange: { title: string; description: string; techniques: Array<Record<string, unknown>> };
    natural: { title: string; description: string; principles: Array<Record<string, unknown>> };
  };
}

const SECTIONS = [
  { id: 'overview', label: 'Overview', icon: '🍷' },
  { id: 'reception', label: 'Reception', icon: '🚛' },
  { id: 'fermentation', label: 'Fermentation', icon: '🫧' },
  { id: 'pressing', label: 'Pressing', icon: '🔄' },
  { id: 'mlf', label: 'MLF', icon: '🧫' },
  { id: 'aging', label: 'Aging', icon: '🛢️' },
  { id: 'blending', label: 'Blending', icon: '⚗️' },
  { id: 'clarification', label: 'Clarification', icon: '✨' },
  { id: 'bottling', label: 'Bottling', icon: '🍾' },
  { id: 'sparkling', label: 'Sparkling', icon: '🥂' },
  { id: 'sweet', label: 'Sweet Wines', icon: '🍯' },
  { id: 'fortified', label: 'Fortified', icon: '🥃' },
  { id: 'orange', label: 'Orange Wine', icon: '🟠' },
  { id: 'natural', label: 'Natural Wine', icon: '🌿' },
];

export default function WinemakingGuidePage() {
  const [data, setData] = useState<WinemakingData | null>(null);
  const [activeSection, setActiveSection] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/resource-guides/winemaking')
      .then((res) => res.json())
      .then((json) => {
        setData(json.content);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load winemaking data:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="bg-[#FAF7F2] min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading winemaking guide...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-[#FAF7F2] min-h-screen flex items-center justify-center">
        <p className="text-red-500">Failed to load guide</p>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF7F2] min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm">
          <Link href="/" className="text-gray-500 hover:text-[#722F37]">Home</Link>
          <span className="mx-2 text-gray-400">/</span>
          <Link href="/resources" className="text-gray-500 hover:text-[#722F37]">Resources</Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-[#1C1C1C]">Winemaking</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-4xl italic text-[#1C1C1C]">{data.title}</h1>
          <p className="mt-2 text-lg text-gray-600">{data.subtitle}</p>
        </div>

        {/* Section Tabs */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex gap-2 min-w-max pb-2">
            {SECTIONS.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                  activeSection === section.id
                    ? 'bg-[#722F37] text-white'
                    : 'bg-white border border-[#1C1C1C]/20 text-[#1C1C1C] hover:border-[#722F37]'
                }`}
              >
                <span className="mr-1">{section.icon}</span>
                {section.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg border-3 border-[#1C1C1C] p-6">
          {activeSection === 'overview' && <OverviewSection data={data.sections.overview} />}
          {activeSection === 'reception' && <StagesSection data={data.sections.reception} slugPrefix="reception" />}
          {activeSection === 'fermentation' && <TechniquesSection data={data.sections.fermentation} slugPrefix="fermentation" />}
          {activeSection === 'pressing' && <TechniquesSection data={data.sections.pressing} slugPrefix="pressing" />}
          {activeSection === 'mlf' && <TechniquesSection data={data.sections.mlf} slugPrefix="mlf" />}
          {activeSection === 'aging' && <TechniquesSection data={data.sections.aging} slugPrefix="aging" />}
          {activeSection === 'blending' && <TechniquesSection data={data.sections.blending} slugPrefix="blending" />}
          {activeSection === 'clarification' && <TechniquesSection data={data.sections.clarification} slugPrefix="clarification" />}
          {activeSection === 'bottling' && <TechniquesSection data={data.sections.bottling} slugPrefix="bottling" />}
          {activeSection === 'sparkling' && <MethodsSection data={data.sections.sparkling} slugPrefix="sparkling" />}
          {activeSection === 'sweet' && <MethodsSection data={data.sections.sweet} slugPrefix="sweet" />}
          {activeSection === 'fortified' && <FortifiedSection data={data.sections.fortified} />}
          {activeSection === 'orange' && <TechniquesSection data={data.sections.orange} slugPrefix="orange" />}
          {activeSection === 'natural' && <PrinciplesSection data={data.sections.natural} />}
        </div>
      </div>
    </div>
  );
}

function OverviewSection({ data }: { data: WinemakingData['sections']['overview'] }) {
  return (
    <div>
      <h2 className="font-serif text-2xl italic text-[#722F37] mb-4">{data.title}</h2>
      <p className="text-gray-700 leading-relaxed mb-6">{data.description}</p>

      {/* Philosophy */}
      <h3 className="font-serif text-xl italic text-[#722F37] mb-4">Winemaking Philosophy</h3>
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-800 mb-2">{data.philosophy.interventionist.title}</h4>
          <p className="text-sm text-gray-700 mb-3">{data.philosophy.interventionist.description}</p>
          <div className="flex flex-wrap gap-1">
            {data.philosophy.interventionist.key_principles.map((p, i) => (
              <span key={i} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">{p}</span>
            ))}
          </div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-medium text-green-800 mb-2">{data.philosophy.non_interventionist.title}</h4>
          <p className="text-sm text-gray-700 mb-3">{data.philosophy.non_interventionist.description}</p>
          <div className="flex flex-wrap gap-1">
            {data.philosophy.non_interventionist.key_principles.map((p, i) => (
              <span key={i} className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">{p}</span>
            ))}
          </div>
        </div>
      </div>
      <p className="text-gray-700 italic bg-[#FAF7F2] rounded-lg p-4 mb-6">{data.philosophy.balance}</p>

      {/* Terminology */}
      <h3 className="font-serif text-xl italic text-[#722F37] mb-4">Key Terminology</h3>
      <div className="grid md:grid-cols-2 gap-4">
        {data.key_terminology.map((term, i) => (
          <div key={i} className="bg-[#FAF7F2] rounded-lg p-4">
            <p className="font-medium text-[#1C1C1C]">{term.term}</p>
            <p className="text-sm text-gray-600 mt-1">{term.definition}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function StagesSection({ data, slugPrefix }: { data: { title: string; description: string; stages: Array<Record<string, unknown>> }; slugPrefix: string }) {
  return (
    <div>
      <h2 className="font-serif text-2xl italic text-[#722F37] mb-4">{data.title}</h2>
      <p className="text-gray-700 leading-relaxed mb-6">{data.description}</p>
      <div className="grid gap-4">
        {data.stages.map((stage) => (
          <Link
            key={stage.id as string}
            href={`/resources/winemaking/${slugPrefix}/${stage.id}`}
            className="block bg-[#FAF7F2] rounded-lg p-4 hover:shadow-md transition-shadow border border-transparent hover:border-[#722F37]"
          >
            <h3 className="font-medium text-[#1C1C1C] group-hover:text-[#722F37]">{stage.name as string}</h3>
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{stage.description as string}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

function TechniquesSection({ data, slugPrefix }: { data: { title: string; description: string; techniques: Array<Record<string, unknown>> }; slugPrefix: string }) {
  return (
    <div>
      <h2 className="font-serif text-2xl italic text-[#722F37] mb-4">{data.title}</h2>
      <p className="text-gray-700 leading-relaxed mb-6">{data.description}</p>
      <div className="grid gap-4">
        {data.techniques.map((technique) => (
          <Link
            key={technique.id as string}
            href={`/resources/winemaking/${slugPrefix}/${technique.id}`}
            className="block bg-[#FAF7F2] rounded-lg p-4 hover:shadow-md transition-shadow border border-transparent hover:border-[#722F37]"
          >
            <h3 className="font-medium text-[#1C1C1C]">{technique.name as string}</h3>
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{technique.description as string}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

function MethodsSection({ data, slugPrefix }: { data: { title: string; description: string; methods: Array<Record<string, unknown>> }; slugPrefix: string }) {
  return (
    <div>
      <h2 className="font-serif text-2xl italic text-[#722F37] mb-4">{data.title}</h2>
      <p className="text-gray-700 leading-relaxed mb-6">{data.description}</p>
      <div className="grid gap-4">
        {data.methods.map((method) => (
          <Link
            key={method.id as string}
            href={`/resources/winemaking/${slugPrefix}/${method.id}`}
            className="block bg-[#FAF7F2] rounded-lg p-4 hover:shadow-md transition-shadow border border-transparent hover:border-[#722F37]"
          >
            <h3 className="font-medium text-[#1C1C1C]">{method.name as string}</h3>
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{method.description as string}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

function FortifiedSection({ data }: { data: { title: string; description: string; styles: Array<Record<string, unknown>> } }) {
  return (
    <div>
      <h2 className="font-serif text-2xl italic text-[#722F37] mb-4">{data.title}</h2>
      <p className="text-gray-700 leading-relaxed mb-6">{data.description}</p>
      <div className="grid gap-4">
        {data.styles.map((style) => (
          <Link
            key={style.id as string}
            href={`/resources/winemaking/fortified/${style.id}`}
            className="block bg-[#FAF7F2] rounded-lg p-4 hover:shadow-md transition-shadow border border-transparent hover:border-[#722F37]"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-[#1C1C1C]">{style.name as string}</h3>
              <span className="text-sm text-gray-500">{style.region as string}</span>
            </div>
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{style.description as string}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

function PrinciplesSection({ data }: { data: { title: string; description: string; principles: Array<Record<string, unknown>> } }) {
  return (
    <div>
      <h2 className="font-serif text-2xl italic text-[#722F37] mb-4">{data.title}</h2>
      <p className="text-gray-700 leading-relaxed mb-6">{data.description}</p>
      <div className="grid gap-4">
        {data.principles.map((principle) => (
          <div
            key={principle.id as string}
            className="bg-[#FAF7F2] rounded-lg p-4"
          >
            <h3 className="font-medium text-[#1C1C1C] mb-2">{principle.name as string}</h3>
            {principle.requirements && (
              <ul className="space-y-1">
                {(principle.requirements as string[]).map((req, i) => (
                  <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                    <span className="text-[#722F37]">•</span>
                    {req}
                  </li>
                ))}
              </ul>
            )}
            {principle.description && (
              <p className="text-sm text-gray-600">{principle.description as string}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
