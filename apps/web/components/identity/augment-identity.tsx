import Image from "next/image"

export function AugmentIdentity({
  name,
  quality,
  imageUrl,
  size = 48,
}: {
  name: string
  quality?: string
  imageUrl?: string
  size?: number
}) {
  return (
    <span className="inline-flex items-center gap-2">
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={name}
          width={size}
          height={size}
          className="rounded bg-black rounded-full"
          style={{ width: size, height: size }}
        />
      ) : (
        <span
          className="inline-block rounded bg-surface-raised"
          style={{ width: size, height: size }}
          aria-hidden="true"
        />
      )}
      <span className="grid">
        <span className="text-sm">{name}</span>
        {quality && (
          <small className="text-[10px] uppercase tracking-widest" style={{ color: `var(--augment-${quality})` }}>
            {quality}
          </small>
        )}
      </span>
    </span>
  )
}
