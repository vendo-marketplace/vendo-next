"use client";

import { useState } from "react";

import type { CategoryAttribute } from "@/features/categories/types/category";

import { AttributeCatalog } from "./AttributeCatalog";
import { AttributeCreatePanel } from "./AttributeCreatePanel";
import { AttributeEditDialog } from "./AttributeEditDialog";

export const AttributesManager = () => {
  const [editing, setEditing] = useState<CategoryAttribute | null>(null);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] xl:items-start">
      <div className="xl:sticky xl:top-24">
        <AttributeCreatePanel onCreated={({ id }) => setHighlightedId(id)} />
      </div>

      <AttributeCatalog highlightedId={highlightedId} onEdit={setEditing} />

      <AttributeEditDialog attribute={editing} onClose={() => setEditing(null)} />
    </div>
  );
};
