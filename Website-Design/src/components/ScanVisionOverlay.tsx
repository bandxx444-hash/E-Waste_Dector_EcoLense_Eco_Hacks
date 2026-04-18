export function ScanVisionOverlay({ imageUrl }: { imageUrl: string }) {
  return (
    <div className="rounded-2xl overflow-hidden border border-border" style={{ background: "#0a0a0a" }}>
      <div className="relative flex items-center justify-center" style={{ minHeight: 200 }}>
        <img
          src={imageUrl}
          alt="Device preview"
          className="w-full object-contain"
          style={{ maxHeight: 340 }}
        />
      </div>
    </div>
  );
}
