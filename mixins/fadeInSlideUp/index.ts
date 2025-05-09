export const fadeInSlideUp = (delay: number, duration = 0.3) => ({
  animation: `fadeInSlideUp ${duration}s ease-out ${delay * 77}ms forwards`,
});

export const slideUp = (delay: number, duration = 0.3) => ({
  animation: `slideUp ${duration}s ease-out ${delay * 77}ms forwards`,
});
