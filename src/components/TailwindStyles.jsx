import React from 'react';

const TailwindStyles = () => (
    <style>{`
    /* Custom Properties for Theming */
    :root {
      --bg-primary: #111827; /* gray-900 */
      --bg-secondary: #1F2937; /* gray-800 */
      --bg-tertiary: #374151; /* gray-700 */
      --border-color: #4B5563; /* gray-600 */
      --text-primary: #F3F4F6; /* gray-200 */
      --text-secondary: #9CA3AF; /* gray-400 */
      --text-brand: #3B82F6; /* blue-500 */
    }

    /* Tailwind CSS Base & Preflight */
    *, ::before, ::after { box-sizing: border-box; border-width: 0; border-style: solid; border-color: var(--border-color); }
    html { line-height: 1.5; -webkit-text-size-adjust: 100%; -moz-tab-size: 4; tab-size: 4; font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"; }
    body { margin: 0; line-height: inherit; background-color: var(--bg-primary); color: var(--text-primary); }
    h1, h2, p, button, input, select, label, ul, li { margin: 0; padding: 0; }
    button, [type='button'], [type='reset'], [type='submit'] { -webkit-appearance: button; background-color: transparent; background-image: none; }
    
    /* Input placeholder color */
    input::placeholder, select { color: var(--text-secondary); }
    input, select { background-color: var(--bg-tertiary); border-color: var(--border-color); }

    /* Custom Form Styles */
    .form-input {
        background-color: var(--bg-tertiary);
        border: 1px solid var(--border-color);
        border-radius: 0.375rem;
        padding: 0.5rem 0.75rem;
        width: 100%;
        color: var(--text-primary);
        transition: border-color 150ms ease-in-out, box-shadow 150ms ease-in-out;
    }
    .form-input:focus {
        outline: none;
        border-color: var(--text-brand);
        box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.4);
    }
    .form-input-sm {
        background-color: var(--bg-tertiary);
        border: 1px solid var(--border-color);
        border-radius: 0.375rem;
        padding: 0.25rem 0.5rem;
        width: 100%;
        font-size: 0.875rem;
        line-height: 1.25rem;
        color: var(--text-primary);
        transition: border-color 150ms ease-in-out, box-shadow 150ms ease-in-out;
    }
    .form-input-sm:focus {
        outline: none;
        border-color: var(--text-brand);
        box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.4);
    }
    .form-checkbox {
        appearance: none;
        background-color: var(--bg-tertiary);
        border: 1px solid var(--border-color);
        border-radius: 0.25rem;
        width: 1.25rem;
        height: 1.25rem;
        position: relative;
        cursor: pointer;
        vertical-align: middle;
        flex-shrink: 0;
    }
    .form-checkbox:checked {
        background-color: var(--text-brand);
        border-color: var(--text-brand);
    }
    .form-checkbox:checked::after {
        content: '✔';
        position: absolute;
        color: white;
        font-size: 0.875rem;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    /* Step Circle for Instructions */
    .step-circle {
        background-color: var(--bg-tertiary);
        border-radius: 9999px;
        width: 1.75rem;
        height: 1.75rem;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        color: var(--text-primary);
        flex-shrink: 0;
    }

    /* Modal Styles */
    .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(0, 0, 0, 0.7); display: flex; align-items: center; justify-content: center; z-index: 50; }
    .modal-content { position: relative; background-color: var(--bg-secondary); padding: 1.5rem; border-radius: 1rem; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04); width: 100%; max-width: 28rem; border: 1px solid var(--border-color); }
    .modal-close-btn { position: absolute; top: 0.5rem; right: 0.5rem; color: #9ca3af; }
    .modal-close-btn:hover { color: #1f2937; }

    /* Toast Notification Styles */
    .toast-notification { position: fixed; bottom: 1.5rem; left: 50%; transform: translateX(-50%); z-index: 100; animation: fadeInOut 4s ease-in-out; }
    @keyframes fadeInOut { 0%, 100% { opacity: 0; transform: translate(-50%, 1rem); } 10%, 90% { opacity: 1; transform: translate(-50%, 0); } }

    /* Custom Scrollbar for Dark Theme */
    .custom-scrollbar::-webkit-scrollbar { width: 8px; height: 8px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: var(--bg-secondary); border-radius: 10px; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: var(--bg-tertiary); border-radius: 10px; }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: var(--border-color); }
    
    /* Generated CSS */
    .self-center { align-self: center; } .flex-auto { flex: 1 1 auto; } .mx-auto { margin-left: auto; margin-right: auto; } .last\\:border-b-0:last-child { border-bottom-width: 0px; } .block { display: block; } .hidden { display: none !important; } .min-h-0 { min-height: 0px; } .min-w-0 { min-width: 0px; } .min-w-full { min-width: 100%; } .min-h-screen { min-height: 100vh; } .flex { display: flex; } .flex-wrap { flex-wrap: wrap; } .items-center { align-items: center; } .items-end { align-items: flex-end; } .items-start { align-items: flex-start; } .justify-center { justify-content: center; } .justify-between { justify-content: space-between; } .justify-end { justify-content: flex-end; } .justify-start { justify-content: flex-start; } .truncate { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; } .break-words { overflow-wrap: break-word; } .capitalize { text-transform: capitalize; } .p-1\\.5 { padding: 0.375rem; } .p-2 { padding: 0.5rem; } .p-4 { padding: 1rem; } .p-6 { padding: 1.5rem; } .p-3 { padding: 0.75rem; } .px-4 { padding-left: 1rem; padding-right: 1rem; } .py-0\\.5 { padding-top: 0.125rem; padding-bottom: 0.125rem; } .py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; } .py-4 { padding-top: 1rem; padding-bottom: 1rem; } .px-6 { padding-left: 1.5rem; padding-right: 1.5rem; } .pr-2 { padding-right: 0.5rem; } .mb-1 { margin-bottom: 0.25rem; } .mb-4 { margin-bottom: 1rem; } .mt-1 { margin-top: 0.25rem; } .mt-2 { margin-top: 0.5rem; } .mt-3 { margin-top: 0.75rem; } .mt-4 { margin-top: 1rem; } .mt-6 { margin-top: 1.5rem; } .mt-8 { margin-top: 2rem; } .leading-tight { line-height: 1.25; } .w-10 { width: 2.5rem; } .h-10 { height: 2.5rem; } .w-7 { width: 1.75rem; } .h-7 { height: 1.75rem; } .w-6 { width: 1.5rem; } .h-6 { height: 1.5rem; } .w-5 { width: 1.25rem; } .h-5 { height: 1.5rem; } .w-auto { width: auto; } .w-full { width: 100%; } .w-40 { width: 10rem; } .w-36 { width: 9rem; } .w-32 { width: 8rem; } .w-28 { width: 7rem; } .flex-1 { flex: 1 1 0%; } .flex-col { flex-direction: column; } .flex-shrink-0 { flex-shrink: 0; } .animate-spin { animation: spin 1s linear infinite; } @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } } .text-blue-500 { color: #3b82f6; } .text-blue-400 { color: #60a5fa; } .text-white { color: #ffffff; } .text-gray-200 { color: #e5e7eb; } .text-gray-300 { color: #d1d5db; } .text-gray-400 { color: #9ca3af; } .text-green-400 { color: #4ade80; } .text-red-400 { color: #f87171; } .text-yellow-400 { color: #facc15; } .bg-gray-800 { background-color: #1f2937; } .bg-gray-900 { background-color: #111827; } .bg-gray-700 { background-color: #374151; } .hover\\:bg-gray-700\\/50:hover { background-color: rgba(55, 65, 81, 0.5); } .hover\\:bg-gray-700:hover { background-color: #374151; } .hover\\:bg-gray-600:hover { background-color: #4b5563; } .bg-blue-600 { background-color: #2563eb; } .hover\\:bg-blue-700:hover { background-color: #1d4ed8; } .bg-red-500 { background-color: #ef4444; } .bg-red-600 { background-color: #dc2626; } .hover\\:bg-red-700:hover { background-color: #b91c1c; } .bg-green-500 { background-color: #22c55e; } .bg-green-600 { background-color: #16a34a; } .hover\\:bg-green-700:hover { background-color: #15803d; } .rounded-2xl { border-radius: 1rem; } .rounded-xl { border-radius: 0.75rem; } .rounded-full { border-radius: 9999px; } .rounded-lg { border-radius: 0.5rem; } .rounded-md { border-radius: 0.375rem; } .shadow-lg { box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05); } .shadow-sm { box-shadow: 0 1px 2px 0 rgba(0,0,0,0.05); } .text-center { text-align: center; } .text-right { text-align: right; } .font-bold { font-weight: 700; } .font-semibold { font-weight: 600; } .font-medium { font-weight: 500; } .text-3xl { font-size: 1.875rem; line-height: 2.25rem; } .text-2xl { font-size: 1.5rem; line-height: 2rem; } .text-xl { font-size: 1.25rem; line-height: 1.75rem; } .text-lg { font-size: 1.125rem; line-height: 1.75rem; } .text-base { font-size: 1rem; line-height: 1.5rem; } .text-sm { font-size: 0.875rem; line-height: 1.25rem; } .text-xs { font-size: 0.75rem; line-height: 1rem; } .gap-1\\.5 { gap: 0.375rem; } .gap-2 { gap: 0.5rem; } .gap-3 { gap: 0.75rem; } .gap-4 { gap: 1rem; } .gap-6 { gap: 1.5rem; } .gap-8 { gap: 2rem; } .gap-x-4 { column-gap: 1rem; } .gap-y-2 { row-gap: 0.5rem; } .space-y-0 > :not([hidden]) ~ :not([hidden]) { margin-top: 0; } .space-y-2 > :not([hidden]) ~ :not([hidden]) { margin-top: 0.5rem; } .space-y-3 > :not([hidden]) ~ :not([hidden]) { margin-top: 0.75rem; } .space-y-4 > :not([hidden]) ~ :not([hidden]) { margin-top: 1rem; } .space-y-8 > :not([hidden]) ~ :not([hidden]) { margin-top: 2rem; } .space-y-10 > :not([hidden]) ~ :not([hidden]) { margin-top: 2.5rem; } .space-y-12 > :not([hidden]) ~ :not([hidden]) { margin-top: 3rem; } .border { border-width: 1px; } .border-t { border-top-width: 1px; } .border-b { border-bottom-width: 1px; } .border-gray-700 { border-color: #374151; } .border-gray-600 { border-color: #4b5563; } .focus\\:ring-2:focus { --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color); --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color); box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000); } .focus\\:ring-blue-500:focus { --tw-ring-color: #3b82f6; } .transition-colors { transition-property: color, background-color, border-color, text-decoration-color, fill, stroke; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; } .disabled\\:opacity-50:disabled { opacity: 0.5; } .disabled\\:bg-gray-700:disabled { background-color: #374151; } .max-h-80 { max-height: 20rem; } .max-h-96 { max-height: 24rem; } .overflow-y-auto { overflow-y: auto; } .overflow-x-auto { overflow-x: auto; } .grid { display: grid; } .grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); } .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); } .grid-cols-entry-item { grid-template-columns: 1fr auto; }
    @media (min-width: 768px) { .md\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); } .md\\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); } .md\\:grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); } .md\\:grid-cols-5 { grid-template-columns: repeat(5, minmax(0, 1fr)); } .md\\:p-8 { padding: 2rem; } .md\\:flex-row { flex-direction: row; } .md\\:items-start { align-items: flex-start; } .md\\:w-64 { width: 16rem; } .md\\:flex-shrink-0 { flex-shrink: 0; } .md\\:space-y-10 > :not([hidden]) ~ :not([hidden]) { margin-top: 2.5rem; } .md\\:space-y-12 > :not([hidden]) ~ :not([hidden]) { margin-top: 3rem; } }
    @media (min-width: 1024px) { .lg\\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); } .lg\\:gap-8 { gap: 2rem; } }
    `}</style>
);

export default TailwindStyles;