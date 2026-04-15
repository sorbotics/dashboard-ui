import { useEffect, useState } from 'react';

function useHost() {
  const [host, setHost] = useState<string | null>(null);

  useEffect(() => {
    const url = new URL(window.location.href);
    setHost(url.host);
  }, []);

  return { host };
}

export { useHost };
