import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Plus, Trash2, Pencil, Loader2, Upload, X } from "lucide-react";

export default function AdminCrudManager({ entityName, title, fields, icon: Icon }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(buildEmptyForm(fields));

  function buildEmptyForm(flds) {
    const obj = {};
    flds.forEach(f => { obj[f.key] = ""; });
    return obj;
  }

  const loadRecords = async () => {
    setLoading(true);
    try {
      const sortField = fields.find(f => f.type === "date" && f.sortBy)?.key || "created_date";
      const data = await base44.entities[entityName].list(`-${sortField}`, 50);
      setRecords(data);
    } catch {
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecords();
  }, []);

  const openAddForm = () => {
    setEditingId(null);
    setForm(buildEmptyForm(fields));
    setShowForm(true);
  };

  const openEditForm = (rec) => {
    const next = {};
    fields.forEach(f => { next[f.key] = rec[f.key] ?? ""; });
    setEditingId(rec.id);
    setForm(next);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(buildEmptyForm(fields));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = { ...form };
      fields.forEach(f => {
        if (f.type === "date" && payload[f.key]) payload[f.key] = payload[f.key];
        if ((payload[f.key] === "" || payload[f.key] === null) && !f.required) {
          delete payload[f.key];
        }
      });
      if (editingId) {
        await base44.entities[entityName].update(editingId, payload);
      } else {
        await base44.entities[entityName].create(payload);
      }
      closeForm();
      await loadRecords();
    } catch (err) {
      alert(err.message || "Failed to save record");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this record? This cannot be undone.")) return;
    try {
      await base44.entities[entityName].delete(id);
      if (editingId === id) closeForm();
      await loadRecords();
    } catch (err) {
      alert(err.message || "Failed to delete record");
    }
  };

  const handleFileUpload = async (key, file) => {
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setForm(prev => ({ ...prev, [key]: file_url }));
    } catch (err) {
      alert("File upload failed: " + (err.message || "Unknown error"));
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          {Icon && <div className="w-10 h-10 bg-navy border-2 border-graphite flex items-center justify-center"><Icon className="w-5 h-5 text-signal" /></div>}
          <h3 className="font-heading text-graphite text-xl uppercase">{title}</h3>
          <span className="font-mono text-xs text-muted-foreground">({records.length})</span>
        </div>
        <button
          onClick={() => (showForm ? closeForm() : openAddForm())}
          className="nb-btn bg-azure text-navy px-4 py-2 text-xs"
        >
          {showForm ? <><X className="w-4 h-4 mr-1" />Close</> : <><Plus className="w-4 h-4 mr-1" />Add New</>}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="nb-card p-6 mb-6">
          <div className="font-mono text-xs uppercase tracking-widest text-azure mb-4">
            {editingId ? "// Editing Record" : "// New Record"}
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {fields.map(f => (
              <div key={f.key} className={f.type === "textarea" ? "sm:col-span-2" : ""}>
                <label className="font-mono text-xs uppercase tracking-widest text-graphite block mb-2">
                  {f.label}{f.required && <span className="text-azure">*</span>}
                </label>
                {f.type === "textarea" ? (
                  <textarea
                    value={form[f.key]}
                    onChange={(e) => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                    required={f.required}
                    rows={3}
                    className="w-full border-2 border-graphite px-3 py-2 bg-signal font-body text-sm outline-none"
                  />
                ) : f.type === "select" ? (
                  <select
                    value={form[f.key]}
                    onChange={(e) => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                    required={f.required}
                    className="w-full border-2 border-graphite px-3 py-2 bg-signal font-mono text-sm outline-none"
                  >
                    <option value="">— Select —</option>
                    {f.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                ) : f.type === "file" ? (
                  <div className="border-2 border-dashed border-graphite p-4">
                    {form[f.key] ? (
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs text-azure truncate max-w-[200px]">File uploaded ✓</span>
                        <button type="button" onClick={() => setForm(prev => ({ ...prev, [f.key]: "" }))} className="font-mono text-xs text-destructive">Remove</button>
                      </div>
                    ) : (
                      <label className="flex items-center gap-2 cursor-pointer">
                        <Upload className="w-4 h-4 text-muted-foreground" />
                        <span className="font-mono text-xs text-muted-foreground">Click to upload</span>
                        <input
                          type="file"
                          className="hidden"
                          onChange={(e) => e.target.files[0] && handleFileUpload(f.key, e.target.files[0])}
                        />
                      </label>
                    )}
                  </div>
                ) : (
                  <input
                    type={f.type === "date" ? "date" : "text"}
                    value={form[f.key]}
                    onChange={(e) => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                    required={f.required}
                    placeholder={f.placeholder || ""}
                    className="w-full border-2 border-graphite px-3 py-2 bg-signal font-mono text-sm outline-none"
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-3 mt-4">
            <button type="submit" disabled={submitting} className="nb-btn bg-navy text-signal px-6 py-3 text-xs disabled:opacity-60">
              {submitting ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" />{editingId ? "Updating…" : "Saving…"}</>
              ) : (
                editingId ? "Update Record" : "Save Record"
              )}
            </button>
            {editingId && (
              <button type="button" onClick={closeForm} className="font-mono text-xs uppercase text-muted-foreground hover:text-graphite">
                Cancel
              </button>
            )}
          </div>
        </form>
      )}

      {loading ? (
        <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
      ) : records.length === 0 ? (
        <div className="border-2 border-dashed border-graphite p-8 text-center font-mono text-xs uppercase text-muted-foreground">
          No records found. Click "Add New" to create one.
        </div>
      ) : (
        <div className="space-y-2">
          {records.map(rec => (
            <div key={rec.id} className="border-2 border-graphite flex items-start justify-between gap-4 p-4 hover:bg-muted transition-colors">
              <div className="flex-1 min-w-0">
                <div className="font-heading text-graphite text-sm uppercase truncate">{rec[fields[0].key] || "Untitled"}</div>
                <div className="flex flex-wrap gap-3 mt-1">
                  {fields.slice(1, 4).map(f => (
                    rec[f.key] && <span key={f.key} className="font-mono text-[10px] text-muted-foreground uppercase">{f.label}: {String(rec[f.key]).slice(0, 40)}</span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => openEditForm(rec)}
                  className="border-2 border-graphite text-graphite p-2 hover:bg-navy hover:text-signal hover:border-navy transition-colors"
                  aria-label="Edit"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(rec.id)}
                  className="border-2 border-destructive text-destructive p-2 hover:bg-destructive hover:text-signal transition-colors"
                  aria-label="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
