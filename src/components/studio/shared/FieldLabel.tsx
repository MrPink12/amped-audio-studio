import { ReactNode } from "react";

interface FieldLabelProps {
  label: ReactNode;
  required?: boolean;
  children: ReactNode;
}

const FieldLabel = ({ label, required, children }: FieldLabelProps) => (
  <label className="block space-y-1.5">
    <span className="text-[10px] font-display uppercase tracking-[0.2em] text-foreground/70">
      {label}
      {required && <span className="text-primary ml-1">*</span>}
    </span>
    {children}
  </label>
);

export default FieldLabel;
