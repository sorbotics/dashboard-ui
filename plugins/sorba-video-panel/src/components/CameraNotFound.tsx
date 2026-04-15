import { css } from '@emotion/css';
import { useStyles2 } from '@grafana/ui';
import React from 'react';

interface CameraNotFoundProps {
  message?: string
}

const getStyles = () => {
  return {
    wrapper: css`
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      background: rgb(17, 18, 23);
    `,
    svg: css`
      width: 24px;
      height: 24px;
    `,
    text: css`
      margin-left: 5px;
    `,
  };
};

export const CameraNotFound: React.FC<CameraNotFoundProps> = ({ message = 'Camera not found'}) => {
  const styles = useStyles2(getStyles);
  return (
    <div className={styles.wrapper}>
      <svg xmlns="http://www.w3.org/2000/svg" className={styles.svg} viewBox="0 0 512 512">
        <title>Alert Circle</title>
        <path
          d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192 192-86 192-192z"
          fill="none"
          stroke="currentColor"
          strokeMiterlimit="10"
          strokeWidth="32"
        />
        <path
          d="M250.26 166.05L256 288l5.73-121.95a5.74 5.74 0 00-5.79-6h0a5.74 5.74 0 00-5.68 6z"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="32"
        />
        <path d="M256 367.91a20 20 0 1120-20 20 20 0 01-20 20z" 
           fill="none"
           stroke="currentColor"
           strokeLinecap="round"
           strokeLinejoin="round"
           strokeWidth="22"
        />
      </svg>
      <span className={styles.text}>{message}</span>
    </div>
  );
};
