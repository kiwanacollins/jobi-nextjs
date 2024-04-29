import React from 'react';

import LoadingTableSkeleton from '@/components/skaletons/TableSkeleton';

const LoadingPageMessages = async () => {
  return (
    <div>
      <div className="placeholder placeholder-glow  bg-success w-50"></div>
      <div>
        <LoadingTableSkeleton />
      </div>
    </div>
  );
};

export default LoadingPageMessages;
