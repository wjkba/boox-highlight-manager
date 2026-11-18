import { useState } from "react";
import { type NewHighlight } from "@/lib/db/types";
import { Link, useNavigate } from "react-router-dom";
import Button from "@/components/ui/button";
import {
  errorTextClasses,
  fieldClasses,
  labelClasses,
  metaTextClasses,
  sectionTitleClasses,
} from "@/components/ui/styles";
import { importHighlights } from "../api";
import { parseBooxFile } from "../sources";

const MAX_FILE_SIZE = 5242880;

export default function UploadBoox() {
  const [file, setFile] = useState<File | null>(null);
  const [parsed, setParsed] = useState<NewHighlight[] | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const navigate = useNavigate();

  async function upload(event: React.FormEvent<HTMLButtonElement>) {
    event.preventDefault(); setError(null);
    if (!file || file.size > MAX_FILE_SIZE || (file.type && file.type !== "text/plain")) {
      setError("Select a plain-text Boox annotations file no larger than 5 MB."); return;
    }
    setBusy(true);
    try {
      const result = await parseBooxFile(file);
      if (!result.highlights.length) throw new Error("No highlights found. Check that this is a Boox annotations TXT export.");
      setParsed(result.highlights); setTitle(result.bookTitle); setAuthor(result.bookAuthor); setConfirming(true);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not parse the Boox file. Check its format and try again.");
    } finally { setBusy(false); }
  }

  async function confirm(event: React.FormEvent<HTMLButtonElement>) {
    event.preventDefault(); setError(null);
    if (!parsed || !title.trim()) { setError("Enter a book title before confirming."); return; }
    setBusy(true);
    try {
      const duplicate = await importHighlights(title, author, parsed);
      setMessage(duplicate ? "Updated highlights for existing book." : "Added new highlights.");
      setConfirming(false); setCompleted(true);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not save these highlights. Try again.");
    } finally { setBusy(false); }
  }

  if (confirming) return <form className="grid gap-4">
    <div>
      <h2 className={sectionTitleClasses}>Confirm Boox import</h2>
      <p className={metaTextClasses}>Detected {parsed?.length ?? 0} highlights. Check the details before saving.</p>
    </div>
    <div>
      <label htmlFor="boox-title" className={labelClasses}>Book title</label>
      <input id="boox-title" value={title} onChange={(e) => setTitle(e.target.value)} className={fieldClasses} />
    </div>
    <div>
      <label htmlFor="boox-author" className={labelClasses}>Book author</label>
      <input id="boox-author" value={author} onChange={(e) => setAuthor(e.target.value)} className={fieldClasses} />
    </div>
    {error && <p className={errorTextClasses} role="alert">{error}</p>}
    <Button type="submit" onClick={confirm} disabled={busy} className="w-full" text={busy ? "Saving…" : "Save highlights"} />
  </form>;

  if (completed) return <div className="grid gap-4">
    <div>
      <output className={`${sectionTitleClasses} block`}>{message}</output>
      <p className={metaTextClasses}>You can continue importing or view your highlights.</p>
    </div>
    <div className="grid grid-cols-2 gap-2"><Button text="Import another" onClick={() => { setCompleted(false); setFile(null); }} /><Button text="View highlights" onClick={() => navigate("/all")} /></div>
  </div>;

  return <form className="grid gap-4">
    <div>
      <h2 className={sectionTitleClasses}>Boox annotations</h2>
      <p className={metaTextClasses}>The TXT file Boox exports from a book’s annotations. <Link to="/help" className="underline">How to export it</Link></p>
    </div>
    <div>
      <label htmlFor="boox-file" className={labelClasses}>Annotations file (.txt)</label>
      <input id="boox-file" className="w-full" onChange={(e) => { setFile(e.target.files?.[0] ?? null); setError(null); }} type="file" accept=".txt,text/plain" />
    </div>
    {error && <p className={errorTextClasses} role="alert">{error}</p>}
    <Button text={busy ? "Reading file…" : "Upload"} onClick={upload} disabled={busy} className="w-full" />
  </form>;
}
