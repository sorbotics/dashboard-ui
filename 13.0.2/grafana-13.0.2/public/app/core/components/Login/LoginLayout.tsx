import { cx, css } from '@emotion/css';
import * as React from 'react';

import { type GrafanaTheme2 } from '@grafana/data';
import { Trans } from '@grafana/i18n';
import { useStyles2 } from '@grafana/ui';

import { Branding } from '../Branding/Branding';
import { type BrandingSettings } from '../Branding/types';

interface InnerBoxProps {
  enterAnimation?: boolean;
}
export const InnerBox = ({ children, enterAnimation = true }: React.PropsWithChildren<InnerBoxProps>) => {
  const loginStyles = useStyles2(getLoginStyles);
  return <div className={cx(loginStyles.loginInnerBox, enterAnimation && loginStyles.enterAnimation)}>{children}</div>;
};

export interface LoginLayoutProps {
  /** Custom branding settings that can be used e.g. for previewing the Login page changes */
  branding?: BrandingSettings;
  isChangingPassword?: boolean;
}

export const LoginLayout = ({ children, branding, isChangingPassword }: React.PropsWithChildren<LoginLayoutProps>) => {
  const loginStyles = useStyles2(getLoginStyles);
  const loginTitle = branding?.loginTitle ?? Branding.LoginTitle;
  const loginBoxBackground = branding?.loginBoxBackground || Branding.LoginBoxBackground();
  const loginLogo = branding?.loginLogo;

  return (
    <Branding.LoginBackground
      className={cx(loginStyles.container, branding?.loginBackground)}
    >
      <div className={loginStyles.loginMain}>
        <div className={cx(loginStyles.loginContent, loginBoxBackground, 'login-content-box')}>
          <div className={loginStyles.loginLogoWrapper}>
            <Branding.LoginLogo className={loginStyles.loginLogo} logo={loginLogo} />
            <div className={loginStyles.titleWrapper}>
              {isChangingPassword ? (
                <h1 className={loginStyles.mainTitle}>
                  <Trans i18nKey="login.layout.update-password">Update your password</Trans>
                </h1>
              ) : (
                <>
                  <h5 className={loginStyles.loginIntro}>Welcome to</h5>
                  <h4 className={loginStyles.loginAppName}>{loginTitle}</h4>
                </>
              )}
            </div>
          </div>
          <div className={loginStyles.loginOuterBox}>{children}</div>
        </div>
      </div>
    </Branding.LoginBackground>
  );
};

export const getLoginStyles = (theme: GrafanaTheme2) => {
  return {
    loginMain: css({
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: '100%',
    }),
    container: css({
      minHeight: '100%',
      background: '#fff',
      flex: 1,
      minWidth: '100%',
      marginLeft: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    }),
    submitButton: css({
      justifyContent: 'center',
      width: '100%',
      background: '#487cff',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      padding: '10px 22px',
      fontSize: '14px',
      fontWeight: 400,
      '&:hover': {
        background: '#487cff',
      },
    }),
    loginLogo: css({
      width: '142px',
      height: '48px',
      marginBottom: '16px',
    }),
    loginLogoWrapper: css({
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      padding: '0',
    }),
    titleWrapper: css({
      textAlign: 'center',
    }),
    loginIntro: css({
      fontSize: '20px',
      fontWeight: 400,
      color: '#676a71',
      margin: 0,
      lineHeight: '28px',
    }),
    loginAppName: css({
      fontSize: '32px',
      fontWeight: 700,
      color: '#333752',
      margin: 0,
      lineHeight: '44px',
    }),
    mainTitle: css({
      fontSize: 32,
    }),
    subTitle: css({
      fontSize: theme.typography.size.md,
      color: theme.colors.text.secondary,
    }),
    loginContent: css({
      maxWidth: 446,
      width: '446px',
      display: 'flex',
      alignItems: 'stretch',
      flexDirection: 'column',
      position: 'relative',
      justifyContent: 'flex-start',
      zIndex: 1,
      minHeight: 'auto',
      borderRadius: '4px',
      padding: '48px',
      background: '#fff',
      boxShadow: '0 2px 10px 0 rgba(38, 44, 71, 0.16)',
      // Override outer Input wrapper height
      '[data-testid="input-wrapper"]': {
        height: '44px !important',
      },
      'input, [data-testid="input"]': {
        background: '#fff !important',
        color: '#333752 !important',
        border: '1px solid #e6e6e7 !important',
        borderRadius: '4px !important',
        padding: '12px 30px !important',
        fontSize: '14px !important',
        height: '44px !important',
        width: '100% !important',
        '&:focus': {
          borderColor: '#487cff !important',
          boxShadow: '0 0 0 0.5px #487cff inset !important',
          outline: 'none !important',
        },
        '&::placeholder': {
          color: '#aaacb3 !important',
          fontSize: '13px !important',
        },
      },
      label: {
        color: '#676a71 !important',
        fontSize: '12px !important',
        fontWeight: '400 !important',
        lineHeight: '20px !important',
        letterSpacing: '0.25px !important',
        marginBottom: '4px !important',
      },
      'button[role="switch"]': {
        display: 'flex !important',
        alignItems: 'center !important',
        justifyContent: 'center !important',
        padding: '6px !important',
        '& svg': {
          width: '22px !important',
          height: '22px !important',
        },
      },

      [theme.breakpoints.down('sm')]: {
        width: 'calc(100% - 2rem)',
        maxWidth: '446px',
        padding: '32px',
      },
    }),
    loginForm: css({
      marginTop: '8px',
    }),
    loginFormField: css({
      paddingTop: '23px',
      position: 'relative',
    }),
    loginFormFieldPassword: css({
      paddingTop: '23px',
      position: 'relative',
      marginBottom: '43px',
    }),
    loginLabel: css({
      color: '#676a71',
      fontSize: '12px',
      fontWeight: 400,
      lineHeight: '20px',
      letterSpacing: '0.25px',
      marginBottom: '4px',
    }),
    loginInput: css({
      background: '#fff !important',
      color: '#333752 !important',
      border: '1px solid #e6e6e7 !important',
      borderRadius: '4px !important',
      padding: '12px 16px !important',
      fontSize: '14px !important',
      height: '44px !important',
      width: '100% !important',
      '&:focus': {
        borderColor: '#487cff !important',
        boxShadow: '0 0 0 0.5px #487cff inset !important',
        outline: 'none !important',
      },
      '&::placeholder': {
        color: '#aaacb3 !important',
        fontSize: '13px !important',
      },
    }),
    loginEyeIcon: css({
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '6px',
      '& svg': {
        width: '18px',
        height: '18px',
      },
    }),
    loginSubmitButton: css({
      background: '#487cff',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      padding: '10px 22px',
      fontSize: '14px',
      fontWeight: 400,
      lineHeight: '1.5',
      width: '100%',
      minHeight: '40px',
      marginTop: '23px',
      display: 'flex',
      justifyContent: 'center',
      textAlign: 'center',
      '&:hover': {
        background: '#487cff',
      },
    }),
    loginOuterBox: css({
      display: 'flex',
      overflowY: 'hidden',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      marginTop: '40px',
    }),
    loginInnerBox: css({
      padding: '0',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      flexGrow: 1,
      maxWidth: '100%',
      width: '100%',
    }),
    enterAnimation: css({}),
  };
};
