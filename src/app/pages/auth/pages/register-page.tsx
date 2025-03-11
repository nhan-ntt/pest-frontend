import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { connect, useSelector, RootStateOrAny } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import {
  TextField,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Card,
  MenuItem,
  Select,
} from '@material-ui/core';
import * as auth from '../_redux/auth-redux';
import { makeStyles } from '@material-ui/core';
import ErrorIcon from '@material-ui/icons/Error';
import { Register } from '../_redux/auth.service';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowAltCircleLeft } from '@fortawesome/free-solid-svg-icons';

const initialValues = {
  email: '',
  fullName: '',
  password: '',
  confirmPassword: '',
  role: '',
  showPassword: false,
  showConfirmPassword: false,
};

const useStyles = makeStyles((theme) => ({
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
}));

interface State {
  password: string;
  confirmPassword: string;
  showPassword: boolean;
  showConfirmPassword: boolean;
  email: string;
  fullName: string;
  role: string;
}

const RegisterPage = (props: {
  registerUser?: any;
  intl?: any;
  location?: any;
}) => {
  const { intl } = props;
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const classes = useStyles();

  const [values, setValues] = useState<State>({
    password: '',
    confirmPassword: '',
    email: '',
    fullName: '',
    role: '',
    showPassword: false,
    showConfirmPassword: false,
  });

  // Static mapping of role codes to localized names
  const roleNameMapping: Record<string, string> = {
    "mobile user": "Người dùng mobile",
    "manager": "Quản lý",
    "expert": "Chuyên gia",
    "admin": "Quản trị viên",
    "field expert": "Chuyên gia đồng ruộng",
    "user": "Người dùng"
  };

  // Define available role options
  const roleOptions = ["mobile user", "expert", "user", "manager", "field expert"];

  const RegisterSchema = Yup.object().shape({
    email: Yup.string()
      .email('Invalid email format')
      .required(
        intl.formatMessage({
          id: 'AUTH.VALIDATION.REQUIRED_FIELD',
        }),
      ),
    fullName: Yup.string()
      .min(3, 'Minimum 3 symbols')
      .max(50, 'Maximum 50 symbols')
      .required(
        intl.formatMessage({
          id: 'AUTH.VALIDATION.REQUIRED_FIELD',
        }),
      ),
    password: Yup.string()
      .min(6, 'Minimum 6 symbols')
      .max(50, 'Maximum 50 symbols')
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
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), undefined], 'Passwords must match')
      .required(
        intl.formatMessage({
          id: 'AUTH.VALIDATION.REQUIRED_FIELD',
        }),
      ),
    role: Yup.string()
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

  const submitRegister = (
    values: {
      email: string;
      fullName: string;
      password: string;
      confirmPassword: string;
      role: string;
    },
    { setStatus, setSubmitting }: { setStatus: any; setSubmitting: any },
  ) => {
    setLoading(true);
    setTimeout(() => {
      const registrationData = {
        email: values.email,
        fullName: values.fullName,
        password: values.password,
        role: values.role
      };
      
      Register(registrationData)
        .then((response: any) => {
          console.log('Registration response:', response); // Add this to debug
          setLoading(false);
          setSubmitting(false);
          
          // A 201 response code means success, no need to check response.data.success
          // Just proceed with the success flow
          alert('Registration successful. Please login.');
          history.push('/auth/login');
        })
        .catch(err => {
          console.error('Registration error:', err);
          setLoading(false);
          setSubmitting(false);
          setStatus(
            err.response?.data?.message || 
            intl.formatMessage({
              id: 'AUTH.VALIDATION.INVALID_REGISTRATION',
            })
          );
        });
    }, 200);
  };

  const formik = useFormik({
    initialValues,
    validationSchema: RegisterSchema,
    onSubmit: submitRegister,
  });

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleClickShowConfirmPassword = () => {
    setValues({ ...values, showConfirmPassword: !values.showConfirmPassword });
  };

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  return (
    <div className="register-form p-5" id="kt_register_form" style={{ zIndex: 1 }}>
      <Card className="px-7 py-8">
        {/* begin::Head */}
        <div className="text-center mb-10 mb-lg-10">
          <h2 className="font-size-h1 font-weight-bold">
            <FormattedMessage id="AUTH.REGISTER.TITLE" defaultMessage="Register" />
          </h2>
          <p className="text-muted font-weight-bold">
            <FormattedMessage id="AUTH.REGISTER.DESCRIPTION" defaultMessage="Enter your details to create an account" />
          </p>
        </div>
        {/* end::Head */}

        {/*begin::Form*/}
        <form
          onSubmit={formik.handleSubmit}
          className="form fv-plugins-bootstrap fv-plugins-framework">
          
          {/* EMAIL */}
          <div className="form-group fv-plugins-icon-container mb-5">
            <TextField
              id="outlined-adornment-email"
              autoFocus
              className={`form-control form-control-solid h-auto`}
              label="Email"
              variant="outlined"
              {...formik.getFieldProps('email')}
              value={formik.values.email}
              onChange={formik.handleChange}
              fullWidth
            />
            {formik.touched.email && formik.errors.email ? (
              <div className="fv-plugins-message-container mt-2">
                <div className="fv-help-block text-danger">{formik.errors.email}</div>
              </div>
            ) : null}
          </div>

          {/* NAME */}
          <div className="form-group fv-plugins-icon-container mb-5">
            <TextField
              id="outlined-adornment-email"
              autoFocus
              className={`form-control form-control-solid h-auto`}
              label="Full Name"
              variant="outlined"
              {...formik.getFieldProps('fullName')}
              value={formik.values.fullName}
              onChange={formik.handleChange}
              fullWidth
            />
            {formik.touched.fullName && formik.errors.fullName ? (
              <div className="fv-plugins-message-container mt-2">
                <div className="fv-help-block text-danger">{formik.errors.fullName}</div>
              </div>
            ) : null}
          </div>

      

          {/* ROLE */}
          <div className="form-group fv-plugins-icon-container mb-5">
            <FormControl variant="outlined" fullWidth>
              <InputLabel id="role-select-label">Role</InputLabel>
              <Select
                labelId="role-select-label"
                id="role-select"
                {...formik.getFieldProps('role')}
                value={formik.values.role}
                onChange={formik.handleChange}
                label="Role"
              >
                {roleOptions.map((role) => (
                  <MenuItem key={role} value={role}>
                    {roleNameMapping[role] || role}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {formik.touched.role && formik.errors.role ? (
              <div className="fv-plugins-message-container mt-2">
                <div className="fv-help-block text-danger">{formik.errors.role}</div>
              </div>
            ) : null}
          </div>

          {/* PASSWORD */}
          <div className="form-group fv-plugins-icon-container mb-5">
            <FormControl className="w-100" variant="outlined">
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
              <div className="fv-plugins-message-container mt-2">
                <div className="fv-help-block text-danger">{formik.errors.password}</div>
              </div>
            ) : null}
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="form-group fv-plugins-icon-container mb-5">
            <FormControl className="w-100" variant="outlined">
              <InputLabel htmlFor="outlined-adornment-confirm-password">Confirm Password</InputLabel>
              <OutlinedInput
                id="outlined-adornment-confirm-password"
                type={values.showConfirmPassword ? 'text' : 'password'}
                {...formik.getFieldProps('confirmPassword')}
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowConfirmPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end">
                      {values.showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Confirm Password"
              />
            </FormControl>
            {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
              <div className="fv-plugins-message-container mt-2">
                <div className="fv-help-block text-danger">{formik.errors.confirmPassword}</div>
              </div>
            ) : null}
          </div>

          {formik.status && (
            <div className="mb-5 text-danger font-weight-bold">
              <ErrorIcon /> {formik.status}
            </div>
          )}

          <div className="form-group d-flex flex-wrap justify-content-between align-items-center">
            <Link to="/auth/login">
              <FontAwesomeIcon
                style={{ width: '20px', height: '20px' }}
                icon={faArrowAltCircleLeft}
              /> Back to Login
            </Link>
            <button
              id="kt_register_submit"
              type="submit"
              disabled={formik.isSubmitting || loading}
              style={{ zIndex: 1 }}
              className="btn btn-primary font-weight-bold px-12 py-4 my-3"
            >
              <span>Register</span>
              {loading && <span className="ml-3 spinner spinner-white" />}
            </button>
          </div>
        </form>
        {/*end::Form*/}
      </Card>
    </div>
  );
};

export default injectIntl(connect(null, auth.actions)(RegisterPage));