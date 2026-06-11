'use client'

import React from 'react'

/* ------------------------------------------------------------------ */
/*  Shared base shimmer block                                         */
/* ------------------------------------------------------------------ */

function Bone({ className = '' }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded bg-gray-200 dark:bg-gray-800 ${className}`}
    />
  )
}

/* ------------------------------------------------------------------ */
/*  SkeletonCard                                                      */
/*  A card placeholder with 3 text lines inside                       */
/* ------------------------------------------------------------------ */

export function SkeletonCard(): JSX.Element {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
      <Bone className="mb-4 h-4 w-2/5 rounded-md" />
      <Bone className="mb-3 h-3 w-full rounded-md" />
      <Bone className="mb-3 h-3 w-4/5 rounded-md" />
      <Bone className="h-3 w-3/5 rounded-md" />
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  SkeletonTable                                                     */
/*  Header row + N body rows, each with 5 columns                    */
/* ------------------------------------------------------------------ */

export function SkeletonTable({
  rows = 5,
}: {
  rows?: number
}): JSX.Element {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
      {/* Header */}
      <div className="grid grid-cols-5 gap-4 border-b border-gray-200 px-5 py-3 dark:border-gray-700">
        {Array.from({ length: 5 }).map((_, i) => (
          <Bone key={`head-${i}`} className="h-4 w-3/4 rounded-md" />
        ))}
      </div>

      {/* Body rows */}
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div
          key={`row-${rowIdx}`}
          className="grid grid-cols-5 gap-4 border-b border-gray-100 px-5 py-3 last:border-b-0 dark:border-gray-800"
        >
          {Array.from({ length: 5 }).map((_, colIdx) => (
            <Bone
              key={`cell-${rowIdx}-${colIdx}`}
              className="h-3 w-full rounded-md"
            />
          ))}
        </div>
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  SkeletonChart                                                     */
/*  Chart area with bar-like shapes inside                            */
/* ------------------------------------------------------------------ */

export function SkeletonChart(): JSX.Element {
  const barHeights = ['h-24', 'h-32', 'h-20', 'h-36', 'h-28', 'h-40', 'h-16']

  return (
    <div className="flex h-64 items-end gap-3 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
      {barHeights.map((h, i) => (
        <Bone key={i} className={`flex-1 rounded-t-md ${h}`} />
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  SkeletonStats                                                     */
/*  A responsive row of 4 stat cards                                  */
/* ------------------------------------------------------------------ */

export function SkeletonStats(): JSX.Element {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900"
        >
          <Bone className="mb-3 h-3 w-1/2 rounded-md" />
          <Bone className="mb-2 h-6 w-2/3 rounded-md" />
          <Bone className="h-2 w-1/3 rounded-md" />
        </div>
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  SkeletonProfile                                                   */
/*  Avatar circle + info lines + progress bar                         */
/* ------------------------------------------------------------------ */

export function SkeletonProfile(): JSX.Element {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
      {/* Avatar */}
      <div className="flex items-center gap-4">
        <Bone className="h-16 w-16 shrink-0 rounded-full" />
        <div className="flex-1 space-y-2">
          <Bone className="h-4 w-2/5 rounded-md" />
          <Bone className="h-3 w-1/3 rounded-md" />
        </div>
      </div>

      {/* Info lines */}
      <div className="mt-6 space-y-3">
        <Bone className="h-3 w-full rounded-md" />
        <Bone className="h-3 w-4/5 rounded-md" />
        <Bone className="h-3 w-3/5 rounded-md" />
      </div>

      {/* Progress bar */}
      <div className="mt-6">
        <Bone className="h-2 w-full rounded-full" />
      </div>
    </div>
  )
}
