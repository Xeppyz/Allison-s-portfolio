import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import type { ButtonVariantsProps } from "./button-variants"
import { buttonVariants } from "./button-variants"
import { cn } from "../../lib/utils"

// ...existing code...
function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  ButtonVariantsProps & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button }
