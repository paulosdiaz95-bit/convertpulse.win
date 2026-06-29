import React, { useState, useEffect } from "react";
import { Coins, Copy, Check } from "lucide-react";

export default function LoanCalculator() {
  const [principal, setPrincipal] = useState("25000");
  const [interestRate, setInterestRate] = useState("5.5");
  const [termYears, setTermYears] = useState("5");

  const [monthlyPayment, setMonthlyPayment] = useState<number | null>(477.53);
  const [totalPayment, setTotalPayment] = useState<number | null>(28651.8);
  const [totalInterest, setTotalInterest] = useState<number | null>(3651.8);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    recalculate();
  }, [principal, interestRate, termYears]);

  const recalculate = () => {
    const P = parseFloat(principal);
    const rAnnual = parseFloat(interestRate);
    const tYears = parseFloat(termYears);

    if (!isNaN(P) && !isNaN(rAnnual) && !isNaN(tYears) && P > 0 && tYears > 0) {
      const rMonthly = (rAnnual / 100) / 12;
      const nMonths = tYears * 12;

      if (rMonthly === 0) {
        const pmt = P / nMonths;
        setMonthlyPayment(pmt);
        setTotalPayment(P);
        setTotalInterest(0);
      } else {
        const pmt = (P * rMonthly * Math.pow(1 + rMonthly, nMonths)) / (Math.pow(1 + rMonthly, nMonths) - 1);
        const total = pmt * nMonths;
        setMonthlyPayment(pmt);
        setTotalPayment(total);
        setTotalInterest(total - P);
      }
    } else {
      setMonthlyPayment(null);
      setTotalPayment(null);
      setTotalInterest(null);
    }
  };

  const triggerCopy = () => {
    if (monthlyPayment === null) return;
    const text = `Loan Summary: Principal $${principal}, Rate ${interestRate}%, Term ${termYears} years. Monthly Payment: $${monthlyPayment.toFixed(2)}.`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <Coins className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
        <h3 className="text-base font-bold tracking-tight text-slate-800 dark:text-slate-100">
          Loan & Amortization Calculator
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Input Form */}
        <div className="md:col-span-6 bg-white dark:bg-slate-900 border border-slate-200/65 dark:border-slate-800/80 rounded-2xl p-5 shadow-xs space-y-4">
          <div>
            <label className="text-[10px] font-mono uppercase text-slate-400">Principal Amount ($)</label>
            <input
              type="number"
              value={principal}
              onChange={(e) => setPrincipal(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-hidden focus:border-indigo-600 dark:focus:border-indigo-500 text-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-mono uppercase text-slate-400">Interest Rate (%)</label>
              <input
                type="number"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-hidden focus:border-indigo-600 dark:focus:border-indigo-500 text-slate-900 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="text-[10px] font-mono uppercase text-slate-400">Term (Years)</label>
              <input
                type="number"
                value={termYears}
                onChange={(e) => setTermYears(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-hidden focus:border-indigo-600 dark:focus:border-indigo-500 text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="md:col-span-6 bg-white dark:bg-slate-900 border border-slate-200/65 dark:border-slate-800/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/40 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Monthly Payment</span>
              {monthlyPayment !== null && (
                <button
                  onClick={triggerCopy}
                  className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-indigo-600 cursor-pointer"
                  title="Copy Details"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
              )}
            </div>

            <div className="text-center py-3 bg-indigo-50/30 dark:bg-indigo-950/20 rounded-xl border border-indigo-100/30">
              <div className="text-3xl font-extrabold text-indigo-700 dark:text-indigo-400 tracking-tight font-mono">
                {monthlyPayment !== null ? `$${monthlyPayment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "—"}
              </div>
              <span className="text-[10px] font-mono uppercase text-indigo-500">Scheduled Monthly Payment</span>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="bg-slate-50/50 dark:bg-slate-950 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800/65">
                <span className="text-[9px] uppercase font-mono text-slate-400 block">Total Principal</span>
                <span className="text-sm font-bold text-slate-700 dark:text-slate-200 font-mono">
                  ${parseFloat(principal).toLocaleString() || "0"}
                </span>
              </div>
              <div className="bg-slate-50/50 dark:bg-slate-950 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800/65">
                <span className="text-[9px] uppercase font-mono text-slate-400 block">Total Interest</span>
                <span className="text-sm font-bold text-slate-700 dark:text-slate-200 font-mono">
                  {totalInterest !== null ? `$${totalInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })}` : "—"}
                </span>
              </div>
            </div>
          </div>

          <p className="text-[10px] text-slate-400 leading-tight mt-4 italic">
            Amortization factors utilize compound standard mortgage annuities. Final bank APR criteria may incorporate auxiliary service insurance fees.
          </p>
        </div>

      </div>
    </div>
  );
}
