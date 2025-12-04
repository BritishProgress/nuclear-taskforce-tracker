'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { OwnerWithStats } from '@/lib/data';
import { OWNER_FULL_NAMES, OVERALL_STATUS_LABELS } from '@/lib/constants';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Disclaimer, ExportButton } from '@/components/shared';
import { ChevronRight } from 'lucide-react';

interface DepartmentsContentProps {
  ownersWithStats: OwnerWithStats[];
}

export function DepartmentsContent({ ownersWithStats }: DepartmentsContentProps) {
  const router = useRouter();
  
  // Sort by progress percentage (descending), then by total count (descending)
  const sortedOwners = useMemo(() => {
    return [...ownersWithStats].sort((a, b) => {
      // First sort by progress percentage (descending)
      if (b.progressPercentage !== a.progressPercentage) {
        return b.progressPercentage - a.progressPercentage;
      }
      // Then by total count (descending)
      return b.statusCounts.total - a.statusCounts.total;
    });
  }, [ownersWithStats]);

  return (
    <div className="container py-8">
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
          <h1 className="text-3xl font-bold">Department League Table</h1>
          <div className="flex-shrink-0">
            <ExportButton
              baseUrl="/api/export/departments"
              label="Export Data"
            />
          </div>
        </div>
        <p className="text-muted-foreground">
          Compare progress across all departments and owners, ordered by completion percentage.
        </p>
      </div>

      <Card className="py-0">
        <CardContent className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Owner
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider min-w-[300px]">
                    Progress
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider min-w-[250px]">
                    Key People
                  </th>
                  <th className="w-12"></th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {sortedOwners.map((ownerStats) => {
                  const fullName = OWNER_FULL_NAMES[ownerStats.owner] || ownerStats.owner;
                  const total = ownerStats.statusCounts.total;
                  
                  // Calculate percentages for each status
                  const completedPct = (ownerStats.statusCounts.completed / total) * 100;
                  const onTrackPct = (ownerStats.statusCounts.on_track / total) * 100;
                  const notStartedPct = (ownerStats.statusCounts.not_started / total) * 100;
                  const offTrackPct = (ownerStats.statusCounts.off_track / total) * 100;
                  const abandonedPct = (ownerStats.statusCounts.abandoned / total) * 100;

                  return (
                    <tr
                      key={ownerStats.owner}
                      onClick={() => router.push(`/?owner=${encodeURIComponent(ownerStats.owner)}`)}
                      className="hover:bg-muted/30 transition-colors cursor-pointer"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-semibold text-sm">
                            {ownerStats.owner}
                          </div>
                          <div className="text-xs text-muted-foreground mt-0.5">
                            {fullName}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          {/* Progress percentage */}
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="font-semibold">
                              {ownerStats.progressPercentage}% Complete
                            </span>
                            <span className="text-muted-foreground text-xs">
                              {ownerStats.statusCounts.completed}/{total} recommendations
                            </span>
                          </div>
                          
                          {/* Horizontal progress bar with segments */}
                          <div className="w-full h-6 bg-muted rounded-full overflow-hidden flex">
                            {/* Completed (green) */}
                            {ownerStats.statusCounts.completed > 0 && (
                              <div
                                className="bg-neon-green transition-all duration-500"
                                style={{ width: `${completedPct}%` }}
                                title={`${ownerStats.statusCounts.completed} completed`}
                              />
                            )}
                            {/* On Track (light green) */}
                            {ownerStats.statusCounts.on_track > 0 && (
                              <div
                                className="bg-dark-green/30 transition-all duration-500"
                                style={{ width: `${onTrackPct}%` }}
                                title={`${ownerStats.statusCounts.on_track} on track`}
                              />
                            )}
                            {/* Not Started (gray) */}
                            {ownerStats.statusCounts.not_started > 0 && (
                              <div
                                className="bg-muted-foreground/20 transition-all duration-500"
                                style={{ width: `${notStartedPct}%` }}
                                title={`${ownerStats.statusCounts.not_started} not started`}
                              />
                            )}
                            {/* Off Track (red) */}
                            {ownerStats.statusCounts.off_track > 0 && (
                              <div
                                className="bg-deep-red/30 transition-all duration-500"
                                style={{ width: `${offTrackPct}%` }}
                                title={`${ownerStats.statusCounts.off_track} off track`}
                              />
                            )}
                            {/* Abandoned (dark gray) */}
                            {ownerStats.statusCounts.abandoned > 0 && (
                              <div
                                className="bg-charcoal/30 transition-all duration-500"
                                style={{ width: `${abandonedPct}%` }}
                                title={`${ownerStats.statusCounts.abandoned} abandoned`}
                              />
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {ownerStats.keyPeople && ownerStats.keyPeople.length > 0 ? (
                          <div className="grid grid-cols-2 gap-2">
                            {ownerStats.keyPeople.map((person, idx) => (
                              <div
                                key={idx}
                                className="inline-flex flex-col px-2.5 py-1.5 rounded-md bg-muted/50 border border-border/50 text-xs"
                              >
                                <div className="font-medium text-foreground">
                                  {person.name}
                                </div>
                                <div className="text-muted-foreground text-[10px] leading-tight">
                                  {person.title}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <ChevronRight size={16} className="text-muted-foreground" />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-sm">Progress Bar Legend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-neon-green rounded" />
              <span>{OVERALL_STATUS_LABELS.completed}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-dark-green/30 rounded" />
              <span>{OVERALL_STATUS_LABELS.on_track}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-deep-red/30 rounded" />
              <span>{OVERALL_STATUS_LABELS.off_track}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-muted-foreground/20 rounded" />
              <span>{OVERALL_STATUS_LABELS.not_started}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-charcoal/30 rounded" />
              <span>{OVERALL_STATUS_LABELS.abandoned}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <section className="container py-8">
        <Disclaimer />
      </section>
    </div>
  );
}
