import { css, keyframes } from '@emotion/css';
import { useStyles2 } from '@grafana/ui';
import React from 'react';

const getStyles = () => {
  const keyframeSpinner = keyframes`
    to {
        transform: rotate(1turn);
    }
  `;
  return {
    wrapper: css`
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    `,
    spinner: css`
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: 6.4px solid;
      border-color: #dbdcef;
      border-right-color: #1f6feb;
      animation: ${keyframeSpinner} 1s infinite linear;
    `,
  };
};

export const SpinnerLoader: React.FC = () => {
  const styles = useStyles2(getStyles);
  return (
    <div className={styles.wrapper}>
      <div className={styles.spinner}></div>
    </div>
  );
};
