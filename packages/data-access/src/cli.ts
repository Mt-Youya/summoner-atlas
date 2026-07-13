import { syncStatic, syncResg, syncAll } from "./sync"

async function main() {
  const args = process.argv.slice(2)

  if (args.includes("--help") || args.includes("-h")) {
    console.log(
      [
        "Usage: pnpm sync [options]",
        "",
        "Options:",
        "  --static              Sync static CDragon + DataDragon reference data",
        "  --resg                Sync resg.top dynamic stats (requires --version)",
        "  --all                 Sync everything (default)",
        "  --version <version>   Game version for resg data (e.g. 16.13)",
        "  --champions <ids>     Comma-separated champion IDs for synergy/base-stats",
        "  --help, -h            Show this help",
      ].join("\n")
    )
    return
  }

  const version = args.includes("--version") ? args[args.indexOf("--version") + 1] : "16.13"
  const championIdsArg = args.includes("--champions") ? args[args.indexOf("--champions") + 1] : ""
  const championIds = championIdsArg ? championIdsArg.split(",").map(Number) : undefined

  try {
    if (args.includes("--static")) {
      console.log("Syncing static data...")
      const results = await syncStatic()
      for (const r of results) console.log(`  ${r.table}: ${r.count} rows (${r.duration}ms)`)
      console.log("Done.")
    } else if (args.includes("--resg")) {
      console.log(`Syncing resg data for version ${version}...`)
      const results = await syncResg(version, championIds)
      for (const r of results) console.log(`  ${r.table}: ${r.count} rows (${r.duration}ms)`)
      console.log("Done.")
    } else {
      console.log(`Syncing all data for version ${version}...`)
      const results = await syncAll(version, championIds)
      for (const r of results) console.log(`  ${r.table}: ${r.count} rows (${r.duration}ms)`)
      console.log("Done.")
    }
  } catch (err) {
    console.error("Sync failed:", err)
    process.exit(1)
  }
}

main()
