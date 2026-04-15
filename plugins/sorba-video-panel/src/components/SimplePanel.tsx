import React, { useMemo, useState } from 'react';
import { PanelProps } from '@grafana/data';
import { SimpleOptions } from 'types';
import { css, cx } from '@emotion/css';
import { CameraNotFound } from './CameraNotFound';
import { AutoUpdatingCameraImage } from './AutoUpdatingCameraImage';
import { isEqual } from 'lodash';

interface Props extends PanelProps<SimpleOptions> {}

export const SimplePanel: React.FC<Props> = ({ options, data, width, height }) => {
  const cameraId = options.cameraId as any;
  const hasCamera = !!options.camera;
  const values = options as any;
  const scaledWidth = Math.round(width);
  const scaledHeight = Math.round(height);

  const [oldOptions, setOldOptions] = useState({});

  const searchParams = useMemo(
    () =>
      new URLSearchParams(
        Object.keys(values).reduce((memo: any, key: string) => {
          memo.push([key, values[key] === true ? '1' : '0']);
          return memo;
        }, [])
      ),
    [values]
  );
  if (Object.values(options).length && !isEqual(options, oldOptions)) {
    setOldOptions(options);
  }

  return (
    <div
      className={cx(
        css`
          width: ${width}px;
          height: ${height}px;
        `
      )}
    >
      {hasCamera ? (
        <AutoUpdatingCameraImage
          cameraId={cameraId}
          scaledWidth={scaledWidth}
          scaledHeight={scaledHeight}
          searchParams={searchParams}
        />
      ) : (
        <CameraNotFound message="No camera selected" />
      )}
    </div>
  );
};
