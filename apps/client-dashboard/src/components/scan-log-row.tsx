import * as React from "react";
import { CheckCircle2, XCircle, Clock } from "lucide-react";

import { TableRow, TableCell, Badge } from "@gate-access/ui";

export type ScanStatus = "granted" | "denied" | "pending";

export interface ScanLogRowProps {
  id: string;
  visitorName: string;
  gateName: string;
  timestamp: string;
  status: ScanStatus;
  operatorName?: string;
}

export function ScanLogRow({
  visitorName,
  gateName,
  timestamp,
  status,
  operatorName,
}: ScanLogRowProps) {
  const StatusIcon = {
    granted: CheckCircle2,
    denied: XCircle,
    pending: Clock,
  }[status];

  const badgeVariant = {
    granted: "default",
    denied: "destructive",
    pending: "secondary",
  }[status] as "default" | "destructive" | "secondary" | "outline";

  return (
    <TableRow>
      <TableCell className="font-medium">{visitorName}</TableCell>
      <TableCell>{gateName}</TableCell>
      <TableCell className="text-muted-foreground">{timestamp}</TableCell>
      <TableCell>
        <Badge variant={badgeVariant} className="flex w-fit items-center gap-1 capitalize">
          <StatusIcon className={`w-3 h-3 ${status !== 'pending' ? 'text-white' : ''}`} />
          {status}
        </Badge>
      </TableCell>
      <TableCell className="text-right text-muted-foreground">{operatorName || "-"}</TableCell>
    </TableRow>
  );
}
