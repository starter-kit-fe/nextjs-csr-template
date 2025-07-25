'use client';

import Loading from '@/components/loading';
import Show from '@/components/show';
import { useEffect, useState } from 'react';

import pkg from '../../../package.json';
import DataTable from './components/data-table';
import { IApp } from './type';

const cleanVersion = (version: string) => version.replace(/[\^~]/g, '');
async function fetchLatestVersions(dependencies: { [key: string]: string }) {
  const dependencyData = await Promise.all(
    Object.entries(dependencies).map(async ([name, currentVersion]) => {
      try {
        const response = await fetch(
          `https://registry.npmjs.org/${name}/latest`,
          {
            cache: 'force-cache',
            next: { revalidate: 3600 }, // Revalidate every hour
          },
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch latest version for ${name}`);
        }

        const data = await response.json();
        const lastVersion = data.version || 'N/A';

        const isNeedUpdate = cleanVersion(currentVersion) !== lastVersion;
        return {
          name,
          version: currentVersion,
          lastVersion,
          isNeedUpdate,
        };
      } catch (error) {
        console.error(`Error fetching version for ${name}:`, error);
        return {
          name,
          version: currentVersion,
          lastVersion: 'Error',
          isNeedUpdate: false,
        };
      }
    }),
  );

  return dependencyData;
}
export default function Home() {
  const [dependencies, setDependencies] = useState<IApp.asObject[]>();
  const [devDependencies, setDevDependencies] = useState<IApp.asObject[]>();
  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    const dependencies = await fetchLatestVersions(pkg.dependencies);
    setDependencies(dependencies);
    const devDependencies = await fetchLatestVersions(pkg.devDependencies);
    setDevDependencies(devDependencies);
  };

  return (
    <div className="container p-4 mx-auto ">
      <h1 className="font-bold text-4xl underline">You did it!</h1>
      <div>React NextJS is here. we use shadcn ui</div>
      <br />
      <h2 className="font-bold text-2xl my-2">dependencies</h2>
      <Show when={!!dependencies} fallback={<Loading />}>
        {dependencies && <DataTable data={dependencies} />}
      </Show>
      <h2 className="font-bold text-2xl my-2">devDependencies</h2>
      <Show when={!!devDependencies} fallback={<Loading />}>
        {devDependencies && <DataTable data={devDependencies} />}
      </Show>
    </div>
  );
}
