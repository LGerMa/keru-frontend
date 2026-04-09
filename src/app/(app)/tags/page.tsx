"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";
import { toast } from "sonner";
import { useTags, createTag, updateTag, deleteTag } from "@/hooks/use-tags";
import { EmptyState } from "@/components/app/empty-state";
import type { Tag } from "@/types/tag";

const PRESET_COLORS = [
  "#EF4444", "#F97316", "#F59E0B", "#22C55E",
  "#10B981", "#3B82F6", "#8B5CF6", "#EC4899",
  "#6B7280", "#14B8A6",
];

interface TagFormState {
  name: string;
  color: string;
}

const DEFAULT_FORM: TagFormState = { name: "", color: "#3B82F6" };

export default function TagsPage() {
  const { tags, isLoading, error, refetch } = useTags();

  // create dialog
  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState<TagFormState>(DEFAULT_FORM);
  const [isCreating, setIsCreating] = useState(false);

  // edit dialog
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [editForm, setEditForm] = useState<TagFormState>(DEFAULT_FORM);
  const [isSaving, setIsSaving] = useState(false);

  // delete
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!createForm.name.trim()) { toast.error("Name is required"); return; }
    setIsCreating(true);
    try {
      await createTag({ name: createForm.name.trim(), color: createForm.color });
      toast.success("Tag created");
      setShowCreate(false);
      setCreateForm(DEFAULT_FORM);
      refetch();
    } catch (err) {
      toast.error((err as Error).message ?? "Could not create tag");
    } finally {
      setIsCreating(false);
    }
  }

  function openEdit(tag: Tag) {
    setEditingTag(tag);
    setEditForm({ name: tag.name, color: tag.color });
  }

  async function handleEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editingTag) return;
    if (!editForm.name.trim()) { toast.error("Name is required"); return; }
    setIsSaving(true);
    try {
      await updateTag(editingTag.id, { name: editForm.name.trim(), color: editForm.color });
      toast.success("Tag updated");
      setEditingTag(null);
      refetch();
    } catch (err) {
      toast.error((err as Error).message ?? "Could not update tag");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      await deleteTag(id);
      toast.success("Tag deleted");
      refetch();
    } catch (err) {
      toast.error((err as Error).message ?? "Could not delete tag");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="pt-6">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-lg font-bold tracking-tight">Tags</h1>
        <button
          onClick={() => { setShowCreate(true); setCreateForm(DEFAULT_FORM); }}
          className="flex items-center gap-1 text-xs text-primary font-semibold"
        >
          <Plus size={14} />
          New tag
        </button>
      </div>

      {isLoading && (
        <div className="flex justify-center pt-10">
          <div className="w-5 h-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}

      {!isLoading && !error && tags.length === 0 && (
        <EmptyState
          title="No tags yet"
          description="Create tags to categorize your expenses and income"
          action={
            <button
              onClick={() => setShowCreate(true)}
              className="text-xs text-primary underline underline-offset-4"
            >
              Create your first tag
            </button>
          }
        />
      )}

      {!isLoading && tags.length > 0 && (
        <div className="flex flex-col gap-2">
          {tags.map((tag) => (
            <div
              key={tag.id}
              className="bg-card rounded-2xl shadow-card-sm border border-border flex items-center gap-3 px-4 py-3"
            >
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: tag.color }}
              />
              <span className="flex-1 text-sm font-semibold" style={{ color: tag.color }}>
                {tag.name}
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => openEdit(tag)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Edit"
                >
                  <Pencil size={15} />
                </button>
                <button
                  onClick={() => handleDelete(tag.id)}
                  disabled={deletingId === tag.id}
                  className="text-destructive disabled:opacity-40"
                  aria-label="Delete"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create dialog */}
      {showCreate && (
        <Dialog title="New tag" onClose={() => setShowCreate(false)}>
          <TagForm
            form={createForm}
            onChange={setCreateForm}
            onSubmit={handleCreate}
            onCancel={() => setShowCreate(false)}
            isSubmitting={isCreating}
            submitLabel="Create"
          />
        </Dialog>
      )}

      {/* Edit dialog */}
      {editingTag && (
        <Dialog title="Edit tag" onClose={() => setEditingTag(null)}>
          <TagForm
            form={editForm}
            onChange={setEditForm}
            onSubmit={handleEdit}
            onCancel={() => setEditingTag(null)}
            isSubmitting={isSaving}
            submitLabel="Save"
          />
        </Dialog>
      )}
    </div>
  );
}

function Dialog({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-md bg-background rounded-t-2xl px-5 pt-5 pb-10 shadow-xl">
        {/* drag handle */}
        <div className="w-10 h-1 rounded-full bg-muted mx-auto mb-4" />
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm font-semibold">{title}</p>
          <button onClick={onClose} className="text-muted-foreground p-1 -mr-1">
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function TagForm({
  form,
  onChange,
  onSubmit,
  onCancel,
  isSubmitting,
  submitLabel,
}: {
  form: TagFormState;
  onChange: (f: TagFormState) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  submitLabel: string;
}) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div>
        <label className="text-xs text-muted-foreground mb-1 block">Name</label>
        <input
          type="text"
          placeholder="e.g. Food"
          value={form.name}
          onChange={(e) => onChange({ ...form, name: e.target.value })}
          className="w-full border rounded-xl px-4 py-3 text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
          autoFocus
        />
      </div>

      <div>
        <label className="text-xs text-muted-foreground mb-2 block">Color</label>
        <div className="flex flex-wrap gap-2">
          {PRESET_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => onChange({ ...form, color: c })}
              className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: c }}
            >
              {form.color === c && <Check size={12} color="#fff" strokeWidth={3} />}
            </button>
          ))}
        </div>

        {/* Preview */}
        <div className="mt-3 flex items-center gap-2">
          <span
            className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium"
            style={{ color: form.color, backgroundColor: `${form.color}20` }}
          >
            {form.name || "Preview"}
          </span>
        </div>
      </div>

      <div className="flex gap-3 mt-1">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 border rounded-xl py-3 text-sm font-medium"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-primary text-primary-foreground rounded-xl py-3 text-sm font-medium disabled:opacity-50"
        >
          {isSubmitting ? "Saving…" : submitLabel}
        </button>
      </div>
    </form>
  );
}
