'use client';

import { useEffect, useState } from 'react';

export default function HeaderSpacer() {
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const header = document.querySelector('header');
    if (!header) return;
    setHeight(header.offsetHeight);
    const ro = new ResizeObserver(() => setHeight(header.offsetHeight));
    ro.observe(header);
    return () => ro.disconnect();
  }, []);

  return <div style={{ height }} aria-hidden />;
}
