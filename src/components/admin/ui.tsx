import type { ReactNode } from "react";

export const inputClass =
  "w-full rounded-sm border border-deep-forest/20 bg-surface px-3 py-2 text-body-md text-deep-forest outline-none transition-colors focus:border-deep-forest";

export const primaryButton =
  "label rounded-sm bg-deep-forest px-6 py-3 text-horizon-sand transition-opacity hover:opacity-90 disabled:opacity-60";

export const ghostButton =
  "label rounded-sm border border-deep-forest/20 px-6 py-3 text-deep-forest transition-colors hover:border-deep-forest disabled:opacity-60";

export const dangerButton =
  "label rounded-sm border border-red-700/30 px-4 py-2 text-red-700 transition-colors hover:bg-red-700/5";

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block space-y-2">
      <span className="label block text-on-surface-variant">{label}</span>
      {children}
    </label>
  );
}

export function Card({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-lg border border-deep-forest/10 bg-surface-container-lowest p-6 shadow-sm">
      {children}
    </div>
  );
}

export function PageHeading({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-headline-md text-deep-forest">{title}</h1>
        {description && <p className="mt-2 text-body-md text-on-surface-variant">{description}</p>}
      </div>
      {action}
    </div>
  );
}
