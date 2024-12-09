import React, { useCallback, useMemo } from 'react';
import { ErrorMessage, useField, useFormikContext } from 'formik';
import { DatePicker } from 'antd';
import { RangeValue } from 'rc-picker/lib/interface';
import locale from 'antd/es/date-picker/locale/vi_VN';
import moment, { Moment } from 'moment';
import { GetClassName, GetFieldCSSClasses } from '../helpers/common-function';
import { InputDateTimeType } from '../common-components/common-input';
import { DisplayError } from './field-feedback-label';
import { useIntl } from 'react-intl';
import _ from 'lodash';

const { RangePicker } = DatePicker;

export function DateRangePickerField({
  mode,
  disabled,
  onChange,
  onReset,
  required,
  labelWidth,
  label,
  withFeedbackLabel = true,
  customFeedbackLabel,
  placeholder,
  showTime = false,
  ...props
}: InputDateTimeType) {
  const {
    setFieldValue,
    errors,
    touched,
    values,
    setFieldTouched,
    getFieldMeta,
  } = useFormikContext<any>();
  const validate = useCallback((value: any): string | void => {
    if (required && !value) return 'RADIO.ERROR.REQUIRED';
  }, []);
  const [field] = useField({
    validate,
    ...props,
  });
  const timestamp = new Date();
  const inverseOffset = moment(timestamp).utcOffset() * -1;
  const intl = useIntl();
  const _label = useMemo(() => (_.isString(label) ? intl.formatMessage({ id: label }) : label), []);
  return (
    <>
      <div className={mode == 'horizontal' ? 'row' : ''}>
        <div className={mode === 'horizontal' ? GetClassName(labelWidth, true) : ''}>
          {_label && (
            <label className={mode === 'horizontal' ? 'mb-0 mt-2' : ''}>
              {_label}
              {required && <span className="text-danger">*</span>}
            </label>
          )}
        </div>
        <div className={mode == 'horizontal' ? GetClassName(labelWidth, false) : ''}>
          <RangePicker
            style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
            format="L"
            picker="date"
            className={
              'default-behave ' + props.checkTouched
                ? GetFieldCSSClasses(
                    getFieldMeta(field.name).touched,
                    getFieldMeta(field.name).error,
                  )
                : GetFieldCSSClasses(
                    getFieldMeta(field.name).touched,
                    getFieldMeta(field.name).error,
                  )
            }
            locale={locale}
            showTime={showTime}
            {...props}
            onChange={(val: any) => {
              let times: any = [];
              val.forEach((val: any) => {
                const time = showTime
                  ? moment(val)
                  : moment(val)
                      .hours(0)
                      .minutes(0)
                      .seconds(0)
                      .milliseconds(0);
                times.push(time);
              });
              setFieldTouched(field.name, true);
              console.log('times', times);
              if (onChange && val) {
                onChange(times, values, setFieldValue);
              }
              if (onReset && !val) {
                onReset(setFieldValue);
              }
              if (val) {
                setFieldValue(field.name, times);
              } else {
                setFieldValue(field.name, []);
              }
            }}
            onBlur={e => {
              setFieldTouched(field.name, true);
            }}
          />
          {withFeedbackLabel && (
            <ErrorMessage name={field.name}>
              {msg => <DisplayError label={_label} error={msg} />}
            </ErrorMessage>
          )}
        </div>
      </div>
    </>
  );
}
