import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { connect, useSelector, RootStateOrAny } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import {
  TextField,
  createStyles,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Theme,
  Card,
} from '@material-ui/core';
import * as auth from '../_redux/auth-redux';
// eslint-disable-next-line no-restricted-imports
import { makeStyles } from '@material-ui/core/styles';
import ErrorIcon from '@material-ui/icons/Error';
import {
  GenerateKeyPair,
  SignMessage,
  GenerateCertificate,
  SymmetricDecrypt,
} from '../service/auth-cryptography';
import { CERTIFICATE_EXP } from '../../../common-library/common-consts/enviroment';
import { GetCredential, Ping } from '../_redux/auth.service';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowAltCircleLeft } from '@fortawesome/free-solid-svg-icons';
// import clsx from 'clsx';

const initialValues = {
  username: '',
  password: '',
  showPassword: false,
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      '& > *': {
        backgroundColor: 'white',
      },
      display: 'flex',
      flexWrap: 'wrap',
    },
    margin: {
      margin: theme.spacing(1),
    },
    withoutLabel: {
      marginTop: theme.spacing(3),
    },
    textField: {
      width: '25ch',
    },
  }),
);

interface State {
  password: string;
  showPassword: boolean;
  username: string;
}

const LoginUsername = (props: {
  saveUserInfo?: any;
  intl?: any;
  location?: any;
  savePingErrorData?: any;
}) => {
  const { intl } = props;
  const history = useHistory();
  const { search } = window.location;
  let callbackUrl = new URLSearchParams(search).get('callbackUrl');
  const userInfo = useSelector(({ auth }: { auth: RootStateOrAny }) => auth);

  const [loading, setLoading] = useState(false);

  const classes = useStyles();

  const [values, setValues] = useState<State>({
    password: '',
    username: '',
    showPassword: false,
  });

  const LoginSchema = Yup.object().shape({
    username: Yup.string()
      .min(3, 'Minimum 3 symbols')
      .max(256, 'Maximum 256 symbols')

      .required(
        intl.formatMessage({
          id: 'AUTH.VALIDATION.REQUIRED_FIELD',
        }),
      ),
    password: Yup.string()
      .min(3, 'Minimum 3 symbols')
      .max(256, 'Maximum 256 symbols')
      .matches(
        /^\S*$/,
        intl.formatMessage({
          id: 'ERROR.SPACE_NOT_ALLOWED',
        }),
      )
      .required(
        intl.formatMessage({
          id: 'AUTH.VALIDATION.REQUIRED_FIELD',
        }),
      ),
  });

  useEffect(() => {
    return () => {
      setLoading(false);
    };
  }, []);

  const submitUsername = (
    { username, password }: { username: string; password: string },
    { setStatus, setSubmitting }: { setStatus: any; setSubmitting: any },
  ) => {
    setLoading(true);
    setTimeout(() => {
      GetCredential(username)
        .then((response: any) => {
          console.log('response', response);
          if (!response['success']) {
            setLoading(false);
            setSubmitting(false);
            setStatus(
              intl.formatMessage({
                id: response?.reason,
              }),
            );
            return;
          } else {
            const { encryptedPrivateKey, publicKey } = response.data;
            const _privateKey = SymmetricDecrypt(encryptedPrivateKey, password);
            const certificate = GenerateCertificate(
              {
                id: response.data.id,
                timestamp: new Date().getTime(),
                exp: CERTIFICATE_EXP,
              },
              _privateKey,
            );
            console.log('GenerateCertificate', certificate);
            console.log('userInfo', userInfo);
            props.saveUserInfo({
              ...response.data,
              _certificate: certificate,
              _preLoggedIn: true,
              _privateKey,
            });
            Ping()
              .then((res: { data: any }) => {
                props.saveUserInfo({
                  ...res.data,
                  _certificate: certificate,
                  _privateKey,
                  _preLoggedIn: false,
                });
              })
              .catch((err: any) => {
                setLoading(false);
                setSubmitting(false);
                props.savePingErrorData(err);
              });
          }
        })
        .catch(err => {
          console.log('err', err);
          setLoading(false);
          setSubmitting(false);
          setStatus(
            intl.formatMessage({
              id: 'AUTH.VALIDATION.INVALID_PASSWORD',
            }),
          );
        });
    }, 200);
  };

  const formik = useFormik({
    initialValues,
    validationSchema: LoginSchema,
    onSubmit: submitUsername,
  });
  const errorMessage = new URLSearchParams(search).get('errorMessage');

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  useEffect(() => {
    if (errorMessage && errorMessage != 'null' && errorMessage !== 'undefined') {
      formik.setStatus(intl.formatMessage({ id: errorMessage }));
    }
  }, [errorMessage]);

  return (
    <div className="login-form login-signin p-5" id="kt_login_signin_form" style={{ zIndex: 1 }}>
      <Card className="px-7 py-8">
        {/* begin::Head */}
        <div className="text-center mb-10 mb-lg-10">
          <h2 className="font-size-h1 font-weight-bold">
            <FormattedMessage id="AUTH.LOGIN.TITLE" />
          </h2>
          <p className="text-muted font-weight-bold">
            <FormattedMessage id="AUTH.LOGIN.INPUT_NAME.PLACE_HOLDER" />
          </p>
        </div>
        {/* end::Head */}

        {/*begin::Form*/}

        <form
          onSubmit={formik.handleSubmit}
          className="form fv-plugins-bootstrap fv-plugins-framework">
          {/* USERNAME */}
          <div className="form-group fv-plugins-icon-container">
            <TextField
              id="outlined-adornment-username"
              autoFocus
              className={`form-control form-control-solid h-auto`}
              label={<FormattedMessage id="AUTH.LOGIN.EMAIL" />}
              variant="outlined"
              {...formik.getFieldProps('username')}
              value={formik.values.username}
              onChange={formik.handleChange}
            />
            {formik.touched.username && formik.errors.username ? (
              <div className="fv-plugins-message-container mt-4">
                <div className="fv-help-block">{formik.errors.username}</div>
              </div>
            ) : null}
            {formik.status && (
              <div className="mt-4 text-danger font-weight-bold">
                <ErrorIcon /> {formik.status}
              </div>
            )}
          </div>

          {/* PWD */}
          <div className="form-group fv-plugins-icon-container">
            {/* <InputLabel htmlFor="outlined-adornment-password">
            <FormattedMessage id="AUTH.LOGIN.PASSWORD" />
          </InputLabel> */}

            <FormControl className={' w-100'} variant="outlined">
              <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                type={values.showPassword ? 'text' : 'password'}
                {...formik.getFieldProps('password')}
                value={formik.values.password}
                onChange={formik.handleChange}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end">
                      {values.showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
              />
            </FormControl>
            {formik.touched.password && formik.errors.password ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">{formik.errors.password}</div>
              </div>
            ) : null}
            {/* {formik.status ? (
            <span className="text-danger font-weight-bold ml-3">{formik.status}</span>
          ) : (
            userInfo._error && (
              <span className="text-danger font-weight-bold ml-3">{userInfo._error}</span>
            )
          )} */}
          </div>

          <div className="form-group d-flex flex-wrap justify-content-between align-items-center">
            <Link to="/">
                <FontAwesomeIcon
                    style ={{width: '20px', height: '20px'}}          
                    icon={faArrowAltCircleLeft}
                />
            </Link>
            <button
              id="kt_login_signin_submit"
              type="submit"
              disabled={formik.isSubmitting}
              style={{ zIndex: 1 }}
              className={`btn btn-primary font-weight-bold px-12 py-4 my-3`}>
              <span>
                <FormattedMessage id="AUTH.LOGIN.NEXT_BTN" />
              </span>
              {loading && <span className="ml-3 spinner spinner-white" />}
            </button>
          </div>
        </form>
        {/*end::Form*/}
      </Card>
    </div>
  );
};

export default injectIntl(connect(null, auth.actions)(LoginUsername));
