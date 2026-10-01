import fs from 'fs';

const path = 'src/pages/Settings.tsx';
let content = fs.readFileSync(path, 'utf8');

// Replace classes
content = content.replace(/text-white/g, 'text-slate-800');
content = content.replace(/bg-surface-dark/g, 'bg-white');
content = content.replace(/bg-black\/60/g, 'bg-slate-900\/60');
content = content.replace(/bg-black\/20/g, 'bg-slate-100\/50');
content = content.replace(/text-gray-400/g, 'text-slate-500');
content = content.replace(/text-gray-500/g, 'text-slate-500');
content = content.replace(/border-white\/10/g, 'border-slate-200');
content = content.replace(/border-white\/5/g, 'border-slate-200');

// Fix buttons to remain text-white
content = content.replace(/text-slate-800 font-bold/g, 'text-white font-bold');
content = content.replace(/text-slate-800 uppercase/g, 'text-white uppercase');
content = content.replace(/text-slate-800 mb-1/g, 'text-white mb-1');
content = content.replace(/bg-white\/5 hover:bg-white\/10 text-slate-800 text-sm font-medium/g, 'bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium');
content = content.replace(/text-\[10px\] font-bold text-slate-800 uppercase tracking-wider/g, 'text-[10px] font-bold text-white uppercase tracking-wider');

fs.writeFileSync(path, content, 'utf8');
console.log('Fixed Settings.tsx');
