import { useEffect, useMemo, useState } from 'react'
import { isSupabaseConfigured, supabase } from '@/lib/supabaseClient'
import { hubItemIcons } from '@/utils/hubItemIcons'
import { hubItems, type HubItem, type HubItemRow } from '@/utils/hubItems'

type LoadState =
  | { status: 'idle' | 'loading'; items: HubItem[] }
  | { status: 'ready'; items: HubItem[] }
  | { status: 'error'; items: HubItem[]; error: string }

function rowToItem(row: HubItemRow): HubItem | null {
  const icon = hubItemIcons[row.icon]
  if (!icon) return null

  return {
    id: row.id,
    title: row.title,
    description: row.description,
    kind: row.kind,
    status: row.status,
    href: row.href,
    icon,
  }
}

export function useHubItems() {
  const fallback = useMemo(() => hubItems, [])
  const [state, setState] = useState<LoadState>({ status: 'idle', items: fallback })

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setState({ status: 'ready', items: fallback })
      return
    }

    let cancelled = false

    async function run() {
      setState({ status: 'loading', items: fallback })

      const { data, error } = await supabase
        .from('hub_items')
        .select('id,title,description,kind,status,href,icon,order_index')
        .order('order_index', { ascending: true, nullsFirst: false })
        .order('title', { ascending: true })

      if (cancelled) return

      if (error) {
        setState({ status: 'error', items: fallback, error: error.message })
        return
      }

      const items = (data ?? [])
        .map((row) => rowToItem(row as HubItemRow))
        .filter((v): v is HubItem => Boolean(v))

      setState({ status: 'ready', items: items.length ? items : fallback })
    }

    run()

    return () => {
      cancelled = true
    }
  }, [fallback])

  return state
}

