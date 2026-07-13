import { permanentRedirect } from "next/navigation"
export default async function LegacyAugment({ params }: { params: Promise<{ id: string }> }) {
  permanentRedirect(`/zh/augments/${(await params).id}`)
}
