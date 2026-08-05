import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Image as ImageIcon, Upload, Loader2 } from "lucide-react";

export default function LeadershipImageManager() {
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    base44.settings.about.get()
      .then((s) => setImageUrl(s?.leadership_image_url || ""))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleUpload = async (file) => {
    setError("");
    setSaved(false);
    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setImageUrl(file_url);
    } catch (err) {
      setError(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setError("");
    setSaved(false);
    setSaving(true);
    try {
      await base44.settings.about.update({ leadership_image_url: imageUrl });
      setSaved(true);
    } catch (err) {
      setError(err.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="nb-card p-6 mb-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-navy border-2 border-graphite flex items-center justify-center">
          <ImageIcon className="w-5 h-5 text-signal" />
        </div>
        <h3 className="font-heading text-graphite text-lg uppercase">Leadership Section Image</h3>
      </div>
      <p className="font-mono text-xs text-muted-foreground mb-4">
        The photo shown beside the National Board of Directors on the About page.
      </p>

      {error && (
        <div className="mb-4 border-2 border-destructive bg-destructive/10 px-4 py-3 font-mono text-xs text-destructive">
          {error}
        </div>
      )}
      {saved && (
        <div className="mb-4 border-2 border-azure bg-azure/10 px-4 py-3 font-mono text-xs text-azure">
          Saved. The About page now shows this image.
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4 items-start">
          <div className="border-2 border-graphite h-48 flex items-center justify-center bg-muted overflow-hidden">
            {imageUrl ? (
              <img src={imageUrl} alt="Leadership section preview" className="w-full h-full object-cover" />
            ) : (
              <span className="font-mono text-xs text-muted-foreground uppercase">No image set</span>
            )}
          </div>
          <div className="flex flex-col gap-3">
            <label className="border-2 border-dashed border-graphite p-4 flex items-center gap-2 cursor-pointer hover:bg-muted transition-colors">
              {uploading ? <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" /> : <Upload className="w-4 h-4 text-muted-foreground" />}
              <span className="font-mono text-xs text-muted-foreground">{uploading ? "Uploading…" : "Click to upload a new image"}</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={uploading}
                onChange={(e) => e.target.files[0] && handleUpload(e.target.files[0])}
              />
            </label>
            <button
              onClick={handleSave}
              disabled={saving || uploading}
              className="nb-btn bg-navy text-signal px-6 py-3 text-xs disabled:opacity-60 self-start"
            >
              {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving…</> : "Save Image"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
