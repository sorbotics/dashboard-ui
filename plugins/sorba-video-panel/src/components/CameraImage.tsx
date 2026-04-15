import { css } from '@emotion/css';
import { useStyles2 } from '@grafana/ui';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CameraNotFound } from './CameraNotFound';
import { SpinnerLoader } from './SpinnerLoader';
import { useHost } from 'hooks';

interface Props {
  cameraId?: null | number;
  onload: Function;
  scaledWidth?: number;
  scaledHeight?: number;
  searchParams?: string | URLSearchParams;
}

const getStyles = () => {
  return {
    wrapper: css`
      height: 100%;
      width: 100%;
    `,
  };
};

export const CameraImage: React.FC<Props> = ({
  cameraId = null,
  onload,
  scaledWidth = 200,
  scaledHeight = 200,
  searchParams = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [hasLoadedWithError, setHasLoadedWithError] = useState(false);
  const { host } = useHost();

  const img = useMemo(() => new Image(), []);
  img.onload = useCallback(
    (event) => {
      setHasLoaded(true);
      setHasLoadedWithError(false);
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, scaledWidth, scaledHeight);
        }
        onload && onload(event);
      }
    },
    [img, onload, scaledHeight, scaledWidth, setHasLoaded, canvasRef]
  );

  img.onerror = useCallback(
    (event) => {
      setHasLoaded(true);
      setHasLoadedWithError(true);
    },
    [setHasLoaded, setHasLoadedWithError]
  );

  useEffect(() => {
    if (!host && !cameraId) {
      return;
    }
    img.src = `https://${host}/vision/api/${cameraId}/latest.jpg?h=${scaledHeight}${
      searchParams ? `&${searchParams}` : ''
    }`;
  }, [host, canvasRef, cameraId, img, searchParams, scaledHeight, scaledWidth]);

  const styles = useStyles2(getStyles);

  return (
    <div className={styles.wrapper}>
      {!hasLoaded ? <SpinnerLoader /> : null}
      {hasLoaded && hasLoadedWithError ? <CameraNotFound /> : null}
      {hasLoaded && !hasLoadedWithError ? <canvas ref={canvasRef} height={scaledHeight} width={scaledWidth} /> : null}
    </div>
  );
};
