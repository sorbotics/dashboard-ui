import { css, cx } from '@emotion/css';
import React, { FC } from 'react';

export interface BrandComponentProps {
  className?: string;
  children?: JSX.Element | JSX.Element[];
}

export const LoginLogo: FC<BrandComponentProps & { logo?: string }> = ({ className, logo }) => {
  return <img className={className} src={`${logo ? logo : 'public/img/grafana_icon.svg'}`} alt="Dashboard" />;
};

const LoginBackground: FC<BrandComponentProps> = ({ className, children }) => {
  const background = css({
    background: '#fff',
    minHeight: '100%',
    width: '100%',
  });

  return <div className={cx(background, className)}>{children}</div>;
};

const MenuLogo: FC<BrandComponentProps> = ({ className }) => {
  return <img className={className} src="public/img/grafana_icon.svg" alt="Dashboard" />;
};

const LoginBoxBackground = () => {
  return css({
    background: '#fff',
    boxShadow: '0 2px 10px 0 rgba(38, 44, 71, 0.16)',
    borderRadius: '4px',
  });
};

export class Branding {
  static LoginLogo = LoginLogo;
  static LoginBackground = LoginBackground;
  static MenuLogo = MenuLogo;
  static LoginBoxBackground = LoginBoxBackground;
  static AppTitle = 'Dashboard';
  static LoginTitle = 'Dashboard';
  static HideEdition = false;
  static GetLoginSubTitle = (): null | string => {
    return null;
  };
}
