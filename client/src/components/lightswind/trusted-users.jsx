import React from "react";
import { Star } from "lucide-react";
import { cn } from "../../lib/utils";
import { CountUp } from "./count-up";

const TrustedUsers = ({
  avatars = [],
  rating = 5,
  totalUsersText = 1000,
  caption = "Trusted by",
  className = "",
  starColorClass = "text-yellow-400",
  ringColors = [],
}) => {
  return (
    <div
      className={cn(
        "flex items-center justify-center gap-6 bg-transparent text-foreground py-4 px-4",
        className
      )}
    >
      {/* Avatars */}
      <div className="flex -space-x-4">
        {avatars.map((src, i) => (
          <div
            key={i}
            className={cn(
              "w-10 h-10 rounded-full overflow-hidden ring-1 ring-offset-2 ring-offset-black",
              ringColors[i] || "ring-blue-900"
            )}
          >
            <img
              src={src}
              alt={`Avatar ${i + 1}`}
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
            />
          </div>
        ))}
      </div>

      {/* Rating + Count */}
      <div className="flex flex-col items-start gap-1">
        <div className={cn("flex gap-1", starColorClass)}>
          {Array.from({ length: rating }).map((_, i) => (
            <Star key={i} fill="currentColor" className="w-4 h-4" />
          ))}
        </div>

        <span className="text-foreground text-xs md:text-md font-medium">
          {caption}
          <CountUp
            value={totalUsersText}
            duration={2}
            separator=","
            className="ml-1 text-lg"
            suffix="+"
            colorScheme="gradient"
          />
          <a
            className="ml-1 underline text-primarylw dark:text-greedy"
            href="/pricing"
          >
            Pro users
          </a>
        </span>
      </div>
    </div>
  );
};

export default TrustedUsers;