// Sorba Plotly panel types — adapted from ae3e-plotly-panel for Grafana 13
// The `data` and `frames` fields are typed as `any` because they hold Plotly trace
// objects (which have no stable schema). The `layout` and `config` are also `any`
// because they mirror Plotly's option objects 1:1.

export interface SimpleOptions {
  title: string;
  layout: any;
  config: any;
  data: any[];
  frames: any[];
  script: string;
  onclick: string;
}

export type EditorCodeType = string | undefined;
export type EditorLanguageType = 'javascript' | 'html' | 'json' | undefined;

export const defaults: SimpleOptions = {
  title: 'title',
  layout: {
    font: {
      color: 'darkgrey',
    },
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    margin: {
      t: 30,
      b: 20,
    },
    xaxis: {
      type: 'date',
    },
  },
  config: {
    displayModeBar: false,
  },
  data: [
    {
      type: 'scatter',
      mode: 'lines',
      line: { color: 'red', width: 2 },
    },
  ],
  frames: [],
  script: `var trace = {
  x: data.series[0].fields[0].values.buffer,
  y: data.series[0].fields[1].values.buffer
};

return {data:[trace],layout:{title:'My Chart'}};`,
  onclick: `window.updateVariables({query:{'var-project':'test'}, partial: true})`,
};
