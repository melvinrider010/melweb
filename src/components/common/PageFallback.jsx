import React from 'react';
import CollegeVideoLoader from './CollegeVideoLoader';

export default function PageFallback() {
  return (
    <CollegeVideoLoader 
      label="Loading St. Philomena's Portal..." 
      isFullScreen={true} 
    />
  );
}