'use client';
import { useState, useEffect, useRef, useCallback } from 'react';

function SearchBar({ onSelect }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchIndex, setSearchIndex] = useState(null);
  const inputRef = useRef(null);
  const debounceRef = useRef(null);
  const containerRef = useRef(null);

  // Click outside to close
  useEffect(() => {
    function handleOutsideClick(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Clean up debounce timer on unmount
  useEffect(() => {
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, []);

  // Load pre-baked search index (~1MB instead of ~100MB)
  useEffect(() => {
    let mounted = true;
    fetch('/data/search-index.json')
      .then(res => res.json())
      .then(data => {
        if (!mounted) return;
        const entries = data.entries.map(e => ({
          name: e.n,
          coords: e.c,
          ava: e.a || '',
          type: e.t || '',
          searchText: e.n.toLowerCase(),
        }));
        setSearchIndex(entries);
      })
      .catch(() => {});
    return () => { mounted = false; };
  }, []);

  const search = useCallback((q) => {
    if (!searchIndex || q.length < 2) {
      setResults([]);
      return;
    }

    const lower = q.toLowerCase();
    const matches = [];

    for (const entry of searchIndex) {
      if (entry.searchText.includes(lower)) {
        const score = entry.searchText.startsWith(lower) ? 0 : 1;
        matches.push({ ...entry, score });
      }
    }

    matches.sort((a, b) => a.score - b.score || a.name.localeCompare(b.name));
    setResults(matches.slice(0, 15));
  }, [searchIndex]);

  const handleInput = (e) => {
    const val = e.target.value;
    setQuery(val);
    setIsOpen(true);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(val), 150);
  };

  const handleSelect = (result) => {
    setQuery(result.name);
    setIsOpen(false);
    onSelect(result);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  return (
    <div className="search-bar" ref={containerRef}>
      <input
        ref={inputRef}
        type="text"
        placeholder="Search vineyards, wineries, AVAs..."
        value={query}
        onChange={handleInput}
        onFocus={() => query.length >= 2 && setIsOpen(true)}
        onKeyDown={handleKeyDown}
      />
      {isOpen && results.length > 0 && (
        <div className="search-results">
          {results.map((r) => (
            <button
              key={`${r.name}-${r.coords[0]}-${r.coords[1]}`}
              className="search-result-item"
              onClick={() => handleSelect(r)}
            >
              <span className="search-result-name">{r.name}</span>
              {r.ava && <span className="search-result-ava">{r.ava}</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchBar;
