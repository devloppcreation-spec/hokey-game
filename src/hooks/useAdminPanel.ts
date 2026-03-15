/**
 * useAdminPanel Hook
 *
 * Manages admin panel state: open/closed, pending changes tracking,
 * undo/redo history, auto-save, and keyboard shortcuts.
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import type { BrandConfig, PartialBrandConfig } from '@/types/brand.types';
import { useBrandStore } from '@/store/brandStore';

export type AdminTab = 'quick-switch' | 'colors' | 'typography' | 'logos' | 'game' | 'sounds' | 'export';

export interface UseAdminPanelReturn {
    isOpen: boolean;
    open: () => void;
    close: () => void;
    toggle: () => void;

    activeTab: AdminTab;
    setActiveTab: (tab: AdminTab) => void;

    pendingChanges: PartialBrandConfig | null;
    hasUnsavedChanges: boolean;
    applyChanges: () => void;
    resetChanges: () => void;
    updatePending: (changes: PartialBrandConfig) => void;

    undo: () => void;
    redo: () => void;
    canUndo: boolean;
    canRedo: boolean;

    autoSave: boolean;
    setAutoSave: (v: boolean) => void;

    lastSavedAt: Date | null;
    searchQuery: string;
    setSearchQuery: (q: string) => void;
}

const MAX_HISTORY = 30;

export function useAdminPanel(): UseAdminPanelReturn {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<AdminTab>('quick-switch');
    const [pendingChanges, setPendingChanges] = useState<PartialBrandConfig | null>(null);
    const [autoSave, setAutoSave] = useState(false);
    const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Undo/redo stacks
    const undoStack = useRef<PartialBrandConfig[]>([]);
    const redoStack = useRef<PartialBrandConfig[]>([]);
    const [canUndo, setCanUndo] = useState(false);
    const [canRedo, setCanRedo] = useState(false);

    const store = useBrandStore();

    const open = useCallback(() => setIsOpen(true), []);
    const close = useCallback(() => {
        if (pendingChanges) {
            const confirmed = window.confirm('You have unsaved changes. Close anyway?');
            if (!confirmed) return;
        }
        setIsOpen(false);
    }, [pendingChanges]);
    const toggle = useCallback(() => {
        if (isOpen) close();
        else open();
    }, [isOpen, close, open]);

    const hasUnsavedChanges = pendingChanges !== null;

    const updatePending = useCallback((changes: PartialBrandConfig) => {
        setPendingChanges((prev) => {
            // Push current state to undo stack
            if (prev) {
                undoStack.current.push(prev);
                if (undoStack.current.length > MAX_HISTORY) undoStack.current.shift();
            }
            redoStack.current = [];
            setCanUndo(true);
            setCanRedo(false);

            return { ...prev, ...changes } as PartialBrandConfig;
        });
    }, []);

    const applyChanges = useCallback(() => {
        if (!pendingChanges) return;
        store.updateBrandPartial(pendingChanges as Partial<BrandConfig>);
        store.saveBrand(store.currentBrand);
        setPendingChanges(null);
        undoStack.current = [];
        redoStack.current = [];
        setCanUndo(false);
        setCanRedo(false);
        setLastSavedAt(new Date());
    }, [pendingChanges, store]);

    const resetChanges = useCallback(() => {
        setPendingChanges(null);
        undoStack.current = [];
        redoStack.current = [];
        setCanUndo(false);
        setCanRedo(false);
    }, []);

    const undo = useCallback(() => {
        if (undoStack.current.length === 0) return;
        const prev = undoStack.current.pop()!;
        if (pendingChanges) {
            redoStack.current.push(pendingChanges);
        }
        setPendingChanges(prev);
        setCanUndo(undoStack.current.length > 0);
        setCanRedo(true);
    }, [pendingChanges]);

    const redo = useCallback(() => {
        if (redoStack.current.length === 0) return;
        const next = redoStack.current.pop()!;
        if (pendingChanges) {
            undoStack.current.push(pendingChanges);
        }
        setPendingChanges(next);
        setCanRedo(redoStack.current.length > 0);
        setCanUndo(true);
    }, [pendingChanges]);

    // Auto-save
    useEffect(() => {
        if (!autoSave || !pendingChanges) return;
        const timer = setTimeout(() => {
            applyChanges();
        }, 1500);
        return () => clearTimeout(timer);
    }, [autoSave, pendingChanges, applyChanges]);

    // Keyboard shortcuts
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            // Escape to close
            if (e.key === 'Escape' && isOpen) {
                close();
                e.preventDefault();
            }
            // Ctrl+S / Cmd+S to save
            if ((e.ctrlKey || e.metaKey) && e.key === 's' && isOpen) {
                e.preventDefault();
                applyChanges();
            }
            // Ctrl+Z to undo
            if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey && isOpen) {
                e.preventDefault();
                undo();
            }
            // Ctrl+Shift+Z to redo
            if ((e.ctrlKey || e.metaKey) && e.key === 'z' && e.shiftKey && isOpen) {
                e.preventDefault();
                redo();
            }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [isOpen, close, applyChanges, undo, redo]);

    return {
        isOpen, open, close, toggle,
        activeTab, setActiveTab,
        pendingChanges, hasUnsavedChanges,
        applyChanges, resetChanges, updatePending,
        undo, redo, canUndo, canRedo,
        autoSave, setAutoSave,
        lastSavedAt, searchQuery, setSearchQuery,
    };
}
