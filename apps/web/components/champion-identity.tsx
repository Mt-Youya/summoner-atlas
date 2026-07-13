import Image from "next/image"

export function ChampionIdentity({
  name,
  alias,
  imageUrl,
  size = 40,
}: {
  name: string
  alias?: string
  imageUrl?: string
  size?: number
}) {
  return (
    <span className="inline-flex items-center gap-2.5">
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
        <strong className="truncate text-sm leading-tight">{name}</strong>
        {alias && <small className="truncate text-[11px] text-muted-foreground">{alias}</small>}
      </span>
    </span>
  )
}
