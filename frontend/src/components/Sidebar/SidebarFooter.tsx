export default function SidebarFooter() {
  return (
    <div className="pt-6 border-t border-border mt-auto">
      <div className="flex flex-col gap-1 items-center justify-center opacity-60">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)]">
          Built By Hillary
        </p>
        <p className="text-[9px] text-[var(--muted)]">
          &copy; {new Date().getFullYear()} Landscapes Integrity Solutions. All rights reserved.
        </p>
      </div>
    </div>
  );
}
