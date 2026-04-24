"use client";

import { Calendar, MapPin, Users, Trash2, X, Eye } from "lucide-react";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function EventCard({
  event,
  onClick,
  onDelete,
  variant = "grid", // "grid" or "list"
  action = null, // "view" | "cancel" | null
  className = "",
}) {
  // List variant (compact horizontal layout)
  if (variant === "list") {
    return (
      <Card
        className={`py-0 group cursor-pointer hover:shadow-lg transition-all hover:border-blue-500/50 ${className}`}
        onClick={onClick}
      >
        <CardContent className="p-4 flex gap-4">
          {/* Event Icon/Badge */}
          <div className="w-16 h-16 rounded-lg shrink-0 flex items-center justify-center bg-blue-100 text-blue-600 text-2xl font-semibold">
            EVENT!
          </div>

          {/* Event Details */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm mb-1 group-hover:text-blue-600 transition-colors line-clamp-2">
              {event.title}
            </h3>
            <p className="text-xs text-muted-foreground mb-1">
              {format(new Date(event.date), "EEE, dd MMM, HH:mm")}
            </p>
            {event.location && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                <MapPin className="w-3 h-3" />
                <span className="line-clamp-1">{event.location}</span>
              </div>
            )}
            {event.capacity && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Users className="w-3 h-3" />
                <span>{event.registrationCount || 0} / {event.capacity} attending</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Grid variant (default)
  return (
    <Card
      className={`overflow-hidden group cursor-pointer hover:shadow-lg transition-all hover:border-blue-500/50 ${className}`}
      onClick={onClick}
    >
      {/* Event Header */}
      <div className="relative h-32 bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
        <div className="text-5xl">EVENT</div>
        <div className="absolute top-3 right-3">
          <Badge variant="secondary" className="bg-white text-blue-600">
            Event
          </Badge>
        </div>
      </div>

      <CardContent className="space-y-3 pt-4">
        <div>
          <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-blue-600 transition-colors">
            {event.title}
          </h3>
          {event.description && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {event.description}
            </p>
          )}
        </div>

        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 flex-shrink-0" />
            <span>{format(new Date(event.date), "PPP p")}</span>
          </div>
          
          {event.location && (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <span className="line-clamp-1">{event.location}</span>
            </div>
          )}
          
          {event.capacity && (
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 flex-shrink-0" />
              <span>{event.registrationCount || 0} / {event.capacity} registered</span>
            </div>
          )}
        </div>

        {action && (
          <div className="flex gap-2 pt-3">
            {/* Primary button - View Details */}
            <Link href={`/event/${event._id}`} className="flex-1">
              <Button
                variant="outline"
                size="sm"
                className="w-full gap-2"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <Eye className="w-4 h-4" />
                View Details
              </Button>
            </Link>

            {/* Secondary button - delete / cancel */}
            {onDelete && (
              <Button
                variant="outline"
                size="sm"
                className="gap-2 text-red-500 hover:text-red-600 hover:bg-red-50"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(event._id);
                }}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
