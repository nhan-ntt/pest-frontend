/* eslint-disable no-restricted-imports */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import Dropdown from 'react-bootstrap/Dropdown';
import { useSelector } from 'react-redux';
import objectPath from 'object-path';
import { DropdownTopbarItemToggler } from '../../../../../_metronic/_partials/dropdowns';
import { ToAbsoluteUrl } from '../../../../common-library/helpers/assets-helpers';
import { useHtmlClassService } from '../../../_core/metronic-layout';

export function UserProfileDropdown() {
  const { user } = useSelector((state: any) => state.auth);

  const uiService: any = useHtmlClassService();
  const layoutProps = useMemo(() => {
    return {
      light: objectPath.get(uiService.config, 'extras.user.dropdown.style') === 'light',
    };
  }, [uiService]);
  const location = window.location;
  const { pathname } = location;
  const callbackUrl = pathname;
  return (
    <Dropdown drop="down" alignRight>
      <Dropdown.Toggle as={DropdownTopbarItemToggler} id="dropdown-toggle-user-profile">
        <div className={'btn btn-icon w-auto btn-clean d-flex align-items-center btn-lg px-2'}>
          <span className="text-muted font-weight-bold font-size-base d-none d-md-inline mr-1">
            Hi,
          </span>
          <span className="text-dark-50 font-weight-bolder font-size-base d-none d-md-inline mr-3">
            {user.firstName + ' ' + user.lastName}
          </span>
          <span className="symbol symbol-35 symbol-light-success">
            <span
              className="symbol-label font-size-h5 font-weight-bold"
              style={{ backgroundColor: '#27ae60' }}>
              {user.firstName[0]}
            </span>
          </span>
        </div>
      </Dropdown.Toggle>
      <Dropdown.Menu className="p-0 m-0 dropdown-menu-right dropdown-menu-anim dropdown-menu-top-unround dropdown-menu-xl">
        <>
          {/** ClassName should be 'dropdown-menu p-0 m-0 dropdown-menu-right dropdown-menu-anim dropdown-menu-top-unround dropdown-menu-xl' */}
          {layoutProps.light && (
            <>
              <div className="d-flex align-items-center p-8 rounded-top">
                <div className="symbol symbol-md bg-light-primary mr-3 flex-shrink-0">
                  <img src={ToAbsoluteUrl('/media/users/300_21.jpg')} alt="" />
                </div>
                <div className="text-dark m-0 flex-grow-1 mr-3 font-size-h5">Sean Stone</div>
                <span className="label label-light-success label-lg font-weight-bold label-inline">
                  3 messages
                </span>
              </div>
              <div className="separator separator-solid" />
            </>
          )}

          {!layoutProps.light && (
            <div
              className="d-flex align-items-center justify-content-between flex-wrap p-8 bgi-size-cover bgi-no-repeat rounded-top"
              style={{
                backgroundImage: `url(${ToAbsoluteUrl('/media/misc/bg-1.jpg')})`,
              }}>
              <div className="symbol bg-white-o-15 mr-3">
                <span className="symbol-label text-success font-weight-bold font-size-h4">S</span>
                {/*<img alt="Pic" className="hidden" src={user.pic} />*/}
              </div>
              <div className="text-white m-0 flex-grow-1 mr-3 font-size-h5">Sean Stone</div>
              <span className="label label-success label-lg font-weight-bold label-inline">
                3 messages
              </span>
            </div>
          )}
        </>

        <div className="navi navi-spacer-x-0 pt-5">
          <a className="navi-item px-8">
            <div className="navi-link">
              <div className="navi-icon mr-2">
                <i className="flaticon2-calendar-3 text-success" />
              </div>
              <div className="navi-text">
                <div className="font-weight-bold">My Profile</div>
                <div className="text-muted">
                  Account settings and more
                  <span className="label label-light-danger label-inline font-weight-bold">
                    update
                  </span>
                </div>
              </div>
            </div>
          </a>

          <a className="navi-item px-8">
            <div className="navi-link">
              <div className="navi-icon mr-2">
                <i className="flaticon2-mail text-warning" />
              </div>
              <div className="navi-text">
                <div className="font-weight-bold">My Messages</div>
                <div className="text-muted">Inbox and tasks</div>
              </div>
            </div>
          </a>

          <a className="navi-item px-8">
            <div className="navi-link">
              <div className="navi-icon mr-2">
                <i className="flaticon2-rocket-1 text-danger" />
              </div>
              <div className="navi-text">
                <div className="font-weight-bold">My Activities</div>
                <div className="text-muted">Logs and notifications</div>
              </div>
            </div>
          </a>

          <a className="navi-item px-8">
            <div className="navi-link">
              <div className="navi-icon mr-2">
                <i className="flaticon2-hourglass text-primary" />
              </div>
              <div className="navi-text">
                <div className="font-weight-bold">My Tasks</div>
                <div className="text-muted">latest tasks and projects</div>
              </div>
            </div>
          </a>
          <div className="navi-separator mt-3" />

          <div className="navi-footer  px-8 py-5">
            <Link
              to={'/logout?callbackUrl=' + callbackUrl}
              className="btn btn-light-primary font-weight-bold">
              Sign Out
            </Link>
            <a href="#" className="btn btn-clean font-weight-bold">
              Upgrade Plan
            </a>
          </div>
        </div>
      </Dropdown.Menu>
    </Dropdown>
  );
}
