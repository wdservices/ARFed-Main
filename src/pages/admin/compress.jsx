import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';

const ModelCanvas = dynamic(() => import('@/components/ModelViewer/ModelCanvas.jsx'), { ssr: false });

const Compress3DModel = () => {
  const [file, setFile] = useState(null);
  const [originalUrl, setOriginalUrl] = useState('');
  const [compressedUrl, setCompressedUrl] = useState('');
  const [originalSize, setOriginalSize] = useState(null);
  const [compressedSize, setCompressedSize] = useState(null);
  const [compressionMethod, setCompressionMethod] = useState(null);
  const [cdnLink, setCdnLink] = useState('');
  const [githubConnected, setGithubConnected] = useState(false);
  const [githubFiles, setGithubFiles] = useState([]);
  const [githubToken, setGithubToken] = useState('');
  const [githubOwner, setGithubOwner] = useState('');
  const [githubRepo, setGithubRepo] = useState('');
  const [githubError, setGithubError] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setOriginalUrl(url);
      setCompressedUrl('');
      setCompressedSize(null);
      return () => URL.revokeObjectURL(url);
    }
  }, [file]);

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      setOriginalSize((uploadedFile.size / (1024 * 1024)).toFixed(2));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const uploadedFile = e.dataTransfer.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      setOriginalSize((uploadedFile.size / (1024 * 1024)).toFixed(2));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Placeholder handlers for compression and download
  const handleCompress = (method) => {
    setCompressionMethod(method);
    // TODO: Call backend API, get compressed file blob
    // For now, just simulate by copying the original
    setCompressedUrl(originalUrl);
    setCompressedSize(originalSize);
  };

  const handleDownload = (format) => {
    // TODO: Download compressed file from backend
    alert(`Download as ${format} coming soon!`);
  };

  // Placeholder for GitHub connect
  const handleGithubConnect = async () => {
    setGithubError('');
    setGithubFiles([]);
    setGithubConnected(false);
    try {
      const res = await fetch('/api/github-list', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: githubToken,
          owner: githubOwner,
          repo: githubRepo,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch files');
      setGithubFiles(data.files);
      setGithubConnected(true);
    } catch (err) {
      setGithubError(err.message);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Back Button */}
      <button
        className="mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        onClick={() => router.push('/admin')}
      >
        ← Back to Dashboard
      </button>
      <h1 className="text-2xl font-bold mb-4">3D Compression Tool</h1>
      <div
        className="border-2 border-dashed rounded-lg p-8 mb-4 text-center cursor-pointer bg-gray-50"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => document.getElementById('file-input').click()}
      >
        {file ? (
          <span>{file.name}</span>
        ) : (
          <span>Drag & drop a .glb or .gltf file here, or click to select</span>
        )}
        <input
          id="file-input"
          type="file"
          accept=".glb,.gltf"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
      {file && (
        <div className="mb-4 flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <div className="mb-2 font-semibold">Original Model Preview</div>
            <div className="w-full h-64 bg-white rounded shadow flex items-center justify-center">
              {originalUrl ? (
                <ModelCanvas modelUrl={originalUrl} />
              ) : (
                <span className="text-gray-400">3D Preview</span>
              )}
            </div>
            <div className="mt-2 text-sm text-gray-600">Original size: {originalSize} MB</div>
          </div>
          <div className="flex-1">
            <div className="mb-2 font-semibold">Compressed Model Preview</div>
            <div className="w-full h-64 bg-white rounded shadow flex items-center justify-center">
              {compressedUrl ? (
                <ModelCanvas modelUrl={compressedUrl} />
              ) : (
                <span className="text-gray-400">3D Preview</span>
              )}
            </div>
            {compressedSize && (
              <div className="mt-2 text-sm text-gray-600">Compressed size: {compressedSize} MB</div>
            )}
          </div>
        </div>
      )}
      <div className="flex gap-4 mb-4">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={!file}
          onClick={() => handleCompress('draco')}
        >
          Compress with Draco
        </button>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={!file}
          onClick={() => handleCompress('meshopt')}
        >
          Compress with Meshopt
        </button>
        <button
          className="bg-yellow-600 text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={!file}
          onClick={() => handleCompress('further')}
        >
          Further Compress
        </button>
      </div>
      <div className="flex gap-4 mb-4">
        <button
          className="bg-purple-600 text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={!compressedSize}
          onClick={() => handleDownload('glb')}
        >
          Download .glb
        </button>
        <button
          className="bg-pink-600 text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={!compressedSize}
          onClick={() => handleDownload('usdz')}
        >
          Download .usdz
        </button>
      </div>
      {cdnLink && (
        <div className="flex items-center gap-2 mb-4">
          <input
            type="text"
            value={cdnLink}
            readOnly
            className="border px-2 py-1 rounded w-full"
          />
          <button
            className="bg-gray-300 px-2 py-1 rounded"
            onClick={() => {
              navigator.clipboard.writeText(cdnLink);
            }}
          >
            📋 Copy
          </button>
        </div>
      )}
      {/* GitHub Integration Section */}
      <div className="mt-8 p-6 bg-white/10 rounded-xl border border-white/20">
        <h2 className="text-lg font-semibold mb-2">GitHub Integration</h2>
        {!githubConnected ? (
          <div className="space-y-2">
            <input
              type="password"
              placeholder="GitHub Personal Access Token"
              value={githubToken}
              onChange={e => setGithubToken(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
            <input
              type="text"
              placeholder="GitHub Owner (username/org)"
              value={githubOwner}
              onChange={e => setGithubOwner(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
            <input
              type="text"
              placeholder="GitHub Repo Name"
              value={githubRepo}
              onChange={e => setGithubRepo(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
            <button
              className="bg-black text-white px-4 py-2 rounded"
              onClick={handleGithubConnect}
              disabled={!githubToken || !githubOwner || !githubRepo}
            >
              Connect to GitHub
            </button>
            {githubError && <div className="text-red-600 text-sm">{githubError}</div>}
          </div>
        ) : (
          <div>
            <div className="mb-2">Connected! Files in repo:</div>
            <ul className="list-disc pl-6">
              {githubFiles.map((f, i) => (
                <li key={i}>{f.type === 'dir' ? '📁' : '📄'} {f.name}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Compress3DModel; 