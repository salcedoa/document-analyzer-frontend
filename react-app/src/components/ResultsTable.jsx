import React, { useState, useMemo } from 'react';

const ResultsTable = ({ result, docUrl }) => {
  if (!result || !Array.isArray(result.APIObjectsList)) {
    return <p style={{ textAlign: 'center' }}>No results available.</p>;
  }

  const [apiObjectType, setApiObjectType] = useState('class');

  const filteredObjects = useMemo(() => {
    const filtered = result.APIObjectsList.filter(obj => obj.type === apiObjectType);
    const sorted = [...filtered].sort((a, b) => b.appearances - a.appearances);
    return sorted.map((obj, index) => ({
      ...obj,
      rank: index + 1,
    }));
  }, [result.APIObjectsList, apiObjectType]);

  const handleTypeChange = (e) => setApiObjectType(e.target.value);

  return (
    <div style={{ padding: 20 }}>
      <h2>
        Results for <a href={docUrl} target="_blank" rel="noopener noreferrer">{docUrl}</a>
      </h2>

      <div style={{ marginBottom: 10 }}>
        <label htmlFor="api-object-type">API Object Type: </label>
        <select id="api-object-type" value={apiObjectType} onChange={handleTypeChange}>
          <option value="class">Classes</option>
          <option value="method">Methods</option>
        </select>
      </div>

      <h3>Most Used {apiObjectType === 'class' ? 'Classes' : 'Methods'}</h3>

      {filteredObjects.length === 0 ? (
        <p>No {apiObjectType === 'class' ? 'classes' : 'methods'} found.</p>
      ) : (
        <table style={{ width: '100%', maxWidth: 800, margin: 'auto', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ borderBottom: '2px solid #333', padding: '10px' }}>Rank</th>
              <th style={{ borderBottom: '2px solid #333', padding: '10px' }}>Name</th>
              <th style={{ borderBottom: '2px solid #333', padding: '10px' }}>Appearances</th>
              <th style={{ borderBottom: '2px solid #333', padding: '10px' }}>Documentation Link</th>
            </tr>
          </thead>
          <tbody>
            {filteredObjects.map(({ rank, name, appearances, link, type }) => (
              <tr key={`${type}-${name}`}>
                <td style={{ padding: '10px', textAlign: 'center', borderBottom: '1px solid #ccc' }}>#{rank}</td>
                <td style={{ padding: '10px', textAlign: 'center', borderBottom: '1px solid #ccc' }}>{name}</td>
                <td style={{ padding: '10px', textAlign: 'center', borderBottom: '1px solid #ccc' }}>{appearances.toLocaleString()}</td>
                <td style={{ padding: '10px', textAlign: 'center', borderBottom: '1px solid #ccc' }}>
                  <a href={link} target="_blank" rel="noopener noreferrer">View</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ResultsTable;
