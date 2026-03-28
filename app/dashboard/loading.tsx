import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      {/* Hero skeleton */}
      <div className="rounded-2xl bg-[#111318] p-8">
        <Skeleton className="h-10 w-96 bg-white/10" />
        <Skeleton className="mt-3 h-5 w-full max-w-xl bg-white/10" />
      </div>

      {/* Quick insights skeleton */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-xl border border-white/10 bg-[#111318] p-5">
            <Skeleton className="h-11 w-11 rounded-xl bg-white/10" />
            <Skeleton className="mt-4 h-4 w-24 bg-white/10" />
            <Skeleton className="mt-2 h-8 w-32 bg-white/10" />
          </div>
        ))}
      </div>

      {/* Main content skeleton */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6">
          <div className="rounded-xl border border-white/10 bg-[#111318] p-8">
            <Skeleton className="mx-auto h-52 w-52 rounded-full bg-white/10" />
          </div>
          <div className="rounded-xl border border-white/10 bg-[#111318] p-6">
            <Skeleton className="h-6 w-48 bg-white/10" />
            <div className="mt-6 space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-20 w-full bg-white/10" />
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-6 lg:col-span-2">
          <div className="grid gap-6 xl:grid-cols-2">
            <div className="rounded-xl border border-white/10 bg-[#111318] p-6">
              <Skeleton className="h-full min-h-[400px] w-full bg-white/10" />
            </div>
            <div className="rounded-xl border border-white/10 bg-[#111318] p-6">
              <Skeleton className="h-full min-h-[400px] w-full bg-white/10" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
