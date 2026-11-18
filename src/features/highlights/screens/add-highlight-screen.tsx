import type { ElementType } from "react";
import Page from "@/components/ui/page";

export default function AddHighlightScreen({
  AddHighlightComponent,
}: {
  AddHighlightComponent: ElementType;
}) {
  return (
    <Page
      title="Add highlight"
      description="Paste quotes one after another. The book stays set until you change it, so you can batch a chapter without retyping the details."
      width="narrow"
    >
      <AddHighlightComponent />
    </Page>
  );
}
