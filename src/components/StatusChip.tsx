import React from 'react';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  ArrowDownLeft,
  ArrowUpRight,
  ShieldAlert,
  Info,
  FileText,
} from 'lucide-react';
import { POStatus, TransactionType } from '../types';

type ChipType = 'po' | 'stock' | 'transaction';

interface StatusChipProps {
  type: ChipType;
  value: string;
  size?: 'sm' | 'md';
  className?: string;
}

export const StatusChip: React.FC<StatusChipProps> = ({
  type,
  value,
  size = 'md',
  className = '',
}) => {
  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-[10px] gap-1' : 'px-2.5 py-1 text-xs gap-1.5';

  if (type === 'po') {
    const poStatus = value as POStatus;
    const config = {
      // Open PO = glacier-mist
      open: {
        label: 'Open Indent',
        icon: <FileText className="w-3.5 h-3.5 text-glacier" />,
        classes: 'bg-glacier-mist text-night border border-glacier/40',
      },
      // Partial = gold
      partially_received: {
        label: 'Partially Received',
        icon: <Clock className="w-3.5 h-3.5 text-gold" />,
        classes: 'bg-gold/15 text-gold border border-gold/40',
      },
      // Closed = olive
      closed: {
        label: 'Closed / Fulfilled',
        icon: <CheckCircle2 className="w-3.5 h-3.5 text-olive" />,
        classes: 'bg-olive/15 text-olive border border-olive/30',
      },
      // Cancelled = danger
      cancelled: {
        label: 'Cancelled',
        icon: <XCircle className="w-3.5 h-3.5 text-danger" />,
        classes: 'bg-danger/15 text-danger border border-danger/30',
      },
    }[poStatus] || {
      label: value,
      icon: <Clock className="w-3.5 h-3.5 text-sand" />,
      classes: 'bg-snow text-pine border border-sand',
    };

    return (
      <span
        className={`inline-flex items-center rounded-badge font-heading font-bold select-none whitespace-nowrap shadow-subtle ${sizeClass} ${config.classes} ${className}`}
      >
        {config.icon}
        <span>{config.label}</span>
      </span>
    );
  }

  if (type === 'stock') {
    // Semantic mapping: Healthy = success, Adequate = glacier-mist, Expiring = gold, Low = danger
    const config = {
      healthy: {
        label: 'Healthy Stock',
        icon: <CheckCircle2 className="w-3.5 h-3.5 text-success" />,
        classes: 'bg-success/15 text-success border border-success/30',
      },
      adequate: {
        label: 'Adequate Reserve',
        icon: <Info className="w-3.5 h-3.5 text-glacier" />,
        classes: 'bg-glacier-mist text-night border border-glacier/40',
      },
      expiring: {
        label: 'Expiring Soon',
        icon: <Clock className="w-3.5 h-3.5 text-gold" />,
        classes: 'bg-gold/15 text-gold border border-gold/40',
      },
      low: {
        label: 'Critical Low',
        icon: <ShieldAlert className="w-3.5 h-3.5 text-danger" />,
        classes: 'bg-danger/15 text-danger border border-danger/30',
      },
    }[value.toLowerCase()] || {
      label: value,
      icon: <Info className="w-3.5 h-3.5 text-sand" />,
      classes: 'bg-snow text-pine border border-sand',
    };

    return (
      <span
        className={`inline-flex items-center rounded-badge font-heading font-bold select-none whitespace-nowrap shadow-subtle ${sizeClass} ${config.classes} ${className}`}
      >
        {config.icon}
        <span>{config.label}</span>
      </span>
    );
  }

  if (type === 'transaction') {
    const txType = value as TransactionType;
    const config = {
      receipt: {
        label: 'Depot Receipt',
        icon: <ArrowDownLeft className="w-3.5 h-3.5 text-success" />,
        classes: 'bg-success/15 text-success border border-success/30',
      },
      issue: {
        label: 'Mess Issue',
        icon: <ArrowUpRight className="w-3.5 h-3.5 text-glacier" />,
        classes: 'bg-glacier-mist text-night border border-glacier/40',
      },
      adjustment: {
        label: 'Write-Off Adjustment',
        icon: <Clock className="w-3.5 h-3.5 text-gold" />,
        classes: 'bg-gold/15 text-gold border border-gold/40',
      },
      return: {
        label: 'Depot Return',
        icon: <ArrowDownLeft className="w-3.5 h-3.5 text-gold" />,
        classes: 'bg-gold/15 text-gold border border-gold/40',
      },
    }[txType] || {
      label: value,
      icon: <Clock className="w-3.5 h-3.5 text-sand" />,
      classes: 'bg-snow text-pine border border-sand',
    };

    return (
      <span
        className={`inline-flex items-center rounded-badge font-heading font-bold select-none whitespace-nowrap shadow-subtle ${sizeClass} ${config.classes} ${className}`}
      >
        {config.icon}
        <span>{config.label}</span>
      </span>
    );
  }

  return null;
};

export default StatusChip;
