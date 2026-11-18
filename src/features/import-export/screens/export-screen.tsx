import { useExportBooks } from "../hooks";
import { getBookHighlightsForExport, getExportBook } from "../api";
import { useRef, useState } from "react";
import { saveAs } from "file-saver";
import { exportDbToString } from "@/lib/storage/export-db";
import Button from "@/components/ui/button";
import Page from "@/components/ui/page";
import Select from "@/components/ui/select";
import {
  errorTextClasses,
  labelClasses,
  metaTextClasses,
  sectionDividerClasses,
  sectionTitleClasses,
  successTextClasses,
} from "@/components/ui/styles";

export default function ExportPage() {
  const books = useExportBooks();
  const selectRef = useRef<HTMLSelectElement>(null);
  const [busy, setBusy] = useState<"markdown" | "database" | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleExport() {
    setBusy("markdown");
    setMessage(null);
    setErrorMessage(null);
    try {
      if (selectRef.current) {
        const selectedBookTitle = selectRef.current?.value;
        const book = await getExportBook(selectedBookTitle);
        if (book) {
          const highlights =
            await getBookHighlightsForExport(selectedBookTitle);
          const formattedHighlights = highlights?.map(
            (highlight) => `- ${highlight.quote}\n`,
          );
          if (formattedHighlights) {
            const markdownContent = [
              "# Book info",
              `Author: ${book.bookAuthor}\n`,
              `Title: ${book.bookTitle}\n`,
              "",
              "# Highlights",
              ...formattedHighlights,
            ].join("\n");
            const blob = new Blob([markdownContent], {
              type: "text/markdown;charset=utf-8",
            });
            saveAs(blob, `${selectedBookTitle} - Highlights.md`);
          }
        }
      }
      setMessage("Markdown export downloaded successfully.");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Markdown export failed.",
      );
    } finally {
      setBusy(null);
    }
  }

  async function handleExportDatabase() {
    setBusy("database");
    setMessage(null);
    setErrorMessage(null);
    try {
      const jsonDbString = await exportDbToString();
      saveAs(
        new Blob([jsonDbString], { type: "application/json" }),
        "MyHighlightsDB.json",
      );
      setMessage("Database export downloaded successfully.");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Database export failed.",
      );
    } finally {
      setBusy(null);
    }
  }

  return (
    <Page
      title="Export"
      description="Download your highlights. Everything stays on this device until you do."
      width="narrow"
    >
      <div aria-live="polite" className="empty:hidden mb-6">
        {message && (
          <output className={`block ${successTextClasses}`}>{message}</output>
        )}
        {errorMessage && <p className={errorTextClasses}>{errorMessage}</p>}
        {busy && (
          <output className={`block ${metaTextClasses}`}>
            Preparing {busy} export…
          </output>
        )}
      </div>
      <div className="grid gap-10">
        <form className="grid gap-4">
          <div>
            <h2 className={sectionTitleClasses}>Book as Markdown</h2>
            <p className={metaTextClasses}>
              One book’s highlights as a .md file, for notes apps.
            </p>
          </div>
          {books && books.length > 0 ? (
            <>
              <div>
                <label htmlFor="book-select" className={labelClasses}>
                  Book
                </label>
                <Select ref={selectRef} name="books" id="book-select">
                  {books.map((book) => (
                    <option key={book.id} value={book.bookTitle}>
                      {book.bookTitle}
                    </option>
                  ))}
                </Select>
              </div>
              <Button
                text={busy === "markdown" ? "Exporting…" : "Export Markdown"}
                onClick={handleExport}
                disabled={busy !== null}
                aria-busy={busy === "markdown"}
                className="w-full"
              />
            </>
          ) : (
            <p>No books to export yet.</p>
          )}
        </form>
        <form className={`${sectionDividerClasses} grid gap-4`}>
          <div>
            <h2 className={sectionTitleClasses}>Full backup</h2>
            <p className={metaTextClasses}>
              All books, highlights and lists as one .json file. Restore it from
              Import on any device.
            </p>
          </div>
          <Button
            text={busy === "database" ? "Exporting…" : "Export backup"}
            onClick={handleExportDatabase}
            disabled={busy !== null}
            aria-busy={busy === "database"}
            className="w-full"
          />
        </form>
      </div>
    </Page>
  );
}
