import { css } from '@emotion/css';
import { useStyles2 } from '@grafana/ui';
import React, { useCallback, useState } from 'react';
import { CameraImage } from './CameraImage';

interface Props {
  cameraId?: number | null;
  searchParams?: string | URLSearchParams;
  scaledWidth?: number;
  scaledHeight?: number;
}

const getStyles = () => {
  return {
    wrapper: css`
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    `,
  };
};

const MIN_LOAD_TIMEOUT_MS = 200;

export const AutoUpdatingCameraImage: React.FC<Props> = ({
  cameraId,
  searchParams = '',
  scaledWidth,
  scaledHeight,
}) => {
  const [key, setKey] = useState(Date.now());
  const handleLoad = useCallback(() => {
    const loadTime = Date.now() - key;
    setTimeout(
      () => {
        setKey(Date.now());
      },
      loadTime > MIN_LOAD_TIMEOUT_MS ? 1 : MIN_LOAD_TIMEOUT_MS
    );
  }, [key]);

  const styles = useStyles2(getStyles);

  return (
    <div className={styles.wrapper}>
      <CameraImage
        cameraId={cameraId}
        onload={handleLoad}
        scaledWidth={scaledWidth}
        scaledHeight={scaledHeight}
        searchParams={`&cache=${key}&${searchParams}`}
      />
    </div>
  );
};
