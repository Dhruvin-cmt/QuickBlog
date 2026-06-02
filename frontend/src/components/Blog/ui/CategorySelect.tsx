import { useState } from "react";
import {
  Category,
  CategoryMeta,
  type CategoryType,
} from "../../../shared/category";
import Button from "../../../ui/Button";

export default function CategorySelect({
  value,
  onChange,
}: {
  value: CategoryType | string;
  onChange: (val: CategoryType) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative w-56">
      {/* Trigger */}
      <Button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-3 py-2 border border-(--border) rounded-md bg-(--bg) text-sm cursor-pointer"
      >
        <span className="flex items-center gap-2">
          {(() => {
            const Icon = CategoryMeta[value as keyof typeof CategoryMeta].icon;
            const iconColor = CategoryMeta[value as keyof typeof CategoryMeta].color;
            return <Icon size={16} style={{ color: iconColor }} />;
          })()}
          {value.replaceAll("_", " ")}
        </span>
      </Button>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 mt-2 w-full bg-(--bg) border border-(--border) rounded-md shadow-lg max-h-64 overflow-y-scroll no-scrollbar cursor-pointer">
          {Category.map((cat) => {
            const Icon = CategoryMeta[cat].icon;
            const iconColor = CategoryMeta[cat].color;

            return (
              <Button
                type="button"
                key={cat}
                onClick={() => {
                  onChange(cat);
                  setOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-800 hover:cursor-pointer"
              >
                <Icon size={16} style={{ color: iconColor }} />
                {cat.replaceAll("_", " ")}
              </Button>
            );
          })}
        </div>
      )}
    </div>
  );
}
