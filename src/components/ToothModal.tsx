import { Zap, AlertTriangle } from 'lucide-react';

interface ToothModalProps {
  type: 'success' | 'error';
  title: string;
  message: string;
}

export default function ToothModal({ type, title, message }: ToothModalProps) {
  const isSuccess = type === 'success';
  const imageSrc = isSuccess ? '/images/smiling_tooth.png' : '/images/sad_tooth.png';
  
  return (
    <div className="relative overflow-hidden w-[450px] max-w-[90vw] bg-[#12121a] border border-white/10 rounded-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] flex flex-col items-center justify-center p-10 text-center animate-[bounce-in_0.5s_cubic-bezier(0.175,0.885,0.32,1.275)]">
      
      {/* Background Glow */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-[100px] opacity-20 pointer-events-none ${isSuccess ? 'bg-blue-500' : 'bg-red-500'}`} />
      
      {/* 3D Image */}
      <div className="relative w-56 h-56 mb-8 z-20 flex items-center justify-center animate-[pulse_4s_ease-in-out_infinite]">
        <img 
          src={imageSrc} 
          alt={type} 
          className="w-full h-full object-contain filter drop-shadow-[0_20px_20px_rgba(0,0,0,0.5)]" 
        />
      </div>

      {/* Content */}
      <div className="relative z-20">
        <h2 className="text-3xl font-black text-white flex items-center justify-center gap-3 mb-4 tracking-tight">
          {isSuccess ? (
            <Zap className="w-8 h-8 text-yellow-400" fill="currentColor" />
          ) : (
            <AlertTriangle className="w-8 h-8 text-red-500" fill="currentColor" />
          )}
          {title}
        </h2>
        <p className="text-gray-400 text-lg font-medium leading-relaxed max-w-sm mx-auto">
          {message}
        </p>
      </div>
    </div>
  );
}
