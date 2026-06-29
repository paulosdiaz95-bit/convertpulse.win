import React from "react";
import { getArticlesForCategory } from "../unitsEngine";
import { BookOpen } from "lucide-react";

interface ArticlesProps {
  categoryName: string;
}

export default function ArticlesSection({ categoryName }: ArticlesProps) {
  const articles = getArticlesForCategory(categoryName);

  return (
    <div className="border-t border-slate-100 pt-8 mt-8">
      <div className="flex items-center gap-2 mb-6">
        <BookOpen className="w-4 h-4 text-slate-500" />
        <h3 className="text-sm font-semibold tracking-tight text-slate-800 uppercase">Related Educational Articles</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {articles.map((article, idx) => (
          <div
            key={idx}
            className="group border border-slate-100 dark:border-slate-800/50 rounded-xl p-5 hover:border-brand-200 dark:hover:border-brand-800 hover:bg-brand-50/20 dark:hover:bg-brand-950/20 transition-all cursor-pointer shadow-xs"
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-[10px] font-mono tracking-wider text-slate-400 dark:text-slate-500 uppercase">
                {categoryName} GUIDE
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                {article.readTime}
              </span>
            </div>
            <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
              {article.title}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">
              {article.excerpt}
            </p>
            <div className="mt-4 flex items-center text-xs font-medium text-brand-600 dark:text-brand-400 group-hover:underline">
              Read article &rarr;
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
