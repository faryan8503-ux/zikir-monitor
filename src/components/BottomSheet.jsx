// Tetingkap yang muncul dari bawah skrin
export default function BottomSheet({ open, onClose, children, label }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-40" role="dialog" aria-modal="true" aria-label={label}>
      <button type="button" aria-label="Tutup" onClick={onClose} className="absolute inset-0 h-full w-full bg-plum/30 backdrop-blur-[2px]" />
      <div className="animate-toast absolute inset-x-0 bottom-0 mx-auto max-h-[85dvh] max-w-md overflow-y-auto rounded-t-[2rem] bg-white px-5 pt-3 shadow-soft"
        style={{ paddingBottom: 'max(1.25rem, env(safe-area-inset-bottom))' }}>
        <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-blush-200" />
        {children}
      </div>
    </div>
  )
}
