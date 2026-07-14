import { css, cx } from '@emotion/css';
import { type FC, type JSX } from 'react';

import { type GrafanaTheme2, type NavModelItem } from '@grafana/data';
import { selectors } from '@grafana/e2e-selectors';
import { reportInteraction } from '@grafana/runtime';
import { Tooltip, useStyles2 } from '@grafana/ui';
import grafanaIconSvg from 'img/grafana_icon.svg';

export interface BrandComponentProps {
  className?: string;
  children?: JSX.Element | JSX.Element[];
}

export const LoginLogo: FC<BrandComponentProps & { logo?: string }> = ({ className, logo }) => {
  return <img className={className} src={`${logo ? logo : grafanaIconSvg}`} alt="Dashboard" />;
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
  return <img className={className} src={grafanaIconSvg} alt="Dashboard" />;
};

/**
 * inMegaMenuOverlay = true we just render the logo without link (used in mega menu)
 */
export function HomeLink({ homeNav, inMegaMenuOverlay }: { homeNav?: NavModelItem; inMegaMenuOverlay?: boolean }) {
  const styles = useStyles2(homeLinkStyles);

  const onHomeClicked = () => {
    reportInteraction('grafana_home_clicked');
  };

  if (inMegaMenuOverlay) {
    return (
      <div className={styles.homeLink}>
        <Branding.MenuLogo />
      </div>
    );
  }

  return (
    <Tooltip placement="bottom" content={homeNav?.text || 'Home'}>
      <a
        onClick={onHomeClicked}
        data-testid={selectors.components.Breadcrumbs.breadcrumb('Home')}
        className={styles.homeLink}
        title={homeNav?.text || 'Home'}
        href={homeNav?.url}
      >
        <Branding.MenuLogo />
      </a>
    </Tooltip>
  );
}

function homeLinkStyles(theme: GrafanaTheme2) {
  return {
    homeLink: css({
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: theme.spacing(9),
      width: theme.spacing(9),
      margin: theme.spacing(0, 0.5),
      img: {
        maxHeight: '100%',
        maxWidth: '100%',
      },
    }),
  };
}

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
