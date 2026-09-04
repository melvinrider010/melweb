import { useState, useEffect, useRef } from 'react';
import cmsStore from './cmsStore';

/**
 * Custom hook to subscribe to live CMS Store updates
 */
export function useCms(selector = (store) => store.getSnapshot()) {
  const selectorRef = useRef(selector);
  selectorRef.current = selector;

  const [data, setData] = useState(() => selector(cmsStore));

  useEffect(() => {
    const handleUpdate = () => {
      if (selectorRef.current) {
        setData(selectorRef.current(cmsStore));
      }
    };

    const handleStorage = (e) => {
      if (!e.key || e.key.startsWith('stphilos_cms_store')) {
        cmsStore.reloadFromStorage();
        handleUpdate();
      }
    };

    window.addEventListener('cms_store_updated', handleUpdate);
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('cms_store_updated', handleUpdate);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  return data;
}

export default useCms;
