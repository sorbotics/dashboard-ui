// Code editor for the Plotly config fields (data, layout, config, script, onclick).
// Originally from https://github.com/gapitio/gapit-htmlgraphics-panel
// Adapted for React 18 + @emotion/react 11.
import React from 'react';
import { StandardEditorProps } from '@grafana/data';
import { CodeEditor, useTheme2 } from '@grafana/ui';
import AutoSizer from 'react-virtualized-auto-sizer';
import { css } from '@emotion/css';

interface Props extends StandardEditorProps<string, any, any> {}

export const PanelOptionCode: React.FC<Props> = ({ value, item, onChange }) => {
  let strValue: string;
  if (typeof value !== 'string') {
    strValue = JSON.stringify(value, null, 2);
  } else {
    strValue = value;
  }
  const theme = useTheme2();
  return (
    <AutoSizer
      disableHeight
      className={css`
        margin-bottom: 8px;
      `}
    >
      {({ width }) => (
        <CodeEditor
          language={item.settings?.language}
          showLineNumbers={item.settings?.language === 'javascript'}
          value={strValue === 'null' ? JSON.stringify(item.settings?.initValue, null, 2) : strValue}
          width={width}
          height="200px"
          onBlur={(code) => {
            let parsed: any = code;
            if (item.settings?.language === 'json' && code) {
              try {
                parsed = JSON.parse(code);
              } catch {
                parsed = code; // keep raw string if JSON is invalid
              }
            }
            onChange(parsed);
          }}
        />
      )}
    </AutoSizer>
  );
};
