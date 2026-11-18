import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/ui/button";
import {
  errorTextClasses,
  fieldClasses,
  labelClasses,
  metaTextClasses,
  sectionTitleClasses,
} from "@/components/ui/styles";
import type { NewHighlight } from "@/lib/db/types";
import { importHighlights } from "../api";
import { parseKoreaderFile } from "../sources";

const MAX_FILE_SIZE = 5242880;

export default function UploadKoreader() {
  const [file, setFile] = useState<File | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isBusy, setIsBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [bookTitle, setBookTitle] = useState("");
  const [bookAuthor, setBookAuthor] = useState("");
  const [uploadedHighlights, setUploadedHighlights] = useState<NewHighlight[] | null>(null);
  const navigate = useNavigate();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFile(event.target.files?.[0] ?? null);
    setErrorMessage(null);
  };

  const isValidFile = file !== null && file.size <= MAX_FILE_SIZE &&
    (!file.type || file.type === "application/json" || file.name.toLowerCase().endsWith(".json"));

  const handleUpload = async (event: React.FormEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (!file || !isValidFile) {
      setErrorMessage("Invalid file. Select a JSON file no larger than 5 MB.");
      return;
    }

    try {
      setIsBusy(true);
      const result = await parseKoreaderFile(file);
      if (!result.highlights.length) throw new Error("No highlights found. Check that this is a KOReader highlights JSON export.");
      setUploadedHighlights(result.highlights);
      setBookTitle(result.bookTitle);
      setBookAuthor(result.bookAuthor);
      setIsConfirming(true);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Something went wrong.");
    } finally {
      setIsBusy(false);
    }
  };

  const handleConfirm = async (event: React.FormEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (!uploadedHighlights) return;

    try {
      setIsBusy(true);
      const duplicate = await importHighlights(bookTitle, bookAuthor, uploadedHighlights);
      setMessage(duplicate ? "Updated highlights for existing book" : "Added new highlights");
      setIsConfirming(false);
      setIsCompleted(true);
    } catch {
      setErrorMessage("Could not save these highlights. Check the book details and try again.");
    } finally {
      setIsBusy(false);
    }
  };

  if (isConfirming) {
    return (
      <form className="grid gap-4">
        <div>
          <h2 className={sectionTitleClasses}>Confirm KOReader import</h2>
          <p className={metaTextClasses}>Detected {uploadedHighlights?.length ?? 0} highlights. Check the details before saving.</p>
        </div>
        <div>
          <label htmlFor="koreader-book-title" className={labelClasses}>Book title</label>
          <input
            id="koreader-book-title"
            value={bookTitle}
            onChange={(event) => setBookTitle(event.target.value)}
            className={fieldClasses}
          />
        </div>
        <div>
          <label htmlFor="koreader-book-author" className={labelClasses}>Book author</label>
          <input
            id="koreader-book-author"
            value={bookAuthor}
            onChange={(event) => setBookAuthor(event.target.value)}
            className={fieldClasses}
          />
        </div>
        {errorMessage && <p className={errorTextClasses} role="alert">{errorMessage}</p>}
        <Button type="submit" onClick={handleConfirm} disabled={isBusy} className="w-full" text={isBusy ? "Saving…" : "Save highlights"} />
      </form>
    );
  }

  if (isCompleted) {
    return (
      <div className="grid gap-4">
        <div>
          {message && <output className={`${sectionTitleClasses} block`}>{message}</output>}
          <p className={metaTextClasses}>You can continue importing or view your highlights.</p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Button
            text="Import another"
            onClick={() => {
              setIsCompleted(false);
              setFile(null);
            }}
          />
          <Button text="View highlights" onClick={() => navigate("/all")} />
        </div>
      </div>
    );
  }

  return (
    <form className="grid gap-4">
      <div>
        <h2 className={sectionTitleClasses}>KOReader highlights</h2>
        <p className={metaTextClasses}>The JSON file KOReader exports for a book.</p>
      </div>
      <div>
        <label htmlFor="koreader-file" className={labelClasses}>Highlights file (.json)</label>
        <input
          id="koreader-file"
          className="w-full"
          onChange={handleChange}
          type="file"
          accept=".json,application/json"
        />
      </div>
      {errorMessage && <p className={errorTextClasses} role="alert">{errorMessage}</p>}
      <Button
        text={isBusy ? "Reading file…" : "Upload"}
        onClick={handleUpload}
        disabled={isBusy}
        className="w-full"
      />
    </form>
  );
}
