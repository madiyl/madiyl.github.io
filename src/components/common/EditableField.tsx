import clsx from "clsx";

type EditableFieldProps = {
  label?: string;
  value: string | number;
  editMode: boolean;
  onChange: (value: string) => void;
  placeholder?: string;
  multiline?: boolean;
  type?: "text" | "number";
  className?: string;
  displayClassName?: string;
};

export function EditableField({
  label,
  value,
  editMode,
  onChange,
  placeholder,
  multiline,
  type = "text",
  className,
  displayClassName,
}: EditableFieldProps) {
  const stringValue = String(value ?? "");

  if (!editMode) {
    return (
      <div className={clsx("space-y-2", className)}>
        {label ? (
          <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8f7d69]">
            {label}
          </div>
        ) : null}
        <div
          className={clsx(
            "min-h-[1.5rem] break-words whitespace-pre-wrap text-sm leading-7 text-[#51453a]",
            !stringValue && "italic text-[#b3a390]",
            displayClassName,
          )}
        >
          {stringValue || placeholder || "待填写"}
        </div>
      </div>
    );
  }

  return (
    <label className={clsx("block space-y-2", className)}>
      {label ? (
        <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8f7d69]">
          {label}
        </span>
      ) : null}
      {multiline ? (
        <textarea
          value={stringValue}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          rows={4}
          className="w-full rounded-2xl border border-line bg-white/80 px-4 py-3 text-sm leading-7 text-ink outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
        />
      ) : (
        <input
          value={stringValue}
          type={type}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          className="w-full rounded-2xl border border-line bg-white/80 px-4 py-3 text-sm leading-7 text-ink outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
        />
      )}
    </label>
  );
}
