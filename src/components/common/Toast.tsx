import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message?: string;
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => {
        const icons = {
          success: <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />,
          error: <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />,
          info: <Info className="w-4 h-4 text-blue-600 shrink-0" />
        };

        const borders = {
          success: 'border-slate-200 bg-white',
          error: 'border-red-200 bg-red-50/60',
          info: 'border-slate-200 bg-white'
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-3.5 rounded-xl shadow-md border flex items-start gap-3 transition-all ${borders[toast.type]}`}
          >
            {icons[toast.type]}
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-semibold text-slate-900">{toast.title}</h4>
              {toast.message && (
                <p className="text-xs text-slate-600 mt-0.5">{toast.message}</p>
              )}
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="text-slate-400 hover:text-slate-700 p-1 -mr-1 -mt-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
