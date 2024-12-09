import React from 'react';
import { Modal } from 'react-bootstrap';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
import DeleteIcon from '@material-ui/icons/Delete';
import { useIntl } from 'react-intl';
import { ConfirmDialogProps } from '../common-types/common-type';
import { iconStyle } from '../common-consts/const';
import { ModalProgressBar } from '../modal-progress-bar';
import { CapitalizeFirstLetter } from '../helpers/common-function';

export function ConfirmDialog<T>({
  isShow,
  onHide,
  onSubmit,
  entity,
  title = 'COMMON_COMPONENT.NOTIFY_DIALOG.TITLE',
  bodyTitle = 'COMMON_COMPONENT.DELETE_DIALOG.BODY_TITLE',
  confirmMessage,
  confirmBtn = 'COMMON_COMPONENT.NOTIFY_DIALOG.CONFIRM_BTN',
  cancelBtn = 'COMMON_COMPONENT.DETAIL_DIALOG.CLOSE_BTN',
  moduleName = 'COMMON.MODULE_NAME',
  loading,
  error,
}: ConfirmDialogProps<T>) {
  const intl = useIntl();

  return (
    <Modal
      show={isShow}
      onHide={onHide}
      size="lg"
      aria-labelledby="example-modal-sizes-title-lg"
      dialogClassName="modal-detail">
      {loading && <ModalProgressBar />}

      <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-lg" className="text-primary">
          {intl
            .formatMessage({ id: title }, { moduleName: intl.formatMessage({ id: moduleName }) })
            .toUpperCase()}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {!loading && error === '' && (
          <>
            <p>
              {CapitalizeFirstLetter(
                intl.formatMessage(
                  { id: bodyTitle },
                  { moduleName: intl.formatMessage({ id: moduleName }) },
                ),
              )}
            </p>

            <p className="mt-5">
              {intl.formatMessage(
                { id: confirmMessage },
                { moduleName: intl.formatMessage({ id: moduleName }) },
              )}
            </p>
          </>
        )}
        {loading && <span>{intl.formatMessage({ id: confirmMessage })}</span>}
        {!loading && error !== '' && (
          <>
            <p>{error}</p>
          </>
        )}
      </Modal.Body>

      <Modal.Footer>
        <button type="button" className="btn btn-primary" onClick={e => onSubmit(entity)}>
          {'\u00A0\u00A0\u00A0\u00A0'}
          {intl.formatMessage({ id: confirmBtn })}
          {'\u00A0\u00A0\u00A0\u00A0'}
        </button>

        <button type="button" onClick={onHide} className="btn btn-outline-primary">
          {'\u00A0'}
          {'\u00A0'}
          {'\u00A0'}
          {'\u00A0'}
          <CancelOutlinedIcon style={iconStyle} />
          {'\u00A0'}
          {intl.formatMessage({ id: cancelBtn })}
          {'\u00A0'}
          {'\u00A0'}
          {'\u00A0'}
          {'\u00A0'}
        </button>
      </Modal.Footer>
    </Modal>
  );
}
