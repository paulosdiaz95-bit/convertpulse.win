import React, { useState, useEffect } from "react";
import { Key, Copy, Check, RefreshCw } from "lucide-react";

export default function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [includeUpper, setIncludeUpper] = useState(true);
  const [includeLower, setIncludeLower] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);

  const [password, setPassword] = useState("");
  const [strength, setStrength] = useState("Strong");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    generatePassword();
  }, [length, includeUpper, includeLower, includeNumbers, includeSymbols]);

  const generatePassword = () => {
    let charset = "";
    if (includeLower) charset += "abcdefghijklmnopqrstuvwxyz";
    if (includeUpper) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (includeNumbers) charset += "0123456789";
    if (includeSymbols) charset += "!@#$%^&*()_+~`|}{[]:;?><,./-=";

    if (!charset) {
      setPassword("");
      setStrength("Empty");
      return;
    }

    let result = "";
    const array = new Uint32Array(length);
    window.crypto.getRandomValues(array);
    for (let i = 0; i < length; i++) {
      result += charset[array[i] % charset.length];
    }

    setPassword(result);
    evaluateStrength(result);
  };

  const evaluateStrength = (pass: string) => {
    const len = pass.length;
    let poolSize = 0;
    if (/[a-z]/.test(pass)) poolSize += 26;
    if (/[A-Z]/.test(pass)) poolSize += 26;
    if (/[0-9]/.test(pass)) poolSize += 10;
    if (/[^a-zA-Z0-9]/.test(pass)) poolSize += 32;

    const entropy = len * Math.log2(poolSize || 1);

    if (entropy < 40) {
      setStrength("Weak");
    } else if (entropy < 60) {
      setStrength("Medium");
    } else if (entropy < 80) {
      setStrength("Strong");
    } else {
      setStrength("Very Strong / Cryptographic");
    }
  };

  const triggerCopy = () => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <Key className="w-5 h-5 text-brand-600 dark:text-brand-400" />
        <h3 className="text-base font-bold tracking-tight text-slate-800 dark:text-slate-100">
          Secure Password Generator
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Settings Column */}
        <div className="md:col-span-7 bg-white dark:bg-slate-900 border border-slate-200/65 dark:border-slate-800/80 rounded-2xl p-5 shadow-xs space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-[10px] font-mono uppercase text-slate-400">Password Length: {length}</label>
            </div>
            <input
              type="range"
              min="6"
              max="64"
              value={length}
              onChange={(e) => setLength(parseInt(e.target.value))}
              className="w-full accent-brand-600 bg-slate-100 dark:bg-slate-800 h-1.5 rounded-lg cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <label className="flex items-center gap-2.5 text-xs font-semibold text-slate-600 dark:text-slate-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={includeUpper}
                onChange={(e) => setIncludeUpper(e.target.checked)}
                className="rounded-sm border-slate-300 text-brand-600 focus:ring-brand-500 w-4 h-4 cursor-pointer"
              />
              <span>Uppercase Letters (A-Z)</span>
            </label>

            <label className="flex items-center gap-2.5 text-xs font-semibold text-slate-600 dark:text-slate-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={includeLower}
                onChange={(e) => setIncludeLower(e.target.checked)}
                className="rounded-sm border-slate-300 text-brand-600 focus:ring-brand-500 w-4 h-4 cursor-pointer"
              />
              <span>Lowercase Letters (a-z)</span>
            </label>

            <label className="flex items-center gap-2.5 text-xs font-semibold text-slate-600 dark:text-slate-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={includeNumbers}
                onChange={(e) => setIncludeNumbers(e.target.checked)}
                className="rounded-sm border-slate-300 text-brand-600 focus:ring-brand-500 w-4 h-4 cursor-pointer"
              />
              <span>Numbers (0-9)</span>
            </label>

            <label className="flex items-center gap-2.5 text-xs font-semibold text-slate-600 dark:text-slate-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={includeSymbols}
                onChange={(e) => setIncludeSymbols(e.target.checked)}
                className="rounded-sm border-slate-300 text-brand-600 focus:ring-brand-500 w-4 h-4 cursor-pointer"
              />
              <span>Special Symbols (&*#@)</span>
            </label>
          </div>
        </div>

        {/* Output Column */}
        <div className="md:col-span-5 bg-white dark:bg-slate-900 border border-slate-200/65 dark:border-slate-800/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Generated Credential</span>

            <div className="relative flex items-center bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/85 p-3 rounded-xl">
              <input
                type="text"
                readOnly
                value={password || "Select composition option..."}
                className="w-full bg-transparent text-xs font-mono font-semibold text-slate-800 dark:text-slate-100 pr-16 focus:outline-hidden"
              />
              <div className="absolute right-2 flex items-center gap-1.5">
                <button
                  onClick={generatePassword}
                  className="p-1.5 rounded-md hover:bg-slate-200/50 dark:hover:bg-slate-800 text-slate-400 hover:text-brand-600 cursor-pointer"
                  title="Generate New"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={triggerCopy}
                  disabled={!password}
                  className="p-1.5 rounded-md hover:bg-slate-200/50 dark:hover:bg-slate-800 text-slate-400 hover:text-brand-600 cursor-pointer disabled:opacity-40"
                  title="Copy Password"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] font-mono text-slate-400">Entropy Strength</span>
                <span className={`text-[10px] font-mono font-bold ${
                  strength === "Weak" ? "text-red-500" :
                  strength === "Medium" ? "text-amber-500" :
                  strength === "Strong" ? "text-emerald-500" : "text-brand-500"
                }`}>
                  {strength}
                </span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className={`h-full transition-all duration-300 ${
                  strength === "Weak" ? "bg-red-500 w-1/4" :
                  strength === "Medium" ? "bg-amber-500 w-2/4" :
                  strength === "Strong" ? "bg-emerald-500 w-3/4" : "bg-brand-500 w-full"
                }`} />
              </div>
            </div>
          </div>

          <span className="text-[9px] text-slate-400 font-mono mt-4 leading-tight block">
            🔒 Fully sandboxed. Generation strictly utilizes client-side cryptographic CSPRNG engines. No logs recorded.
          </span>
        </div>

      </div>
    </div>
  );
}
