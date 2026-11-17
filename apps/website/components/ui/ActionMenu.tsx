'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ActionMenuProps {
  role: 'admin' | 'host' | 'user';
  onApprove?: () => void;
  onReject?: () => void;
  onStatusChange?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onDownloadInvoice?: () => void;
}

export function ActionMenu({ 
  role,
  onApprove, 
  onReject, 
  onStatusChange, 
  onEdit, 
  onDelete, 
  onDownloadInvoice 
}: ActionMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!open) return;
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open]);

  // تحديد العناصر حسب الدور
  const getMenuItems = () => {
    const items = [];

    if (role === 'admin') {
      if (onApprove) items.push({ label: 'Approve', onClick: onApprove, className: 'text-green-700' });
      if (onReject) items.push({ label: 'Reject', onClick: onReject, className: 'text-red-700' });
      if (onStatusChange) items.push({ label: 'Change Status', onClick: onStatusChange, className: 'text-purple-700' });
      if (onEdit) items.push({ label: 'Edit', onClick: onEdit, className: 'text-gray-800' });
      if (onDelete) items.push({ label: 'Delete', onClick: onDelete, className: 'text-red-600' });
      if (onDownloadInvoice) items.push({ label: 'Download Invoice', onClick: onDownloadInvoice, className: 'text-purple-800' });
    } else if (role === 'host') {
      if (onEdit) items.push({ label: 'Edit', onClick: onEdit, className: 'text-gray-800' });
      if (onDelete) items.push({ label: 'Delete', onClick: onDelete, className: 'text-red-600' });
      if (onDownloadInvoice) items.push({ label: 'Download Invoice', onClick: onDownloadInvoice, className: 'text-purple-800' });
    }
    // يمكن إضافة أدوار أخرى هنا مثل 'moderator', 'user' إلخ

    return items;
  };

  const menuItems = getMenuItems();

  // إذا لم تكن هناك عناصر للعرض، لا نعرض القائمة
  if (menuItems.length === 0) {
    return null;
  }

  return (
    <div ref={menuRef} className='relative'>
      <button
        type='button'
        aria-haspopup='menu'
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className='inline-flex items-center justify-center rounded-full bg-purple-600 hover:bg-purple-700 text-white shadow px-3 py-1 text-xs'
      >
        Manage
      </button>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            role='menu'
            className='absolute right-0 mt-2 w-44 rounded-lg border border-purple-100 bg-white shadow-xl z-30 p-1'
          >
            {menuItems.map((item, index) => (
              <li key={index}>
                <button 
                  role='menuitem' 
                  onClick={() => { 
                    setOpen(false); 
                    item.onClick?.(); 
                  }} 
                  className={`w-full text-left px-3 py-2 rounded-md hover:bg-purple-50 text-sm ${item.className}`}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
    </div>
  );
}
