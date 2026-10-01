import fs from 'fs';

const path = 'src/pages/AdminDashboard.tsx';
let content = fs.readFileSync(path, 'utf8');

// Replace classes
content = content.replace(/text-white/g, 'text-slate-800');
content = content.replace(/bg-surface-dark/g, 'bg-slate-50');
content = content.replace(/bg-surface-card/g, 'bg-white');
content = content.replace(/bg-black\/60/g, 'bg-slate-900\/40');
content = content.replace(/bg-black\/20/g, 'bg-slate-50');
content = content.replace(/text-gray-400/g, 'text-slate-500');
content = content.replace(/text-gray-300/g, 'text-slate-600');
content = content.replace(/text-gray-500/g, 'text-slate-400');
content = content.replace(/border-white\/10/g, 'border-slate-200');
content = content.replace(/border-white\/5/g, 'border-slate-100');
content = content.replace(/bg-white\/5/g, 'bg-slate-50');

// Fix buttons to remain text-white
content = content.replace(/bg-primary-600 hover:bg-primary-500 text-slate-800/g, 'bg-primary-600 hover:bg-primary-500 text-white');
content = content.replace(/bg-red-600 hover:bg-red-500 text-slate-800/g, 'bg-red-600 hover:bg-red-500 text-white');
content = content.replace(/bg-slate-50 text-slate-800 rounded-xl/g, 'bg-slate-100 text-slate-700 rounded-xl');

fs.writeFileSync(path, content, 'utf8');
console.log('Fixed AdminDashboard');
