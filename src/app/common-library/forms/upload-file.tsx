import React, { ReactElement, useCallback, useMemo, useRef, useState } from 'react';
import { GetClassName, getNewFile, getNewImage } from '../helpers/common-function';
import ImageUploading from 'react-images-uploading';
import { DetailImage } from '../common-components/detail/detail-image';
import _ from 'lodash';
import { ErrorMessage, useField, useFormikContext } from 'formik';
import { DisplayError } from './field-feedback-label';
import { useIntl } from 'react-intl';
import exifr from 'exifr';
import { DisplayDownloadLink } from '../helpers/detail-helpers';

interface UploadFileProps {
  value: any[];
  label: string | ReactElement;
  onChange?: any;
  labelWidth?: number;
  isArray?: boolean;
  required?: boolean | ((values: any) => boolean);
  name: string;
  maxNumber?: number;
  pathField?: string;
  thumbnailField?: string;
  width?: number | string;
  height?: number | string;
  disabled?: boolean | ((values: any) => boolean);
  mode?: 'horizontal' | 'vertical' | undefined;
}

const toBase64 = (file: any) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

export const UploadFile = ({
  label,
  labelWidth,
  pathField = 'path',
  thumbnailField = 'thumbnail',
  required,
  disabled,
  name,
  mode,
  isArray = true,
  maxNumber = 3,
  width = 127,
  height = 109,
}: UploadFileProps) => {
  const { errors, touched, setFieldValue, values, setFieldTouched } = useFormikContext<any>();
  const validate = useCallback((value: any): string | void => {
    if (required && !value) return 'RADIO.ERROR.REQUIRED';
  }, []);
  const [field, fieldMeta, fieldHelper] = useField({ validate, name });
  const intl = useIntl();
  const _label = useMemo(() => (_.isString(label) ? intl.formatMessage({ id: label }) : label), []);
  const _disabled = useMemo(() => {
    return disabled ? (typeof disabled === 'boolean' ? disabled : disabled(values)) : disabled;
  }, [disabled, values]);

  const styles: any = {
    fontFamily: 'sans-serif',
    textAlign: 'center',
    display: 'flex',
  };

  const innerValue = useMemo(() => {
    return field.value ? (isArray ? field.value : [field.value]) : [];
  }, [field.value, isArray]);

  const onChange = (e: any) => {
    // const newArr = getNewFile(isArray ? field.value : [field.value], imageList);
    const uploadFiles = e.target.files;
    const filesArr = Array.prototype.slice.call(uploadFiles);
    console.log(maxNumber);
    Promise.all(filesArr.map((file: any) => toBase64(file))).then(recentFiles => {
      console.log(recentFiles);
      const arr = recentFiles.map((datafile: any, index: any) => {
        // let result = {};
        // result[pathField] = datafile;
        let result = { [pathField]: datafile };
        result.name = filesArr[index].name;
        return result;
      });
      if (isArray) {
        let fileCanAdd = maxNumber - innerValue.length;
        if (fileCanAdd > 0) setFieldValue(name, [...innerValue, ...arr.slice(0, fileCanAdd)]);
      } else {
        setFieldValue(name, arr[0]);
      }
      setFieldTouched(name, true);
    });
  };

  const removeFile = (f: any) => {
    if (isArray)
      setFieldValue(
        name,
        field.value.filter((x: any) => x !== f),
      );
    else setFieldValue(name, null);
  };

  const fileRef: any = useRef(null);

  const Format = ({ input }: { input: any }) => {
    const [_, ...nameArr] = input.path.split('-');
    const nameFile = input.name ? input.name : nameArr.join('');
    return DisplayDownloadLink((input.name ? '' : '/') + input.path, undefined, nameFile);
  };

  return (
    <div className={mode === 'horizontal' ? 'row' : ''}>
      {_label && (
        <div className={mode === 'horizontal' ? GetClassName(labelWidth, true) : ''}>
          <label className={mode === 'horizontal' ? 'mb-0 mt-2' : ''}>
            {_label}
            {required && <span className="text-danger">*</span>}
          </label>
        </div>
      )}
      <div className={GetClassName(labelWidth, false)}>
        <div style={styles}>
          <input
            style={{ display: 'none' }}
            ref={fileRef}
            type="file"
            multiple={maxNumber > 1}
            onChange={onChange}
          />
          {!_disabled && !(innerValue.length >= maxNumber) && (
            <button
              type="button"
              style={{ width: 460, height: 179 }}
              onClick={() => {
                fileRef?.current?.click();
              }}
              className="button-add-file text-primary">
              <svg
                width="462"
                height="181"
                viewBox="0 0 462 181"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M173.12 62.2V72H176.9C178.23 72 179.336 71.524 180.204 70.586C181.086 69.634 181.52 68.472 181.52 67.1C181.52 65.728 181.086 64.566 180.204 63.628C179.336 62.676 178.23 62.2 176.9 62.2H173.12ZM174.1 71.076V63.124H176.9C177.978 63.124 178.846 63.502 179.532 64.272C180.218 65.042 180.568 65.98 180.568 67.1C180.568 68.22 180.218 69.158 179.532 69.928C178.846 70.698 177.978 71.076 176.9 71.076H174.1ZM191.302 70.698C192.282 69.704 192.772 68.514 192.772 67.1C192.772 65.686 192.282 64.496 191.302 63.516C190.322 62.522 189.118 62.032 187.704 62.032C186.29 62.032 185.086 62.522 184.106 63.516C183.126 64.496 182.636 65.686 182.636 67.1C182.636 68.514 183.126 69.704 184.106 70.698C185.086 71.678 186.29 72.168 187.704 72.168C189.118 72.168 190.322 71.678 191.302 70.698ZM184.792 70.026C184.008 69.228 183.616 68.248 183.616 67.1C183.616 65.952 184.008 64.986 184.792 64.188C185.576 63.39 186.542 62.984 187.704 62.984C188.866 62.984 189.832 63.39 190.616 64.188C191.4 64.986 191.792 65.952 191.792 67.1C191.792 68.248 191.4 69.228 190.616 70.026C189.832 70.824 188.866 71.216 187.704 71.216C186.542 71.216 185.576 70.824 184.792 70.026ZM199.026 72.168C200.832 72.168 202.47 71.216 203.268 69.746L202.4 69.256C201.784 70.446 200.482 71.216 199.026 71.216C197.808 71.216 196.8 70.824 196.03 70.026C195.26 69.228 194.868 68.262 194.868 67.1C194.868 65.938 195.26 64.972 196.03 64.174C196.8 63.376 197.808 62.984 199.026 62.984C200.482 62.984 201.784 63.754 202.4 64.944L203.268 64.44C202.442 62.97 200.832 62.032 199.026 62.032C197.542 62.032 196.31 62.522 195.344 63.502C194.378 64.482 193.888 65.686 193.888 67.1C193.888 68.514 194.378 69.718 195.344 70.698C196.31 71.678 197.542 72.168 199.026 72.168ZM204.736 70.81L204.176 73.96H205.016L205.856 70.81H204.736ZM213.741 72.168C214.665 72.168 215.435 71.916 216.037 71.412C216.653 70.908 216.961 70.18 216.961 69.228V62.2H215.981V69.228C215.981 70.572 215.099 71.216 213.741 71.216C212.607 71.216 211.893 70.81 211.585 69.998L210.759 70.488C211.221 71.594 212.383 72.168 213.741 72.168ZM219.058 62.2V72H220.038V68.36H222.558C223.44 68.36 224.168 68.066 224.756 67.478C225.344 66.89 225.638 66.162 225.638 65.28C225.638 64.398 225.344 63.67 224.756 63.082C224.168 62.494 223.44 62.2 222.558 62.2H219.058ZM220.038 67.436V63.124H222.558C223.16 63.124 223.664 63.334 224.056 63.74C224.462 64.146 224.658 64.65 224.658 65.28C224.658 65.91 224.462 66.428 224.056 66.834C223.664 67.24 223.16 67.436 222.558 67.436H220.038ZM231.781 67.338V68.262H235.673C235.575 69.116 235.197 69.83 234.539 70.39C233.881 70.936 232.999 71.216 231.893 71.216C230.675 71.216 229.667 70.824 228.897 70.026C228.127 69.228 227.735 68.262 227.735 67.1C227.735 65.938 228.127 64.972 228.897 64.174C229.667 63.376 230.675 62.984 231.893 62.984C233.349 62.984 234.651 63.754 235.267 64.944L236.135 64.44C235.729 63.712 235.141 63.124 234.385 62.69C233.629 62.256 232.803 62.032 231.893 62.032C230.409 62.032 229.177 62.522 228.211 63.502C227.245 64.482 226.755 65.686 226.755 67.1C226.755 68.514 227.245 69.718 228.211 70.698C229.177 71.678 230.409 72.168 231.893 72.168C233.349 72.168 234.511 71.748 235.379 70.922C236.247 70.082 236.681 69.06 236.681 67.842V67.338H231.781ZM238.642 70.81L238.082 73.96H238.922L239.762 70.81H238.642ZM245.225 62.2V72H246.205V68.36H248.725C249.607 68.36 250.335 68.066 250.923 67.478C251.511 66.89 251.805 66.162 251.805 65.28C251.805 64.398 251.511 63.67 250.923 63.082C250.335 62.494 249.607 62.2 248.725 62.2H245.225ZM246.205 67.436V63.124H248.725C249.327 63.124 249.831 63.334 250.223 63.74C250.629 64.146 250.825 64.65 250.825 65.28C250.825 65.91 250.629 66.428 250.223 66.834C249.831 67.24 249.327 67.436 248.725 67.436H246.205ZM259.783 70.18L254.323 62.2H253.483V72H254.463V64.02L259.923 72H260.763V62.2H259.783V70.18ZM267.465 67.338V68.262H271.357C271.259 69.116 270.881 69.83 270.223 70.39C269.565 70.936 268.683 71.216 267.577 71.216C266.359 71.216 265.351 70.824 264.581 70.026C263.811 69.228 263.419 68.262 263.419 67.1C263.419 65.938 263.811 64.972 264.581 64.174C265.351 63.376 266.359 62.984 267.577 62.984C269.033 62.984 270.335 63.754 270.951 64.944L271.819 64.44C271.413 63.712 270.825 63.124 270.069 62.69C269.313 62.256 268.487 62.032 267.577 62.032C266.093 62.032 264.861 62.522 263.895 63.502C262.929 64.482 262.439 65.686 262.439 67.1C262.439 68.514 262.929 69.718 263.895 70.698C264.861 71.678 266.093 72.168 267.577 72.168C269.033 72.168 270.195 71.748 271.063 70.922C271.931 70.082 272.365 69.06 272.365 67.842V67.338H267.465ZM274.326 70.81L273.766 73.96H274.606L275.446 70.81H274.326ZM278.445 71.916C278.739 71.622 278.739 71.118 278.445 70.824C278.151 70.53 277.647 70.53 277.353 70.824C277.059 71.118 277.059 71.622 277.353 71.916C277.647 72.21 278.151 72.21 278.445 71.916ZM281.672 71.916C281.966 71.622 281.966 71.118 281.672 70.824C281.378 70.53 280.874 70.53 280.58 70.824C280.286 71.118 280.286 71.622 280.58 71.916C280.874 72.21 281.378 72.21 281.672 71.916ZM284.898 71.916C285.192 71.622 285.192 71.118 284.898 70.824C284.604 70.53 284.1 70.53 283.806 70.824C283.512 71.118 283.512 71.622 283.806 71.916C284.1 72.21 284.604 72.21 284.898 71.916ZM288.125 71.916C288.419 71.622 288.419 71.118 288.125 70.824C287.831 70.53 287.327 70.53 287.033 70.824C286.739 71.118 286.739 71.622 287.033 71.916C287.327 72.21 287.831 72.21 288.125 71.916Z"
                  fill="#888C9F"
                />
                <rect
                  x="1"
                  y="1"
                  width="460"
                  height="179"
                  rx="8"
                  stroke="#9D9D9D"
                  stroke-dasharray="5 5"
                />
                <rect
                  x="181.5"
                  y="96.5"
                  width="99"
                  height="33"
                  rx="5.5"
                  fill="#27ae60"
                  stroke="#27ae60"
                />
                <path
                  d="M210 115.216C210 116.116 210.3 116.824 210.888 117.364C211.476 117.892 212.244 118.156 213.18 118.156C214.116 118.156 214.884 117.892 215.472 117.364C216.06 116.824 216.36 116.116 216.36 115.216V109.6H214.98V115.132C214.98 116.152 214.38 116.812 213.18 116.812C211.98 116.812 211.38 116.152 211.38 115.132V109.6H210V115.216ZM221.259 111.844C220.347 111.844 219.651 112.18 219.159 112.864V112H217.863V120.4H219.159V117.148C219.651 117.82 220.347 118.156 221.259 118.156C222.087 118.156 222.783 117.856 223.371 117.244C223.959 116.632 224.247 115.888 224.247 115C224.247 114.124 223.959 113.38 223.371 112.768C222.783 112.156 222.087 111.844 221.259 111.844ZM219.699 116.38C219.339 116.008 219.159 115.552 219.159 115C219.159 114.448 219.339 113.992 219.699 113.632C220.059 113.26 220.515 113.08 221.055 113.08C221.595 113.08 222.051 113.26 222.411 113.632C222.771 113.992 222.951 114.448 222.951 115C222.951 115.552 222.771 116.008 222.411 116.38C222.051 116.74 221.595 116.92 221.055 116.92C220.515 116.92 220.059 116.74 219.699 116.38ZM229.718 118V109.24H228.422V118H229.718ZM234.055 118.156C234.943 118.156 235.687 117.856 236.299 117.244C236.911 116.632 237.223 115.888 237.223 115C237.223 114.112 236.911 113.368 236.299 112.756C235.687 112.144 234.943 111.844 234.055 111.844C233.179 111.844 232.423 112.144 231.811 112.756C231.199 113.368 230.887 114.112 230.887 115C230.887 115.888 231.199 116.632 231.811 117.244C232.423 117.856 233.179 118.156 234.055 118.156ZM232.723 116.356C232.363 115.996 232.183 115.54 232.183 115C232.183 114.46 232.363 114.004 232.723 113.644C233.083 113.284 233.527 113.104 234.055 113.104C234.583 113.104 235.027 113.284 235.387 113.644C235.747 114.004 235.927 114.46 235.927 115C235.927 115.54 235.747 115.996 235.387 116.356C235.027 116.716 234.583 116.896 234.055 116.896C233.527 116.896 233.083 116.716 232.723 116.356ZM243.147 112.852C242.655 112.18 241.959 111.844 241.047 111.844C240.219 111.844 239.523 112.144 238.935 112.756C238.347 113.368 238.059 114.112 238.059 115C238.059 115.876 238.347 116.632 238.935 117.244C239.523 117.856 240.219 118.156 241.047 118.156C241.959 118.156 242.655 117.82 243.147 117.136V118H244.443V112H243.147V112.852ZM239.895 116.38C239.535 116.008 239.355 115.552 239.355 115C239.355 114.448 239.535 113.992 239.895 113.632C240.255 113.26 240.711 113.08 241.251 113.08C241.791 113.08 242.247 113.26 242.607 113.632C242.967 113.992 243.147 114.448 243.147 115C243.147 115.552 242.967 116.008 242.607 116.38C242.247 116.74 241.791 116.92 241.251 116.92C240.711 116.92 240.255 116.74 239.895 116.38ZM250.705 112.852C250.213 112.18 249.517 111.844 248.605 111.844C247.777 111.844 247.081 112.144 246.493 112.756C245.905 113.368 245.617 114.112 245.617 115C245.617 115.876 245.905 116.632 246.493 117.244C247.081 117.856 247.777 118.156 248.605 118.156C249.517 118.156 250.213 117.82 250.705 117.136V118H252.001V109.6H250.705V112.852ZM247.453 116.38C247.093 116.008 246.913 115.552 246.913 115C246.913 114.448 247.093 113.992 247.453 113.632C247.813 113.26 248.269 113.08 248.809 113.08C249.349 113.08 249.805 113.26 250.165 113.632C250.525 113.992 250.705 114.448 250.705 115C250.705 115.552 250.525 116.008 250.165 116.38C249.805 116.74 249.349 116.92 248.809 116.92C248.269 116.92 247.813 116.74 247.453 116.38Z"
                  fill="white"
                />
              </svg>
            </button>
          )}
          {innerValue.map((x: any) => (
            <div className="file-preview">
              <Format input={x} />
              <span onClick={() => removeFile(x)}> x</span>
            </div>
          ))}
        </div>
        <div
          className={
            errors[name] && touched[name]
              ? 'is-invalid d-flex flex-wrap upload__image-wrapper'
              : 'd-flex flex-wrap upload__image-wrapper'
          }>
          {/*<DetailImage onImageRemove={onImageRemove} images={imageList} width={width} height={height}/>*/}
        </div>
        {
          <ErrorMessage name={field.name}>
            {msg => <DisplayError label={_label} error={msg} />}
          </ErrorMessage>
        }
      </div>
    </div>
  );
};

const getFileMetaList = (file: any): Promise<any[]> => {
  if (!file) return Promise.resolve([]);
  return Promise.all(
    file.map((item: any) => {
      return exifr.parse(item).catch(error => {
        console.log(error);
        return {};
      });
    }),
  );
};
