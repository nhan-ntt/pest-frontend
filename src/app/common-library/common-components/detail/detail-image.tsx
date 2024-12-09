import React, { Fragment, ReactElement, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Image } from 'antd';
import { Skeleton } from '@material-ui/lab';
import { CloseOutlined } from '@material-ui/icons';
import _ from 'lodash';
import { IntlShape, useIntl } from 'react-intl';
import { BASE_URL } from '../../common-consts/enviroment';

export const DetailImage = ({
  thumbnailField = 'thumbnail',
  pathField = 'path',
  images,
  width = 50,
  height = 50,
  renderInfo,
  values,
  onImageRemove,
  className,
}: {
  className?: string;
  onImageRemove?: (...props: any) => void;
  width?: string | number;
  height?: string | number;
  thumbnailField?: any;
  pathField?: any;
  images: any;
  renderInfo?: {
    title?: string;
    data?: { [KeyField: string]: string };
    component?: (value: any, values?: any, intl?: IntlShape) => ReactElement;
  };
  values?: any;
}) => {
  const container = useRef<any>(null);
  const intl = useIntl();
  const [showIndex, setShow] = useState(-1);

  const Img = useCallback(
    ({ image, index }: any) => {
      return image ? (
        <div
          className={
            className ? className + ' image-item imagePreview mr-1' : 'image-item imagePreview mr-1'
          }>
          <Image
            width={width}
            height={height}
            className={'image-detail cursor-pointer'}
            src={getImage(image)}
            placeholder={<Skeleton animation="wave" variant="rect" width={width} height={height} />}
            preview={{
              getContainer: () => container.current,
              onVisibleChange: (value: boolean, prevValue: boolean) => {
                setShow(value ? index : -1);
              },
            }}
          />
          {onImageRemove && (
            <span
              className="btn-close-image"
              onClick={() => {
                onImageRemove(index);
              }}>
              <CloseOutlined />
            </span>
          )}
        </div>
      ) : (
        <></>
      );
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [className, height, pathField, width, images],
  );

  const _images = useMemo(() => (_.isArray(images) ? images : [images]), [images]);

  return (
    <Fragment>
      <div ref={container} />
      {/* <div className="row no-gutters"> */}
      {_images.map((image: any, index: any) => (
        <Img key={index} index={index} image={image} />
      ))}
      {/* </div> */}
      {renderInfo && showIndex > -1 && (
        <div className={'image-detail-info pl-10 pt-13 pr-10 pb-12'}>
          {renderInfo.title && (
            <div className={'pb-3'} style={{ fontSize: '24px' }}>
              {intl.formatMessage({ id: renderInfo.title })}
            </div>
          )}
          {renderInfo.data &&
            Object.keys(renderInfo.data).map((key, index) => (
              <div className={'titleeee mb-1'} key={key}>
                {intl.formatMessage({ id: (renderInfo as any).data[key] })}{' '}
                {_images[showIndex][key]}
              </div>
            ))}
          {renderInfo?.component && renderInfo?.component(_images[showIndex], values, intl)}
        </div>
      )}
    </Fragment>
  );
};

const getImage = (path: string | any) => {
  path = path?.path ?? path;
  const isBase64 = (s: string) => s.indexOf('data:image') == 0;
  if (path?.indexOf('https://') !== -1) {
    return path;
  }
  return path
    ? isBase64(path)
      ? path
      : (path.indexOf('http') == 0 ? '' : path[0] === '/' ? BASE_URL : '/') + path
    : '';
};