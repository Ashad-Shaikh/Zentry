import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import LocomotiveScroll from "locomotive-scroll";
import "locomotive-scroll/dist/locomotive-scroll.css";

gsap.registerPlugin(ScrollTrigger);

const SmoothScrollProvider = ({ children }) => {
  const containerRef = useRef(null);
  const locoScrollRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const scroll = new LocomotiveScroll({
      el: containerRef.current,
      smooth: true,
      lerp: 0.075,
      multiplier: 1,
    });

    locoScrollRef.current = scroll;

    scroll.on("scroll", ScrollTrigger.update);

    // Wait for LocomotiveScroll to be ready before setting up ScrollTrigger
    setTimeout(() => {
      if (!scroll.scroll || !scroll.scroll.instance) return;

      ScrollTrigger.scrollerProxy(containerRef.current, {
        scrollTop(value) {
          return arguments.length
            ? scroll.scrollTo(value, { duration: 0, disableLerp: true })
            : scroll.scroll.instance.scroll.y;
        },
        getBoundingClientRect() {
          return {
            top: 0,
            left: 0,
            width: window.innerWidth,
            height: window.innerHeight,
          };
        },
        pinType: containerRef.current.style.transform ? "transform" : "fixed",
      });

      ScrollTrigger.addEventListener("refresh", scroll.update);
      ScrollTrigger.refresh();
    }, 100); // small delay to allow instance to be ready

    return () => {
      if (scroll) {
        scroll.off("scroll", ScrollTrigger.update);
        scroll.destroy();
      }
      ScrollTrigger.removeEventListener("refresh", scroll.update);
    };
  }, []);

  return (
    <div id="smooth-scroll" data-scroll-container ref={containerRef}>
      {children}
    </div>
  );
};

export default SmoothScrollProvider;
