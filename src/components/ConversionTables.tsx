import React from "react";
import { formatValue } from "../unitsEngine";
import { Unit } from "../types";
import { Table, Copy } from "lucide-react";

interface TablesProps {
  fromUnit: Unit;
  toUnit: Unit;
  referenceTable: { input: number; output: number }[];
}

export default function ConversionTables({ fromUnit, toUnit, referenceTable }: TablesProps) {
  const handleCopyRow = (input: number, output: string) => {
    const text = `${input} ${fromUnit.pluralName} = ${output} ${toUnit.pluralName}`;
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="border-t border-slate-100 pt-8 mt-8">
      <div className="flex items-center gap-2 mb-4">
        <Table className="w-4 h-4 text-slate-500" />
        <h3 className="text-sm font-semibold tracking-tight text-slate-800 uppercase">
          {fromUnit.name} to {toUnit.name} Conversion Table
        </h3>
      </div>
      <p className="text-xs text-slate-500 mb-4">
        Quick reference lookup chart for converting values from {fromUnit.pluralName} to {toUnit.pluralName} accurately.
      </p>

      <div className="border border-slate-100 dark:border-slate-800/80 rounded-xl overflow-hidden shadow-xs bg-white dark:bg-slate-900">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50/70 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800/80 font-mono text-slate-500 dark:text-slate-400">
              <th className="p-3 font-semibold">{fromUnit.name} ({fromUnit.symbol})</th>
              <th className="p-3 font-semibold">{toUnit.name} ({toUnit.symbol})</th>
              <th className="p-3 text-right font-semibold">Copy Relation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50 font-sans text-slate-700 dark:text-slate-300">
            {referenceTable.map((row) => {
              const formattedOutput = formatValue(row.output);
              return (
                <tr key={row.input} className="hover:bg-slate-50/40 dark:hover:bg-slate-800/20 transition-colors">
                  <td className="p-3 font-medium">{row.input} {fromUnit.pluralName}</td>
                  <td className="p-3 font-semibold text-slate-900 dark:text-slate-100">{formattedOutput} {toUnit.pluralName}</td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => handleCopyRow(row.input, formattedOutput)}
                      className="inline-flex items-center gap-1.5 text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 font-medium cursor-pointer"
                      title="Copy formula text"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
