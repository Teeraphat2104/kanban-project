"use client"

import { CardDialog } from "./CardDialog"
import type { Card } from "@/types"

export function CardItem({ card, columnId }: { card: Card; columnId: string }) {
  return (
    <CardDialog card={card} columnId={columnId}>
      <div className="cursor-pointer rounded-lg border bg-card p-3 text-sm shadow-sm hover:border-primary/50">
        <p className="font-medium">{card.title}</p>
        {card.description && (
          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
            {card.description}
          </p>
        )}
      </div>
    </CardDialog>
  )
}
