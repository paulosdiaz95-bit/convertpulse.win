import React, { useState } from "react";
import { FileCode, Copy, Check, Trash2, AlignLeft, Minimize } from "lucide-react";

export default function JsonFormatter() {
  const [jsonText, setJsonText] = useState(`{"name":"Universal Platform","version":"1.0.0","active":true,"features":["converters","calculators","devtools"],"nested":{"db":"sqlite","enabled":false}}`);
  const [indent, setIndent] = useState<2 | 4>(2);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const formatJson = () => {
    setErrorMsg(null);
    try {
      if (!jsonText.trim()) return;
      const parsed = JSON.parse(jsonText);
      setJsonText(JSON.stringify(parsed, null, indent));
    } catch (err: any) {
      setErrorMsg(err.message || "Invalid JSON syntax structure.");
    }
  };

  const minifyJson = () => {
    setErrorMsg(null);
    try {
      if (!jsonText.trim()) return;
      const parsed = JSON.parse(jsonText);
      setJsonText(JSON.stringify(parsed));
    } catch (err: any) {
      setErrorMsg(err.message || "Invalid JSON syntax structure.");
    }
  };

  const validateJson = () => {
    setErrorMsg(null);
    try {
      if (!jsonText.trim()) {
        setErrorMsg("Input field is empty.");
        return;
      }
      JSON.parse(jsonText);
      alert("✅ JSON is perfectly valid!");
    } catch (err: any) {
      setErrorMsg(err.message || "Invalid JSON syntax structure.");
    }
  };

  const triggerCopy = () => {
    if (!jsonText) return;
    navigator.clipboard.writeText(jsonText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <FileCode className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h3 className="text-base font-bold tracking-tight text-slate-800 dark:text-slate-100">
            JSON Formatter & Validator
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={formatJson}
            className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-[10px] font-bold uppercase tracking-wide text-slate-600 dark:text-slate-200 rounded-md flex items-center gap-1 cursor-pointer transition-colors"
          >
            <AlignLeft className="w-3 h-3" />
            <span>Format</span>
          </button>
          <button
            onClick={minifyJson}
            className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-[10px] font-bold uppercase tracking-wide text-slate-600 dark:text-slate-200 rounded-md flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Minimize className="w-3 h-3" />
            <span>Minify</span>
          </button>
          <button
            onClick={triggerCopy}
            disabled={!jsonText}
            className="p-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/80 rounded-md text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
            title="Copy Code"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => setJsonText("")}
            className="p-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 hover:text-rose-600 rounded-md text-slate-400 cursor-pointer transition-colors"
            title="Clear Field"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <textarea
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
            placeholder='Paste raw JSON code here...'
            rows={10}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/85 rounded-xl p-4 text-xs font-mono text-slate-800 dark:text-slate-100 focus:outline-hidden focus:border-indigo-600 dark:focus:border-indigo-500"
          />
        </div>

        {/* Indent option + Validate trigger */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono uppercase text-slate-400">Tab Indentation:</span>
            <div className="flex bg-slate-100 dark:bg-slate-800 p-0.5 rounded-md">
              <button
                onClick={() => setIndent(2)}
                className={`px-2 py-1 text-[10px] font-bold rounded-sm cursor-pointer ${indent === 2 ? "bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 shadow-xs" : "text-slate-400"}`}
              >
                2 Spaces
              </button>
              <button
                onClick={() => setIndent(4)}
                className={`px-2 py-1 text-[10px] font-bold rounded-sm cursor-pointer ${indent === 4 ? "bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 shadow-xs" : "text-slate-400"}`}
              >
                4 Spaces
              </button>
            </div>
          </div>

          <button
            onClick={validateJson}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold uppercase rounded-md shadow-xs cursor-pointer transition-colors"
          >
            Check Validation
          </button>
        </div>

        {/* Validation Errors */}
        {errorMsg && (
          <div className="bg-red-50/50 dark:bg-rose-950/15 border border-red-200/50 dark:border-rose-900/30 rounded-xl p-3 text-xs text-red-500 dark:text-rose-400 font-medium">
            ⚠️ JSON Syntax Parsing Exception: {errorMsg}
          </div>
        )}
      </div>
    </div>
  );
}
