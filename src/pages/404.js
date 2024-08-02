import React from 'react';
import Layout from '@theme/Layout';
import { useLocation } from '@docusaurus/router';
import { usePluginData } from '@docusaurus/useGlobalData';

export default function NotFound() {
  const location = useLocation();
  const { validParam } = usePluginData('url-param-control');
  const urlParams = new URLSearchParams(location.search);

  const hasValidParam = urlParams.has(validParam) && 
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(urlParams.get(validParam));

  return (
    <Layout title="ページが見つかりません">
      <main className="container margin-vert--xl">
        <div className="row">
          <div className="col col--6 col--offset-3">
            <h1 className="hero__title">ページが見つかりません</h1>
            {hasValidParam ? (
              <p>アクセスしようとしたページは存在しません。</p>
            ) : (
              <p>アクセス権限がないか、必要なパラメーターが不足しています。</p>
            )}
          </div>
        </div>
      </main>
    </Layout>
  );
}