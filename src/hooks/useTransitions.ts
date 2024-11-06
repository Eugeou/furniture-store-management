import { useState } from 'react';

export const useSidebarState = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(prevState => !prevState);
  };

  return { isSidebarCollapsed, toggleSidebar };
};


