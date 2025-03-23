import { cn } from "@/lib/utils";

export function SkeletonTable({ rows = 5, columns = 4, showHeader = true, className }) {
  return (
    <div className={cn("w-full overflow-hidden rounded-md border", className)}>
      <div className="w-full overflow-auto">
        <table className="w-full caption-bottom text-sm">
          {showHeader && (
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors">
                {Array.from({ length: columns }).map((_, index) => (
                  <th key={index} className="h-12 px-4 text-left align-middle font-medium">
                    <div className="h-4 w-3/4 animate-pulse rounded-md bg-muted"></div>
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody className="[&_tr:last-child]:border-0">
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <tr key={rowIndex} className="border-b transition-colors hover:bg-muted/50">
                {Array.from({ length: columns }).map((_, colIndex) => (
                  <td key={colIndex} className="p-4 align-middle">
                    <div
                      className={cn(
                        "h-4 animate-pulse rounded-md bg-muted",
                        colIndex === 0 ? "w-1/2" : colIndex === 1 ? "w-3/4" : colIndex === 2 ? "w-2/3" : "w-1/3"
                      )}
                    ></div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
