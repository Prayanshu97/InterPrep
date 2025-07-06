import React from 'react';

const InterviewItemSkeleton = () => {
  return (
    <div className="border shadow-sm rounded-lg p-3 animate-pulse space-y-2">
      <div className="h-4 w-2/3 bg-gray-300 rounded" />
      <div className="h-3 w-3/4 bg-gray-200 rounded" />
      <div className="h-3 w-1/2 bg-gray-200 rounded" />
      <div className="flex justify-between mt-4 gap-5">
        <div className="h-8 w-full bg-gray-300 rounded" />
        <div className="h-8 w-full bg-gray-300 rounded" />
      </div>
    </div>
  );
};

export default InterviewItemSkeleton;
