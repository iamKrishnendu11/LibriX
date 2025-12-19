import * as React from "react";
import { cn } from "../../lib/utils";

/* -------------------- Card -------------------- */

const Card = React.forwardRef(function Card(
  {
    className,
    hoverable = false,
    bordered = false,
    compact = false,
    ...props
  },
  ref
) {
  return (
    <div
      ref={ref}
      className={cn(
        "rounded-lg bg-background/70 text-card-foreground shadow-sm",
        bordered ? "border" : "border-none",
        hoverable ? "transition-shadow duration-200 hover:shadow-md" : "",
        compact ? "p-3" : "p-0",
        className
      )}
      {...props}
    />
  );
});

Card.displayName = "Card";

/* -------------------- CardHeader -------------------- */

const CardHeader = React.forwardRef(function CardHeader(
  { className, spacing = "default", ...props },
  ref
) {
  const spacingClasses = {
    compact: "flex flex-col space-y-1 p-4",
    default: "flex flex-col space-y-1.5 p-6",
    relaxed: "flex flex-col space-y-2 p-8",
  };

  return (
    <div
      ref={ref}
      className={cn(spacingClasses[spacing], className)}
      {...props}
    />
  );
});

CardHeader.displayName = "CardHeader";

/* -------------------- CardTitle -------------------- */

const CardTitle = React.forwardRef(function CardTitle(
  { className, as: Component = "h3", size = "default", ...props },
  ref
) {
  const sizeClasses = {
    sm: "text-lg",
    default: "text-2xl",
    lg: "text-3xl",
  };

  return (
    <Component
      ref={ref}
      className={cn(
        "font-semibold leading-none tracking-tight",
        sizeClasses[size],
        className
      )}
      {...props}
    />
  );
});

CardTitle.displayName = "CardTitle";

/* -------------------- CardDescription -------------------- */

const CardDescription = React.forwardRef(function CardDescription(
  { className, size = "default", ...props },
  ref
) {
  const sizeClasses = {
    xs: "text-xs",
    sm: "text-sm",
    default: "text-sm",
  };

  return (
    <p
      ref={ref}
      className={cn("text-muted-foreground", sizeClasses[size], className)}
      {...props}
    />
  );
});

CardDescription.displayName = "CardDescription";

/* -------------------- CardContent -------------------- */

const CardContent = React.forwardRef(function CardContent(
  { className, removeTopPadding = true, padding = "default", ...props },
  ref
) {
  const paddingClasses = {
    none: "p-0",
    sm: "px-4 py-3",
    default: "p-6",
    lg: "p-8",
  };

  return (
    <div
      ref={ref}
      className={cn(
        paddingClasses[padding],
        removeTopPadding && padding !== "none" ? "pt-0" : "",
        className
      )}
      {...props}
    />
  );
});

CardContent.displayName = "CardContent";

/* -------------------- CardFooter -------------------- */

const CardFooter = React.forwardRef(function CardFooter(
  { className, align = "center", direction = "row", ...props },
  ref
) {
  const alignClasses = {
    start: "justify-start",
    center: "justify-center",
    end: "justify-end",
    between: "justify-between",
    around: "justify-around",
  };

  const directionClasses = {
    row: "flex-row",
    column: "flex-col",
  };

  return (
    <div
      ref={ref}
      className={cn(
        "flex items-center p-6 pt-0",
        alignClasses[align],
        directionClasses[direction],
        className
      )}
      {...props}
    />
  );
});

CardFooter.displayName = "CardFooter";

/* -------------------- Exports -------------------- */

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};