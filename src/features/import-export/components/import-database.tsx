import { replaceDatabaseFromJson } from "@/lib/storage/export-db";
import React, { useState } from "react";
import Button from "@/components/ui/button";
import {
  activeCardClasses,
  errorTextClasses,
  labelClasses,
  metaTextClasses,
  sectionTitleClasses,
  successTextClasses,
} from "@/components/ui/styles";

export default function ImportDatabase() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [file, setFile] = useState<null | File>(null);
  const [isBusy, setIsBusy] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    event.preventDefault();
    if (event.target.files) {
      setFile(event.target.files[0]);
      setErrorMessage(null);
      setSuccessMessage(null);
    }
  }

  async function handleUpload(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    if (!file) {
      setErrorMessage("Choose a database export file first.");
      return;
    }
    setIsBusy(true);
    try {
      const json = await file.text();
      await replaceDatabaseFromJson(json);
      setSuccessMessage("Database replaced successfully. Your imported highlights are ready.");
    } catch (error) {
      setErrorMessage(error instanceof Error
        ? `${error.message} Your existing data was not replaced.`
        : "Database import failed. Your existing data was not replaced.");
    } finally {
      setIsBusy(false);
    }
  }

  return (
    <form onSubmit={handleUpload} className="grid gap-4">
      <div>
        <h2 className={sectionTitleClasses}>Restore a backup</h2>
        <p className={metaTextClasses}>
          This replaces all local books, highlights, and lists. Export a backup first
          if you may need to recover the current data.
        </p>
      </div>
      <p className={`${activeCardClasses} border-2 p-3`}>
        <strong>Warning:</strong> importing replaces the current database and cannot be undone here.
      </p>
      <div>
        <label htmlFor="database-file" className={labelClasses}>Backup file (.json)</label>
        <input
          id="database-file"
          className="w-full"
          onChange={handleChange}
          type="file"
        />
      </div>
      {errorMessage && <p className={errorTextClasses} role="alert">{errorMessage}</p>}
      {successMessage && <output className={successTextClasses}>{successMessage}</output>}
      {isBusy && <output className={`block ${metaTextClasses}`}>Validating and replacing database…</output>}
      <Button text={isBusy ? "Importing…" : "Replace database"} type="submit" disabled={isBusy} className="w-full" />
    </form>
  );
}
