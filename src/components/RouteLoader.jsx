import React from 'react';

const Loader = () => {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-52 h-52 border-4 border-yellow-400 border-dashed rounded-full animate-spin"></div>
    </div>
  );
};

export default Loader;