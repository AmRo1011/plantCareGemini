
import React from 'react';

const PlantIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21.75 9.75v2.25-2.25H21.75m-19.5 0v2.25m19.5 0V12m-19.5 0V9.75m19.5 0h-1.5m-16.5 0H2.25m19.5 0h-1.5m-1.5 0V7.5m-15 0V9.75m15 0h-1.5M4.5 9.75H3m16.5 2.25v2.25m-19.5-2.25v2.25m19.5-2.25H3m16.5 0h-1.5M3 12h1.5m16.5 2.25v-2.25m-19.5 2.25v-2.25m19.5 2.25v2.25m-19.5-2.25v2.25m16.5-2.25v2.25m-15-2.25v2.25M9 3.75l3 3m0 0l3-3M12 6.75V21"
    />
  </svg>
);

export default PlantIcon;
