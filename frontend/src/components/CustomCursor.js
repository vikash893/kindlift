import React, { useEffect, useRef } from 'react';

export const CustomCursor = () => {
  const cursorRef = useRef(null);
  const pos = useRef({ x: -100, y: -100 });
  const targetPos = useRef({ x: -100, y: -100 });
  const visible = useRef(false);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const cursor = cursorRef.current;
    if (!cursor) return;

    const onMouseMove = (e) => {
      targetPos.current = { x: e.clientX, y: e.clientY };
      if (!visible.current) {
        visible.current = true;
        cursor.style.opacity = '1';
        pos.current = { x: e.clientX, y: e.clientY };
      }
    };

    const onMouseLeave = () => {
      visible.current = false;
      cursor.style.opacity = '0';
    };

    const onMouseEnter = () => {
      visible.current = true;
      cursor.style.opacity = '1';
    };

    // Hide on form inputs
    const hideOnInput = () => cursor.style.opacity = '0';
    const showAfterInput = () => { if (visible.current) cursor.style.opacity = '1'; };

    const bindInputs = () => {
      document.querySelectorAll('input, textarea, select').forEach(el => {
        el.removeEventListener('mouseenter', hideOnInput);
        el.removeEventListener('mouseleave', showAfterInput);
        el.addEventListener('mouseenter', hideOnInput);
        el.addEventListener('mouseleave', showAfterInput);
      });
    };

    // Smooth follow
    let raf;
    const lerp = (a, b, t) => a + (b - a) * t;
    const follow = () => {
      pos.current.x = lerp(pos.current.x, targetPos.current.x, 0.12);
      pos.current.y = lerp(pos.current.y, targetPos.current.y, 0.12);
      cursor.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px)`;
      raf = requestAnimationFrame(follow);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);
    raf = requestAnimationFrame(follow);
    bindInputs();

    const observer = new MutationObserver(bindInputs);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, []);

  return <div ref={cursorRef} className="custom-cursor" style={{ opacity: 0 }} />;
};
