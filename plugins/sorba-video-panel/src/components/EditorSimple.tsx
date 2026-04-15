import { SelectableValue, StandardEditorProps } from '@grafana/data';
import { Select } from '@grafana/ui';
import React, { useEffect, useState } from 'react';
import { CameraConfig } from '../types/Camera';
import { useHost } from 'hooks';

export const SimpleEditor: React.FC<StandardEditorProps<string>> = ({ context, onChange }) => {
  const [options, setOptions] = useState<Array<SelectableValue<string>>>([]);
  const { host } = useHost();

  const selectedCameraOption = {
    label: context.options.camera,
    value: context.options.cameraId,
  };

  useEffect(() => {
    if (!host) {
      return;
    }

    fetch(`https://${host}/vision/api/config`)
      .then((response) => response.json())
      .then((json: CameraConfig) => {
        const cameras = Object.keys(json).map((cameraId) => {
          return {
            label: json[cameraId].cameras[cameraId].label,
            value: cameraId,
          };
        });
        setOptions(cameras);
      })
      .catch(() => {
        setOptions([]);
      });
  }, [host]);

  return (
    <Select
      options={options}
      value={selectedCameraOption}
      onChange={(selectableValue) => onChange(selectableValue.value)}
    />
  );
};
