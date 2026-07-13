import { permanentRedirect } from "next/navigation"
export default async function LegacyChampion({ params }: { params: Promise<{ id: string }> }) {
  permanentRedirect(`/zh/champions/${(await params).id}`)
}
