import { JobStateDot } from '@/components/job-state'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { api } from '@/lib/api'
import { cn, useLocalStorage } from '@/lib/utils'
import { rankItem } from '@tanstack/match-sorter-utils'
import { createFileRoute, Link } from '@tanstack/react-router'
import {
  type ColumnDef,
  type FilterFn,
  type FilterFnOption,
  getCoreRowModel,
  getFilteredRowModel,
  type Row,
  useReactTable,
} from '@tanstack/react-table'
import { GlobeIcon, SearchIcon, StarIcon, XIcon } from 'lucide-react'
import { useMemo } from 'react'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <h1 className="pb-4 text-3xl font-semibold">SAS Directory</h1>
      <DataTable />
    </div>
  )
}

const columns: ColumnDef<string>[] = [
  {
    id: 'id',
    accessorFn: (row) => row,
    filterFn: 'fuzzy' as FilterFnOption<string>,
  },
]

const fuzzyFilter: FilterFn<unknown> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value as string)

  // Store the itemRank info
  addMeta({ itemRank })

  // Return if the item should be filtered in/out
  return itemRank.passed
}

function DataTable() {
  const [favorites, setFavorites] = useLocalStorage<string[]>('favorites', [])
  const { data } = api.useQuery('get', '/sas')

  const tableData = useMemo(() => {
    return data ?? []
  }, [data])

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    filterFns: {
      fuzzy: fuzzyFilter, //define as a filter function that can be used in column definitions
    },
    getFilteredRowModel: getFilteredRowModel(),
  })

  return (
    <>
      <div className="flex justify-between pb-2">
        <div className="relative text-gray-11">
          <Input
            onChange={(e) =>
              table.getColumn('id')!.setFilterValue(e.target.value)
            }
            value={(table.getColumn('id')!.getFilterValue() as string) ?? ''}
            className="pl-10"
            size="lg"
            placeholder="Search..."
          />
          <SearchIcon className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2" />
          {((table.getColumn('id')!.getFilterValue() as string) ?? '').length >
            0 && (
            <XIcon
              onClick={() => table.getColumn('id')!.setFilterValue('')}
              className="absolute right-2 top-1/2 size-4 -translate-y-1/2"
            />
          )}
        </div>
      </div>

      {favorites.length > 0 ? (
        <div className="mb-4 flex flex-col border-b pb-4">
          <span className="pb-2 text-sm font-medium text-gray-11">
            Favorites
          </span>
          <div className="relative grid grid-cols-3 gap-4">
            {data
              ? table.getRowModel().rows.map((row, i) => {
                  if (favorites.includes(row.getValue('id')))
                    return (
                      <SASCard
                        favorites={favorites}
                        setFavorites={setFavorites}
                        row={row}
                        key={i}
                      />
                    )
                })
              : Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-36 animate-pulse rounded-lg bg-gray-2"
                  />
                ))}
          </div>
        </div>
      ) : null}

      <div className="flex flex-col">
        <div className="relative grid grid-cols-3 gap-4">
          {data ? (
            table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row, i) => {
                return (
                  <SASCard
                    favorites={favorites}
                    setFavorites={setFavorites}
                    row={row}
                    key={i}
                  />
                )
              })
            ) : (
              <div className="absolute inset-x-0 flex h-48 flex-col items-center justify-center text-center text-gray-12">
                No results found
              </div>
            )
          ) : (
            Array.from({ length: 9 }).map((_, i) => (
              <div
                key={i}
                className="h-36 animate-pulse rounded-lg bg-gray-2"
              />
            ))
          )}
        </div>
      </div>
    </>
  )
}

function SASCard({
  favorites,
  setFavorites,
  row,
}: {
  favorites: string[]
  setFavorites: (value: string[]) => void
  row: Row<string>
}) {
  const id: string = row.getValue('id')
  const isFavorite = favorites.includes(id)
  const jobs = api.useQuery('get', '/jobs', {
    // @ts-expect-error params
    params: { query: { SAS_eq: id } },
  })

  return (
    <Link to="/sas/$id" params={{ id }}>
      <Card className="flex flex-col border p-4">
        <div className="flex pb-2">
          <div className="flex aspect-square size-12 items-center justify-center rounded-md border border-blue-6 bg-blue-2 p-3 text-blue-9">
            <GlobeIcon className="size-8" />
          </div>
          <span className="ml-2 pt-1.5 text-sm font-medium">{id}</span>
          <StarIcon
            onClick={() => {
              if (!isFavorite) {
                setFavorites([...favorites, id])
              } else {
                setFavorites(favorites.filter((oldId) => id !== oldId))
              }
            }}
            className={cn(
              'ml-auto size-4 text-gray-6 hover:text-yellow-9',
              isFavorite && 'fill-yellow-6 text-yellow-9',
            )}
          />
        </div>

        {jobs.data ? (
          <div className="flex items-center">
            {[...jobs.data]
              .sort(
                (a, b) =>
                  new Date(b.timestamp!).getTime() -
                  new Date(a.timestamp!).getTime(),
              )
              .slice(0, 2)
              .map((job) => {
                return (
                  <Link
                    to="/jobs/$id"
                    params={{ id: job.id! }}
                    className="flex h-7 items-center gap-x-2 rounded-full bg-gray-2 px-1.5 text-sm text-gray-11"
                  >
                    <JobStateDot state={job.state!} /> {job.id}
                  </Link>
                )
              })}
            {jobs.data.length - 2 > 0 ? (
              <span className="ml-2 text-sm text-gray-7">
                + {jobs.data.length - 2}
              </span>
            ) : null}
          </div>
        ) : (
          <div className="h-7 animate-pulse rounded-md bg-gray-2" />
        )}
      </Card>
    </Link>
  )
}
