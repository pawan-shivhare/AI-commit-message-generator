"use client";

import { useState } from "react";

export default function Home() {
  const [diff, setDiff] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  async function generate() {
    if (!diff.trim()) return;
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ diff }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Request failed");
      setMessage(data.message);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function copy() {
    await navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <main className="min-h-screen bg-gray-950 text-gray-100 flex flex-col items-center py-16 px-4">
      <div className="w-full max-w-2xl flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            AI Commit Message
          </h1>
          <p className="text-gray-400 mt-1 text-sm">
            Paste a git diff and get a conventional commit message.
          </p>
        </div>

        <textarea
          value={diff}
          onChange={(e) => setDiff(e.target.value)}
          placeholder="Paste your git diff here..."
          rows={12}
          className="w-full rounded-lg bg-gray-900 border border-gray-700 text-sm font-mono p-4 resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-600"
        />

        <button
          onClick={generate}
          disabled={loading || !diff.trim()}
          className="self-start rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed px-5 py-2.5 text-sm font-semibold transition-colors"
        >
          {loading ? "Generating…" : "Generate commit message"}
        </button>

        {error && (
          <p className="text-red-400 text-sm">{error}</p>
        )}

        {message && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400 uppercase tracking-wider">
                Result
              </span>
              <button
                onClick={copy}
                className="text-xs rounded-md bg-gray-800 hover:bg-gray-700 px-3 py-1.5 transition-colors"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <pre className="w-full rounded-lg bg-gray-900 border border-gray-700 text-sm font-mono p-4 whitespace-pre-wrap break-words">
              {message}
            </pre>
          </div>
        )}
      </div>
    </main>
  );
}
