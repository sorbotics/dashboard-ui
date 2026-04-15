import { PanelPlugin } from '@grafana/data';
import { SimpleOptions } from './types';
import { SimplePanel } from './components/SimplePanel';
import { SimpleEditor } from 'components/EditorSimple';

export const plugin = new PanelPlugin<SimpleOptions>(SimplePanel).setPanelOptions((builder) => {
  return builder
    .addCustomEditor({
      id: 'camera',
      path: 'camera',
      name: 'Camera',
      editor: SimpleEditor,
    })
    .addBooleanSwitch({
      path: 'bbox',
      name: 'Bounding box',
      showIf: (config: SimpleOptions) => !!config.camera?.length,
    })
    .addBooleanSwitch({
      path: 'timestamp',
      name: 'Timestamp',
      showIf: (config: SimpleOptions) => !!config.camera?.length,
    })
    .addBooleanSwitch({
      path: 'zones',
      name: 'Zones',
      showIf: (config: SimpleOptions) => !!config.camera?.length,
    })
    .addBooleanSwitch({
      path: 'mask',
      name: 'Masks',
      showIf: (config: SimpleOptions) => !!config.camera?.length,
    })
    .addBooleanSwitch({
      path: 'motion',
      name: 'Motion boxes',
      showIf: (config: SimpleOptions) => !!config.camera?.length,
    })
    .addBooleanSwitch({
      path: 'regions',
      name: 'Regions',
      showIf: (config: SimpleOptions) => !!config.camera?.length,
    });
});
