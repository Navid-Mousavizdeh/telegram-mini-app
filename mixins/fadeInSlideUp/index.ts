export const fadeInSlideUp = (delay: number, duration?: number) => ({
  opacity: 0,
  animation: `fadeInSlideUp ${duration ?? 0.3}s ease-out ${
    delay * 77
  }ms forwards`,
  "@keyframes fadeInSlideUp": {
    "0%": { opacity: 0, transform: "translateY(5%)" },
    "100%": { opacity: 1, transform: "translateY(0)" },
  },
});

export const SlideUp = (delay: number, duration?: number) => ({
  animation: `fadeInSlideUp ${duration ?? 0.3}s ease-out ${
    delay * 77
  }ms forwards`,
  "@keyframes fadeInSlideUp": {
    "0%": { opacity: 1, transform: "translateY(10px)" },
    "100%": { opacity: 1, transform: "translateY(0)" },
  },
});
