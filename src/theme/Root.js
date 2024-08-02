import React, { useEffect, useState } from 'react';
import { useLocation, useHistory } from '@docusaurus/router';
import { usePluginData } from '@docusaurus/useGlobalData';

export default function Root({ children }) {
  const location = useLocation();
  const history = useHistory();
  const { validParam } = usePluginData('url-param-control');
  const [debugInfo, setDebugInfo] = useState('');

  const checkUrlParam = () => {
    const urlParams = new URLSearchParams(location.search);
    if (!urlParams.has(validParam)) {
      return false;
    }
    const paramValue = urlParams.get(validParam);
    return /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(paramValue);
  };

  useEffect(() => {
    const isValid = checkUrlParam();
    setDebugInfo(`Path: ${location.pathname}, Search: ${location.search}, Hash: ${location.hash}, Valid: ${isValid}`);

    if (!isValid && location.pathname !== '/404') {
      history.replace('/404' + location.search);
    }
  }, [location, history, validParam]);

  useEffect(() => {
    const originalPush = history.push;
    history.push = (path, state) => {
      let newPath = path;
      let newSearch = '';
      let newHash = '';
      
      if (typeof path === 'object' && path.pathname) {
        newPath = path.pathname;
        newSearch = path.search || '';
        newHash = path.hash || '';
      } else if (typeof path === 'string') {
        const [pathPart, searchPart] = path.split('?');
        newPath = pathPart.split('#')[0];
        newSearch = searchPart ? `?${searchPart.split('#')[0]}` : '';
        newHash = path.includes('#') ? `#${path.split('#')[1]}` : '';
      }

      const currentParams = new URLSearchParams(location.search);
      const newParams = new URLSearchParams(newSearch);
      const validParamValue = currentParams.get(validParam);
      
      if (validParamValue && !newParams.has(validParam)) {
        newParams.set(validParam, validParamValue);
      }

      const finalPath = `${newPath}${newParams.toString() ? `?${newParams.toString()}` : ''}${newHash}`;
      originalPush(finalPath, state);
    };

    return () => {
      history.push = originalPush;
    };
  }, [history, location, validParam]);

  useEffect(() => {
    const handleAnchorClick = (event) => {
      const anchor = event.target.closest('a');
      if (anchor && anchor.hash && anchor.pathname === location.pathname) {
        event.preventDefault();
        const targetId = anchor.hash.slice(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth' });
          const newUrl = `${location.pathname}${location.search}${anchor.hash}`;
          window.history.pushState(null, '', newUrl);
          setDebugInfo(`Path: ${location.pathname}, Search: ${location.search}, Hash: ${anchor.hash}, Valid: ${checkUrlParam()}`);
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);
    return () => document.removeEventListener('click', handleAnchorClick);
  }, [location]);

  return (
    <>
      {children}
      <div style={{ position: 'fixed', bottom: 0, left: 0, background: 'white', padding: '10px', fontSize: '12px', zIndex: 9999 }}>
        Debug: {debugInfo}
      </div>
    </>
  );
}