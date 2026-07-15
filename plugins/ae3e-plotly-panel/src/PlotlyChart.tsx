import React, { useEffect, useRef, useCallback } from 'react';
import Plotly from 'plotly.js-dist-min';

interface PlotlyChartProps {
  data: any[];
  layout: any;
  config: any;
  frames?: any[];
  style?: React.CSSProperties;
  useResizeHandler?: boolean;
  onClick?: (data: any) => void;
  onInitialized?: (figure: any, graphDiv: any) => void;
}

export const PlotlyChart: React.FC<PlotlyChartProps> = ({
  data,
  layout,
  config,
  frames,
  style,
  useResizeHandler,
  onClick,
  onInitialized,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);
  const clickHandlerRef = useRef(onClick);

  // Keep the latest click handler in a ref so we don't re-attach listeners on every render.
  useEffect(() => {
    clickHandlerRef.current = onClick;
  }, [onClick]);

  const renderPlot = useCallback(async () => {
    if (!containerRef.current) return;

    try {
      if (!initializedRef.current) {
        await Plotly.newPlot(containerRef.current, data, layout, config);
        initializedRef.current = true;
        if (frames && frames.length > 0) {
          await Plotly.addFrames(containerRef.current, frames);
        }
        if (onInitialized) {
          onInitialized({ data, layout, frames }, containerRef.current);
        }
      } else {
        await Plotly.react(containerRef.current, data, layout, config);
        if (frames && frames.length > 0) {
          await Plotly.addFrames(containerRef.current, frames);
        }
      }
    } catch (e) {
      console.error('[sorba-plotly-panel] Plotly render error:', e);
    }
  }, [data, layout, config, frames, onInitialized]);

  // Main render effect.
  useEffect(() => {
    renderPlot();
  }, [renderPlot]);

  // Attach click listener.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handler = (eventData: any) => {
      clickHandlerRef.current?.(eventData);
    };

    // Plotly attaches event methods to the DOM node after newPlot.
    // Use a small delay on first render to ensure the methods exist.
    const attach = () => {
      if (typeof (el as any).on === 'function') {
        (el as any).on('plotly_click', handler);
      } else {
        setTimeout(attach, 50);
      }
    };
    attach();

    return () => {
      if (typeof (el as any).removeListener === 'function') {
        (el as any).removeListener('plotly_click', handler);
      }
    };
  }, []);

  // Resize handler.
  useEffect(() => {
    if (!useResizeHandler) return;
    const el = containerRef.current;
    if (!el) return;

    const resizeHandler = () => {
      try {
        Plotly.Plots.resize(el);
      } catch (e) {
        // ignore resize errors when element is not attached
      }
    };

    window.addEventListener('resize', resizeHandler);
    return () => {
      window.removeEventListener('resize', resizeHandler);
    };
  }, [useResizeHandler]);

  // Cleanup on unmount.
  useEffect(() => {
    return () => {
      if (containerRef.current) {
        try {
          Plotly.purge(containerRef.current);
        } catch (e) {
          // ignore
        }
      }
      initializedRef.current = false;
    };
  }, []);

  return <div ref={containerRef} style={style} />;
};
