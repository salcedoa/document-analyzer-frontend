import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LoadingBar from './components/LoadingBar';
import ResultsTable from './components/ResultsTable';

const App = () => {
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, done, error
  const [taskId, setTaskId] = useState(null);
  const [resultData, setResultData] = useState(null);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('Initializing...');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setProgress(0);
    try {
      const response = await axios.post('http://127.0.0.1:5000/analyze/start', { url });
      setTaskId(response.data.task_id);
    } catch (error) {
      console.error('Failed to start analysis:', error);
      setStatus('error');
    }
  };

  useEffect(() => {
    if (status !== 'loading' || !taskId) return;

    const interval = setInterval(async () => {
      try {
        const res = await axios.get(`http://127.0.0.1:5000/analyze/status/${taskId}`);
        const taskStatus = res.data.status;

        if (taskStatus === 'In Progress') {
          setProgress((prev) => Math.min(prev + 10, 90));
          setCurrentStep(() => {
            if (progress < 33) return 'Parsing documentation...';
            else if (progress < 66) return 'Analyzing source code...';
            else return 'Ranking API objects...';
          });
        }

        if (taskStatus === 'Completed') {
          clearInterval(interval);
          setProgress(100);
          setCurrentStep('Completed!');
          const response = await axios.get(`http://127.0.0.1:5000/analyze/result/${taskId}`);
          const parsedResult = JSON.parse(response.data.result);
          setResultData(parsedResult);  
          setStatus('done');
        } else if (taskStatus === 'Failed') {
          clearInterval(interval);
          setStatus('error');
        }
      } catch (err) {
        console.error('Polling error:', err);
        clearInterval(interval);
        setStatus('error');
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [status, taskId, progress]);

  const resetApp = () => {
    setUrl('');
    setStatus('idle');
    setTaskId(null);
    setResultData(null);
    setProgress(0);
    setCurrentStep('Initializing...');
  };

  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      {status === 'idle' && (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter documentation URL"
            style={{ padding: '10px', width: '300px' }}
          />
          <button type="submit" style={{ padding: '10px 15px', marginLeft: '10px' }}>
            Analyze
          </button>
        </form>
      )}

      {status === 'loading' && (
        <>
          <LoadingBar url={url} progress={progress} currentStep={currentStep} />
          <p style={{ marginTop: 20 }}>Please wait, analysis in progress...</p>
        </>
      )}

      {status === 'done' && (
        <div>
          <h2>Analysis Completed!</h2>
          <ResultsTable result={resultData} docUrl={url} />
          <button onClick={resetApp} style={{ marginTop: 20 }}>Analyze Another URL</button>
        </div>
      )}

      {status === 'error' && (
        <div style={{ color: 'red' }}>
          An error occurred. Please try again.
          <div>
            <button onClick={resetApp} style={{ marginTop: 10 }}>Start Over</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
