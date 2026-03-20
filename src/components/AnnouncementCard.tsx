import Image from "next/image";
import Link from "next/link";
import { MapPin, Clock, Timer, ChevronRight, Users, Eye } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { timeAgo, elapsedTime, urgencyLevel, urgencyLabel, cn, formatK } from "@/lib/utils";
import { CheckCircle } from "lucide-react";
import type { Announcement } from "@/types/announcement";

interface AnnouncementCardProps {
  announcement: Announcement;
}

export function AnnouncementCard({ announcement: a }: AnnouncementCardProps) {
  const isResolved = a.status === "resolved";
  const isFound = a.type === "found";
  const level = urgencyLevel(a.createdAt);
  const isCritical = level === "critical" && !isResolved && !isFound;
  const isUrgent = level === "urgent" && !isResolved && !isFound;
  const totalReach = a.stats.facebookReach + a.stats.whatsappChannelReach + a.stats.pushSent;

  return (
    <Link href={`/annonce/${a.shortCode}`}>
      <article
        className={cn(
          "relative rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer group",
          "transform hover:scale-[1.02] active:scale-[0.98]",
          isResolved
            ? "bg-gradient-to-br from-green-50 to-emerald-50 shadow-md shadow-green-100/50 ring-1 ring-green-200"
            : isFound
            ? "bg-gradient-to-br from-teal-50 to-emerald-50 shadow-md shadow-emerald-100/50 ring-1 ring-emerald-200"
            : isCritical
            ? "bg-gradient-to-br from-red-50 via-white to-orange-50 shadow-lg shadow-red-200/50 ring-2 ring-red-300"
            : isUrgent
            ? "bg-gradient-to-br from-orange-50 via-white to-amber-50 shadow-md shadow-orange-100/50 ring-1 ring-orange-200"
            : "bg-white shadow-md shadow-gray-100/50 ring-1 ring-gray-100 hover:shadow-lg"
        )}
      >
        {/* Barre d'urgence animée pour les cas critiques */}
        {isCritical && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-orange-500 to-red-500 bg-[length:200%_100%] animate-pulse" />
        )}

        {/* Header avec statut */}
        <div
          className={cn(
            "px-4 py-2.5 flex items-center justify-between",
            isResolved
              ? "bg-gradient-to-r from-green-500 to-emerald-500"
              : isFound
              ? "bg-gradient-to-r from-teal-500 to-emerald-500"
              : isCritical
              ? "bg-gradient-to-r from-red-600 via-red-500 to-orange-500"
              : isUrgent
              ? "bg-gradient-to-r from-orange-500 to-amber-500"
              : "bg-gradient-to-r from-gray-600 to-gray-500"
          )}
        >
          <div className="flex items-center gap-2">
            {isCritical && (
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white" />
              </span>
            )}
            <span className="text-white text-xs font-bold tracking-wide uppercase">
              {isResolved ? "✅ Retrouvé" : isFound ? "🙋 Enfant trouvé" : `🚨 ${urgencyLabel(level)}`}
            </span>
          </div>
          <span className="text-white/80 text-xs font-mono">{a.shortCode}</span>
        </div>

        {/* Corps principal */}
        <div className="p-4">
          {/* Photo + Infos principales */}
          <div className="flex gap-4">
            {/* Photo agrandie avec effet */}
            <div className={cn(
              "relative flex-shrink-0 rounded-2xl overflow-hidden",
              "w-24 h-24 sm:w-28 sm:h-28",
              isCritical ? "ring-3 ring-red-400 ring-offset-2" : isUrgent ? "ring-2 ring-orange-300 ring-offset-1" : "ring-1 ring-gray-200"
            )}>
              {a.childPhotoURL ? (
                <Image
                  src={a.childPhotoURL}
                  alt={`Photo de ${a.childName}`}
                  fill
                  sizes="(max-width: 640px) 96px, 112px"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <span className="text-4xl">{a.childGender === "F" ? "👧" : "👦"}</span>
                </div>
              )}
              {/* Badge âge sur la photo */}
              <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {a.childAge} ans
              </div>
            </div>

            {/* Infos */}
            <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
              <div>
                <h3 className={cn(
                  "font-extrabold text-lg sm:text-xl leading-tight truncate",
                  isResolved ? "text-green-800" : isCritical ? "text-red-900" : "text-gray-900"
                )}>
                  {a.childName}
                </h3>
                <p className="text-gray-500 text-sm font-medium mt-0.5">
                  {a.childGender === "M" ? "Garçon" : "Fille"}
                </p>
              </div>

              {/* Lieu */}
              <div className={cn(
                "flex items-start gap-1.5 mt-2 text-sm",
                isFound ? "text-emerald-700" : isResolved ? "text-green-700" : "text-gray-600"
              )}>
                <MapPin className={cn(
                  "w-4 h-4 flex-shrink-0 mt-0.5",
                  isFound ? "text-emerald-500" : isResolved ? "text-green-500" : isCritical ? "text-red-500" : "text-gray-400"
                )} />
                <span className="line-clamp-2">{isFound ? "Trouvé à: " : ""}{a.lastSeenPlace}</span>
              </div>
            </div>
          </div>

          {/* Timer / Statut - Mise en avant */}
          <div className={cn(
            "mt-4 rounded-xl px-4 py-3 flex items-center justify-between",
            isResolved
              ? "bg-green-100/80"
              : isFound
              ? "bg-emerald-100/80"
              : isCritical
              ? "bg-gradient-to-r from-red-100 to-orange-100"
              : isUrgent
              ? "bg-orange-100/80"
              : "bg-gray-100/80"
          )}>
            {!isResolved && !isFound ? (
              <>
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center",
                    isCritical ? "bg-red-500" : isUrgent ? "bg-orange-500" : "bg-gray-500"
                  )}>
                    <Timer className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className={cn(
                      "text-xs font-medium",
                      isCritical ? "text-red-600" : isUrgent ? "text-orange-600" : "text-gray-500"
                    )}>
                      Disparu depuis
                    </p>
                    <p className={cn(
                      "font-bold text-base",
                      isCritical ? "text-red-700" : isUrgent ? "text-orange-700" : "text-gray-700"
                    )}>
                      {elapsedTime(a.lastSeenAt || a.createdAt)}
                    </p>
                  </div>
                </div>
                <ChevronRight className={cn(
                  "w-5 h-5",
                  isCritical ? "text-red-400" : isUrgent ? "text-orange-400" : "text-gray-400"
                )} />
              </>
            ) : isFound ? (
              <>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-emerald-600">Trouvé</p>
                    <p className="font-bold text-base text-emerald-700">{timeAgo(a.createdAt)}</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-emerald-400" />
              </>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-green-600">Retrouvé</p>
                    <p className="font-bold text-base text-green-700">{timeAgo(a.resolvedAt || a.updatedAt)}</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-green-400" />
              </>
            )}
          </div>

          {/* Stats de diffusion - Compact et visuel */}
          {totalReach > 0 && (
            <div className="mt-3 flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5 text-gray-500">
                <Eye className="w-4 h-4" />
                <span className="font-semibold text-gray-700">{formatK(totalReach)}</span>
                <span>personnes touchées</span>
              </div>
              {(a.stats.facebookShares > 0 || a.stats.whatsappChannelReach > 0) && (
                <div className="flex items-center gap-1.5 text-gray-500">
                  <Users className="w-4 h-4" />
                  <span className="font-semibold text-gray-700">
                    {formatK(a.stats.facebookShares + Math.floor(a.stats.whatsappChannelReach / 10))}
                  </span>
                  <span>partages</span>
                </div>
              )}
            </div>
          )}

          {/* Tags */}
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge variant="gray">📍 {a.zoneName}</Badge>
            {isFound && <Badge variant="green">🙋 Cherche ses parents</Badge>}
          </div>
        </div>
      </article>
    </Link>
  );
}

