import React, { useMemo } from 'react';
import { PanelProps, DataFrame, Field } from '@grafana/data';
import { getTemplateSrv, getLocationSrv } from '@grafana/runtime';
import { SimpleOptions, defaults } from './types';
import merge from 'deepmerge';
import _ from 'lodash';
import AutoSizer from 'react-virtualized-auto-sizer';
import { PlotlyChart } from './PlotlyChart';

interface Props extends PanelProps<SimpleOptions> {}

/**
 * Shim: convert Grafana 13's `DataFrame[]` (the modern data API) to the old
 * `{series: [...], fields: [...], values: {buffer: [...]}}` shape that the
 * user's pre-Grafana-13 scripts expect.
 *
 * The sorba motor-* templates were generated against the ae3e-plotly-panel
 * v0.5.0 (Grafana 7-10) API which used `data.series[].fields[].values.buffer`.
 * In Grafana 11+, this.props.data is `DataFrame[]` with `fields[].values` as
 * a `Vector<T>`. The shim bridges the two so the user's scripts continue
 * to work without modification.
 */
function dataFrameArrayToLegacyData(
  input: DataFrame[] | { series?: DataFrame[] } | undefined
): {
  series: Array<{
    name: string;
    refId: string;
    fields: Array<{
      name: string;
      type: string;
      values: { buffer: any[] };
    }>;
  }>;
} {
  // Accept both the raw DataFrame[] array and the Grafana 13 PanelData wrapper.
  let frames: DataFrame[] | undefined = Array.isArray(input)
    ? input
    : (input as any)?.series;

  if (!frames || frames.length === 0) {
    return { series: [] };
  }

  // The legacy scripts use `data.series[].fields[].values.buffer`. We preserve
  // the field order exactly as the datasource returns it so existing scripts
  // continue to work without modification.
  const readFieldValues = (field: Field): any[] => {
    let buffer: any[] = [];
    try {
      if (typeof (field.values as any).toArray === 'function') {
        buffer = (field.values as any).toArray();
      } else if (Array.isArray(field.values)) {
        buffer = field.values as any[];
      } else if (field.values && typeof (field.values as any).length === 'number') {
        const len = (field.values as any).length;
        buffer = new Array(len);
        for (let i = 0; i < len; i++) {
          buffer[i] = (field.values as any).get ? (field.values as any).get(i) : (field.values as any)[i];
        }
      }
    } catch (e) {
      buffer = [];
    }
    return buffer;
  };

  return {
    series: frames.map((frame) => ({
      name: frame.name ?? '',
      refId: frame.refId ?? '',
      fields: (frame.fields || []).map((field: Field) => ({
        name: field.name,
        type: String(field.type),
        values: { buffer: readFieldValues(field) },
      })),
    })),
  };
}

export const SimplePanel: React.FC<Props> = ({ options, data, height, width, replaceVariables, fieldConfig }) => {
  const templateSrv = getTemplateSrv();

  // Build the `variables` context the script receives. Mirrors the Grafana 7-10
  // shape that the user's scripts expect (__from, __to, __interval, etc. plus
  // the dashboard's template variables).
  const context = useMemo(() => {
    const ctx: Record<string, any> = {
      __from: replaceVariables('$__from'),
      __to: replaceVariables('$__to'),
      __interval: replaceVariables('$__interval'),
      __interval_ms: replaceVariables('$__interval_ms'),
    };
    try {
      templateSrv.getVariables().forEach((elt: any) => {
        ctx[elt.name] = elt.current?.text;
      });
    } catch (_) {
      // ignore — getVariables() can throw in some contexts
    }
    return ctx;
  }, [replaceVariables, templateSrv]);

  const config = options.config || defaults.config;
  const baseData = options.data || defaults.data;
  const baseLayout = options.layout || defaults.layout;
  const baseFrames = options.frames || defaults.frames;

  // Run the user-provided script with the legacy data shape. The script is a
  // string of JS that takes `(data, variables)` and returns an object with
  // optional `data`, `layout`, `config`, `frames` properties.
  const { error, scriptOutput } = useMemo<{ error: Error | null; scriptOutput: any }>(() => {
    if (!options.script || options.script === '') {
      return { error: null, scriptOutput: null };
    }
    // Grafana 13 passes `PanelData` with the actual frames in `.series`.
    const frames = Array.isArray(data) ? data : (data as any)?.series;
    const legacyData = dataFrameArrayToLegacyData(frames as DataFrame[]);
    try {
      const f = new Function('data,variables', options.script);
      const result = f(legacyData, context);
      if (!result) {
        return { error: new Error('Script must return values'), scriptOutput: null };
      }
      return { error: null, scriptOutput: result };
    } catch (e: any) {
      console.error('Plotly script error:', e);
      return { error: e, scriptOutput: null };
    }
  }, [options.script, data, context]);

  const layout = { ...baseLayout, autosize: true, height };
  const combineMerge = (target: any[], source: any[], options: any) => {
    const destination = target.slice();
    source.forEach((item, index) => {
      if (typeof destination[index] === 'undefined') {
        destination[index] = options.cloneUnlessOtherwiseSpecified(item, options);
      } else if (options.isMergeableObject(item)) {
        destination[index] = merge(target[index], item, options);
      } else if (target.indexOf(item) === -1) {
        destination.push(item);
      }
    });
    return destination;
  };

  const finalData = scriptOutput?.data
    ? merge(baseData, scriptOutput.data, { arrayMerge: combineMerge as any })
    : baseData;
  const finalLayout = scriptOutput?.layout ? merge(layout, scriptOutput.layout) : layout;
  const finalConfig = scriptOutput?.config ? merge(config, scriptOutput.config) : config;
  const finalFrames = scriptOutput?.frames
    ? merge(baseData, scriptOutput.frames, { arrayMerge: combineMerge as any })
    : baseFrames;

  if (error) {
    const matches = error.stack?.match(/anonymous>:.*\)/m);
    const lines = matches ? matches[0].slice(0, -1).split(':') : null;
    return (
      <div>
        There&apos;s an error in your script : <br />
        <span style={{ color: '#D00' }}>{error.toString()}</span>{' '}
        {lines ? `- line ${parseInt(lines[1], 10) - 2}:${lines[2]}` : ''} (Check your console for more details)
      </div>
    );
  }

  return (
    <AutoSizer disableHeight>
      {({ width: autoWidth }) => (
        <PlotlyChart
          style={{ width: autoWidth || width || '100%', height: height || '100%' }}
          data={finalData}
          frames={finalFrames}
          layout={finalLayout}
          config={finalConfig}
          onInitialized={(figure: any, graphDiv: any) => {
            // no-op; kept for parity with the original plugin
            void figure;
            void graphDiv;
          }}
          useResizeHandler={true}
          onClick={(clickData: any) => {
            if (!options.onclick || options.onclick === '') {
              return;
            }
            try {
              const f = new Function('data', 'getLocationSrv', 'getTemplateSrv', options.onclick);
              f(clickData, getLocationSrv, getTemplateSrv);
            } catch (e) {
              console.error('Plotly onclick error:', e);
            }
          }}
        />
      )}
    </AutoSizer>
  );
};
