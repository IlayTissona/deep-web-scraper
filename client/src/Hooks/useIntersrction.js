import { useState, useEffect } from "react";

const useIntersection = (ref, rootMargin) => {
  const [isVisible, setState] = useState(false);
  const element = ref.current;
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setState(entry.isIntersecting);
      },
      { rootMargin }
    );

    element && observer.observe(element);

    return () => element && observer.unobserve(element);
  });

  return isVisible;
};

export default useIntersection;
