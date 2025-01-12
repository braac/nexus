import { cn } from "@/lib/utils"
import * as React from "react"

interface GradientTextProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Array of colors for the gradient
   * @default ["#ffaa40", "#9c40ff", "#ffaa40"]
   */
  colors?: string[]
  /**
   * Animation duration in seconds
   * @default 8
   */
  animationSpeed?: number
  /**
   * Show animated border
   * @default false
   */
  showBorder?: boolean
  /**
   * Show pointer cursor on hover
   * @default false
   */
  interactive?: boolean
  /**
   * Children elements to render
   */
  children: React.ReactNode
}

export function GradientText({
  children,
  className,
  colors = ["#ffaa40", "#9c40ff", "#ffaa40"],
  animationSpeed = 8,
  showBorder = false,
  interactive = false,
  ...props
}: GradientTextProps) {
  const gradientStyle = {
    backgroundImage: `linear-gradient(to right, ${colors.join(", ")})`,
    animationDuration: `${animationSpeed}s`,
  }

  return (
    <div
      className={cn(
        "relative max-w-fit",
        showBorder && "p-[1px] rounded-[1.25rem] overflow-hidden",
        interactive && "cursor-pointer",
        className
      )}
      {...props}
    >
      {showBorder && (
        <div
          className="absolute inset-0 bg-cover z-0 animate-gradient"
          style={{
            ...gradientStyle,
            backgroundSize: "300% 100%",
          }}
        />
      )}
      <div
        className={cn(
          "relative",
          showBorder && "bg-background rounded-[1.25rem] p-2"
        )}
      >
        <div
          className="inline-block text-transparent bg-clip-text animate-gradient"
          style={{
            ...gradientStyle,
            backgroundSize: "300% 100%",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}