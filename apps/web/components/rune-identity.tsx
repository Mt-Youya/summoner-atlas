import Image from "next/image"

export function RuneIdentity({
  name,
  path,
  imageUrl,
  size = 32,
}: {
  name: string
  path?: string
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
          className="rounded-full"
          style={{ width: size, height: size }}
        />
      ) : (
        <span
          className="inline-block rounded-full bg-surface-raised"
          style={{ width: size, height: size }}
          aria-hidden="true"
        />
      )}
      <span className="grid">
        <span className="text-sm">{name}</span>
        {path && <small className="text-[11px] text-muted-foreground">{path}</small>}
      </span>
    </span>
  )
}
