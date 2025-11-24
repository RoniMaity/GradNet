"use client"
import * as React from "react";
import { cn } from "@/lib/utils";
import { useMotionTemplate, useMotionValue, motion } from "motion/react";

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  const radius = 120;
  const [visible, setVisible] = React.useState(false);

  let mouseX = useMotionValue(0);
  let mouseY = useMotionValue(0);

  function handleMouseMove({
    currentTarget,
    clientX,
    clientY
  }) {
    let { left, top } = currentTarget.getBoundingClientRect();

    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }
  return (
    <motion.div
      style={{
        background: useMotionTemplate`
      radial-gradient(
        ${visible ? radius + "px" : "0px"} circle at ${mouseX}px ${mouseY}px,
        rgba(45, 212, 191, 0.35),
        transparent 70%
      )
    `,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      className="group/input rounded-2xl border border-white/10 bg-white/5 p-[2px] backdrop-blur-lg transition duration-500 hover:border-cyan-200/60">
      <input
        type={type}
        className={cn(
          `flex h-12 w-full rounded-[1rem] border border-white/5 bg-slate-950/60 px-4 text-base text-white shadow-[0_20px_60px_rgba(3,7,18,0.55)] transition duration-300 placeholder:text-white/50 focus-visible:border-cyan-200/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/60 disabled:cursor-not-allowed disabled:opacity-60`,
          className
        )}
        ref={ref}
        {...props} />
    </motion.div>
  );
});
Input.displayName = "Input";

export { Input };
