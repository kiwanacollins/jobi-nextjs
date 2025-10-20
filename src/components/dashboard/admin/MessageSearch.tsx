'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

const MessageSearch = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      
      if (searchTerm) {
        params.set('search', searchTerm);
        params.set('page', '1'); // Reset to first page on new search
      } else {
        params.delete('search');
      }
      
      router.push(`?${params.toString()}`, { scroll: false });
    }, 500); // Debounce search by 500ms

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, router, searchParams]);

  return (
    <div className="mb-4">
      <div className="position-relative">
        <input
          type="text"
          className="form-control ps-5"
          placeholder="Search messages by name, email, subject, or content..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ paddingLeft: '2.5rem' }}
        />
        <Search 
          className="position-absolute" 
          style={{ 
            left: '0.75rem', 
            top: '50%', 
            transform: 'translateY(-50%)',
            color: '#6c757d'
          }} 
          size={20} 
        />
      </div>
    </div>
  );
};

export default MessageSearch;
