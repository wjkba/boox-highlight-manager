import { useState } from "react";

import Page from "@/components/ui/page";
import Select from "@/components/ui/select";
import { labelClasses, sectionDividerClasses } from "@/components/ui/styles";
import ImportDatabase from "../components/import-database";
import UploadBoox from "../components/upload-boox";
import UploadKoreader from "../components/upload-koreader";

type ImportSource = "boox" | "koreader";

export default function ImportPage() {
  const [source, setSource] = useState<ImportSource>("boox");

  return (
    <Page
      title="Import"
      description="Bring in highlights from your e-reader, or restore a backup."
      width="narrow"
    >
      <div className="grid gap-10">
        <section className="grid gap-4">
          <div>
            <label htmlFor="import-source" className={labelClasses}>
              Import from
            </label>
            <Select
              name="import-source"
              id="import-source"
              value={source}
              onChange={(event) =>
                setSource(event.target.value as ImportSource)
              }
            >
              <option value="boox">Onyx Boox annotations (TXT)</option>
              <option value="koreader">KOReader highlights (JSON)</option>
            </Select>
          </div>
          {source === "boox" ? <UploadBoox /> : <UploadKoreader />}
        </section>

        <section className={sectionDividerClasses}>
          <ImportDatabase />
        </section>
      </div>
    </Page>
  );
}
