import Image from "next/image"

export function ItemIdentity({
  name,
  imageUrl,
  size = 36,
}: {
  name: string
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
          className="rounded"
          style={{ width: size, height: size }}
        />
      ) : (
        <span
          className="inline-block rounded bg-surface-raised"
          style={{ width: size, height: size }}
          aria-hidden="true"
        />
      )}
      <span className="text-sm">{name}</span>
    </span>
  )
}
