import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import {
  dangerIconStyle,
  DefaultPagination,
  HomePageURL,
  NormalColumn,
  SortColumn,
  successIconStyle,
  // blockIconStyle,
  iconStyle,
} from '../../common-library/common-consts/const';
import { MasterHeader } from '../../common-library/common-components/master-header';
import { ActionsColumnFormatter } from '../../common-library/common-components/actions-column-formatter';
import { DeleteEntityDialog } from '../../common-library/common-components/delete-entity-dialog';
import { InitMasterProps, notifyError } from '../../common-library/helpers/common-function';
import { Route, Switch, useHistory } from 'react-router-dom';
import { UserModel } from './user.model';
import { MasterEntityDetailDialog } from '../../common-library/common-components/master-entity-detail-dialog';
import * as UserService from './user.service';
import { GetProvince, GetDistrict, GetWards } from '../service/service.service';
import {
  BanUser,
  Count,
  Create,
  Delete,
  DeleteMany,
  Get,
  GetAll,
  GetAllByAdmin,
  Update,
  GetById,
  LookAccount,
  getRoles,
} from './user.service';
import moment from 'moment';
import './style.scss';
import { MasterBody } from '../../common-library/common-components/master-body';
import { Tooltip } from '@material-ui/core';
import { BlockOutlined, CheckOutlined, Add, RestoreFromTrash } from '@material-ui/icons';
import {
  ModifyForm,
  ModifyInputGroup,
  RenderInfoDetail,
  SearchModel,
} from '../../common-library/common-types/common-type';
import { Spinner } from 'react-bootstrap';
import SaveOutlinedIcon from '@material-ui/icons/SaveOutlined';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
import EntityCrudPage from '../../common-library/common-components/entity-crud-page';
import store from '../../../redux/store';

const headerTitle = 'COMMON_COMPONENT.FILTER';
const detailDialogTitle = 'USER.DETAIL_DIALOG.TITLE';
const moduleName = 'MODULE.NAME';
const lockDialogTitle = 'USER.LOCK_DIALOG.TITLE';
const unlockDialogTitle = 'USER.UNLOCK_DIALOG.TITLE';
const lockBtn = 'USER.LOCK_DIALOG.LOCK_BTN';
const unlockBtn = 'COMMON.BTN_UNLOCK';
const lockConfirmMessage = 'USER.LOCK_DIALOG.CONFIRM_MESSAGE';
const lockDialogBodyTitle = 'USER.LOCK_DIALOG.BODY_TITLE';
const deleteDialogTitle = 'USER.DELETE_DIALOG.TITLE';
const deleteConfirmMessage = 'USER.DELETE_DIALOG.CONFIRM_MESSAGE';
const deleteDialogBodyTitle = 'USER.DELETE_DIALOG.BODY_TITLE';
const createTitle = 'USER.MASTER.TABLE.CREATE';
const updateTitle = 'USER.MASTER.TABLE.UPDATE';

function User() {
  const intl = useIntl();
    
  const userRole = store.getState().auth.role.role;

  const history = useHistory();
  const {
    entities,
    setEntities,
    deleteEntity,
    setDeleteEntity,
    setDetailEntity,
    editEntity,
    setEditEntity,
    createEntity,
    setCreateEntity,
    selectedEntities,
    setSelectedEntities,
    detailEntity,
    showDelete,
    setShowDelete,
    showDeleteMany,
    setShowDeleteMany,
    showDetail,
    setShowDetail,
    paginationProps,
    setPaginationProps,
    filterProps,
    setFilterProps,
    total,
    loading,
    setLoading,
    error,
    add,
    update,
    get,
    deleteMany,
    deleteFn,
    getAll,
    formatLongString,
  } = InitMasterProps<any>({
    getServer: Get,
    countServer: Count,
    createServer: Create,
    deleteServer: Delete,
    deleteManyServer: DeleteMany,
    getAllServer: userRole != "admin"? GetAll : GetAllByAdmin,
    updateServer: Update,
  });

  const [currentTab, setCurrentTab] = useState<string | undefined>('0');
  const [trigger, setTrigger] = useState<boolean>(false);
  const [lockPopup, setShowLockPopup] = useState<boolean>(false);

  const [selectedUserList, setSelectedUserList] = useState([] as any);

  const [codeCity, setCodeCity] = useState(0);
  const [codeDistrict, setCodeDistrict] = useState(0);

  const [detailUserEdit, setDetailUserEdit] = useState({} as any);
  const [detailUserCreate, setDetailUserCreate] = useState({} as any);

  useEffect(() => {
    getAll(filterProps);
    setSelectedUserList([]);
  }, [paginationProps, filterProps, trigger, currentTab]);

  const onChangeValueCity = (city: any) => {
    // console.log('city', city);
    city && setCodeCity(city.code);
    setCodeDistrict(0);
  };

  const onChangeValueDistrict = (district: any) => {
    // console.log('district', district);
    district && setCodeDistrict(district.code);
  };

  const columns = useMemo(() => {
    return [
      {
        dataField: 'fullName',
        text: `${intl.formatMessage({ id: 'USER.MASTER.TABLE.NAME' })}`,
        headerClasses: 'text-center',
        classes: 'text-center',
        sort: true,
      },
      {
        dataField: 'phone',
        text: `${intl.formatMessage({ id: 'USER.MASTER.TABLE.PHONE' })}`,
        headerClasses: 'text-center',
        classes: 'text-center',
        sort: true,
      },
      userRole != "admin" ? {
        dataField: 'createdAt',
        text: `${intl.formatMessage({ id: 'USER.MASTER.TABLE.CREATEDAT' })}`,
        formatter: (value: any) => {
          return value ? moment(value).format('DD.MM.YYYY') : '--';
        },
        headerClasses: 'text-center',
        align: 'center',
        sort: true,
      } : {
        dataField: 'role.name',
        text: `${intl.formatMessage({ id: 'USER.MASTER.TABLE.RULE' })}`,
        headerClasses: 'text-center',
        classes: 'text-center',
        sort: true,
      },
      // {
      //   dataField: 'isActive',
      //   class: 'btn-primary',
      //   text: `${intl.formatMessage({ id: 'USER.MASTER.TABLE.STATUS' })}`,
      //   headerClasses: 'text-center',
      //   classes: 'text-center',
      //   formatter: (input: any) =>
      //     input ? (
      //       <CheckOutlined style={successIconStyle} />
      //     ) : (
      //       <CheckOutlined style={blockIconStyle} />
      //     ),
      // },
      {
        dataField: 'action',
        text: `${intl.formatMessage({ id: 'USER.MASTER.TABLE.ACTION_COLUMN' })}`,
        formatter: ActionsColumnFormatter,
        formatExtraData: {
          intl,
          // onLock: (entity: any) => {
          //   setDeleteEntity(entity);
          //   setShowLockPopup(true);
          // },
          onShowDetail: (entity: UserModel) => {
            setDetailEntity(entity);
            history.push(`${window.location.pathname}/${entity._id}/view`);
            // setShowDetail(true);
            },
            onEdit: userRole == "admin" ? (entity: any) => {
                let entityDetail = entity;
                setEditEntity(entity);

                GetProvince().then((states: any) => {
                    const stateData: any = states?.data;
                    const state = stateData.find((el: any) => el.name_with_type === entity.state);
      
                    if (!state) return;
      
                    state && setCodeCity(state?.code);
      
                    state?.code &&
                      GetDistrict(state.code).then((citys: any) => {
                        const cityData: any = citys?.data;
                        const cityCurrent = cityData.find((el: any) => el.name_with_type === entity.city);
      
                        if (!cityCurrent) return;
      
                        cityCurrent && setCodeDistrict(cityCurrent.code);
      
                        cityCurrent.code &&
                          GetWards(cityCurrent.code).then((districts: any) => {
                            const districtData: any = districts?.data;
      
                            const districtCurrent = districtData.find(
                              (el: any) => el.name_with_type === entity.district,
                            );
      
                            if (!districtCurrent) return;
      
                            entityDetail = {
                              ...entityDetail,
                              state: state,
                              city: cityCurrent,
                              district: districtCurrent,
                            };
      
                            setEditEntity({ ...entityDetail });
                          });
                      });
                  });

                history.push(`${window.location.pathname}/${entity._id}/edit`);
            } : undefined,
          onDelete: userRole == "admin" ? (entity: any) => {
              setDeleteEntity(entity);
              console.log(entity);
                setShowDelete(true);
            } : undefined,
        },
        ...NormalColumn,
        style: { minWidth: '130px' },
      },
    ];
  }, []);

  const searchModel: SearchModel = useMemo(
    () => ({
      fullName: {
        type: 'string',
        label: 'USER.MASTER.SEARCH.NAME',
        placeholder: 'USER.MASTER.SEARCH.NAME',
      },
      phone: {
        type: 'string-number',
        label: 'USER.MASTER.SEARCH.PHONE',
        placeholder: 'USER.MASTER.SEARCH.PHONE',
      },
          ...(userRole == "admin" ? {
              role: {
                  type: 'search-select',
                  label: 'USER.MASTER.TABLE.RULE',
                  onSearch: getRoles,
                  keyField: "name",
                  placeholder: 'USER.MASTER.TABLE.RULE'
              }
          } : {} 
        )
    }),
    [currentTab, userRole],
  );

  const [createGroup, setCreateGroup] = useState<ModifyInputGroup | any>({
    _subTitle: '',
    // image: {
    //   _type: 'image',
    //   isArray: false,
    //   maxNumber: 1,
    //   label: 'USER.MASTER.TABLE.AVATAR',
    // },
    _id: {
      _type: 'string',
      label: 'USER.MASTER.TABLE.CODE',
      disabled: true,
      value: window.location.href.split('/').pop(),
    },
    fullName: {
      _type: 'string',
      label: 'USER.MASTER.TABLE.FULLNAME',
      required: true,
    },
    dateOfBirth: {
      _type: 'date-time',
      label: 'USER.MASTER.TABLE.BIRTHDAY',
      required: true,
    },
    phone: {
      _type: 'string-number',
      label: 'USER.MASTER.TABLE.PHONE',
      required: true,
    },
    email: {
      _type: 'string',
      label: 'USER.MASTER.TABLE.MAIL',
      required: true,
    },
    password: {
      _type: 'string',
      label: 'USER.MASTER.TABLE.PASSWORD',
      required: true,
    },
    state: {
      _type: 'search-select',
      label: 'COMMON.MASTER.CITY',
      placeholder: 'COMMON.MASTER.CITY',
      onSearch: GetProvince,
      onChange: (value: any) => onChangeValueCity(value),
      keyField: 'name',
      required: true,
    },
    city: {
      _type: 'search-select',
      label: 'COMMON.MASTER.DISTRICT',
      placeholder: 'COMMON.MASTER.DISTRICT',
      code: codeCity,
      onSearch: GetDistrict,
      onChange: (value: any) => onChangeValueDistrict(value),
      keyField: 'name',
      required: true,
    },
    district: {
      _type: 'search-select',
      label: 'COMMON.MASTER.WARD',
      placeholder: 'COMMON.MASTER.WARD',
      code: codeDistrict,
      onSearch: GetWards,
      keyField: 'name',
      required: true,
    },
    address: {
      _type: 'string',
      label: 'USER.MASTER.TABLE.CITY.ADDRESS',
    },
    role: {
        _type: 'search-select',
        label: 'USER.MASTER.TABLE.RULE',
        onSearch: getRoles,
        keyField: 'name',
        required: true,
    }
  });

  const [editGroup, setEditGroup] = useState<ModifyInputGroup | any>({
    _subTitle: '',
    // image: {
    //   _type: 'image',
    //   isArray: false,
    //   maxNumber: 1,
    //   label: 'USER.MASTER.TABLE.AVATAR',
    // },
    _id: {
      _type: 'string',
      label: 'USER.MASTER.TABLE.CODE',
      required: true,
      disabled: true,
    },
    fullName: {
      _type: 'string',
      label: 'USER.MASTER.TABLE.FULLNAME',
      required: true,
    },
    dateOfBirth: {
      _type: 'date-time',
      label: 'USER.MASTER.TABLE.BIRTHDAY',
      required: true,
    },
    phone: {
      _type: 'string-number',
      label: 'USER.MASTER.TABLE.PHONE',
      required: true,
    },
    email: {
      _type: 'string',
      label: 'USER.MASTER.TABLE.MAIL',
        required: true,
      disabled: true,
    },
    state: {
      _type: 'search-select',
      label: 'COMMON.MASTER.CITY',
      placeholder: 'COMMON.MASTER.CITY',
      onSearch: GetProvince,
      onChange: (value: any) => onChangeValueCity(value),
      keyField: 'name',
      required: true,
    },
    city: {
      _type: 'search-select',
      label: 'COMMON.MASTER.DISTRICT',
      placeholder: 'COMMON.MASTER.DISTRICT',
      code: codeCity,
      onSearch: GetDistrict,
      onChange: (value: any) => onChangeValueDistrict(value),
      keyField: 'name',
      required: true,
    },
    district: {
      _type: 'search-select',
      label: 'COMMON.MASTER.WARD',
      placeholder: 'COMMON.MASTER.WARD',
      code: codeDistrict,
      onSearch: GetWards,
      keyField: 'name',
      required: true,
    },
    address: {
      _type: 'string',
      label: 'USER.MASTER.TABLE.CITY.ADDRESS',
    },
    role: {
        _type: 'search-select',
        label: 'USER.MASTER.TABLE.RULE',
        onSearch: getRoles,
        keyField: 'name',
        required: true,
    }
  });

  const createForm = useMemo(
    (): ModifyForm => ({
      _header: createTitle,
      panel1: {
        _title: '',
        group1: {
          ...createGroup,
          city: { ...createGroup.city, code: codeCity },
          district: { ...createGroup.district, code: codeDistrict },
        },
      },
    }),
    [createGroup, codeCity, codeDistrict],
  );

  const updateForm = useMemo(
    (): ModifyForm => ({
      _header: updateTitle,
      panel1: {
        _title: '',
        group1: {
          ...editGroup,
          city: { ...editGroup.city, code: codeCity },
          district: { ...editGroup.district, code: codeDistrict },
        },
      },
    }),
    [editGroup, codeCity, codeDistrict],
  );

  const [viewGroup1, setViewGroup1] = useState<ModifyInputGroup | any>({
    _subTitle: 'USER.DETAIL_DIALOG.TITLE',
    _className: 'px-4',
    _styleName: {
      gridArea: '1 / 1 / 1 / 1',
    },
    // image: {
    //   _type: 'image',
    //   isArray: false,
    //   maxNumber: 1,
    //   label: 'USER.MASTER.TABLE.AVATAR',
    //   disabled: true,
    // },
    _id: {
      _type: 'string',
      label: 'USER.MASTER.TABLE.CODE',
      disabled: true,
      value: window.location.href.split('/').pop(),
    },
    fullName: {
      _type: 'string',
      label: 'USER.MASTER.TABLE.FULLNAME',
      disabled: true,
    },
    phone: {
      _type: 'string-number',
      label: 'USER.MASTER.TABLE.PHONE',
      disabled: true,
      },
    dateOfBirth: {
      _type: 'string',
      label: 'USER.MASTER.TABLE.BIRTHDAY',
      disabled: true,
      formatter: (value: any) => {
        return moment(value).format('DD.MM.YYYY');
      },
    }
  });

  const [viewGroup2, setViewGroup2] = useState<ModifyInputGroup | any>({
    _subTitle: '',
    _className: 'px-4',
    _styleName: {
      gridArea: '1 / 2 / 1 / 2',
    },
    email: {
      _type: 'string',
      label: 'USER.MASTER.TABLE.MAIL',
      required: true,
      disabled: true,
    },
    password: {
      _type: 'string',
      label: 'USER.MASTER.TABLE.PASSWORD',
      required: true,
      disabled: true,
    },
    state: {
      _type: 'string',
      label: 'COMMON.MASTER.CITY',
      placeholder: 'COMMON.MASTER.CITY',
      required: true,
      disabled: true,
    },
    city: {
      _type: 'string',
      label: 'COMMON.MASTER.DISTRICT',
      placeholder: 'COMMON.MASTER.DISTRICT',
      code: codeCity,
      required: true,
      disabled: true,
    },
    district: {
      _type: 'string',
      label: 'COMMON.MASTER.WARD',
      placeholder: 'COMMON.MASTER.WARD',
      required: true,
      disabled: true,
    },

    address: {
      _type: 'string',
      label: 'USER.MASTER.TABLE.CITY.ADDRESS',
      disabled: true,
    },
    role: {
      _type: 'string',
      label: 'USER.MASTER.SEARCH.RULE',
      keyField: 'name',
      required: true,
      disabled: true,
      formatter: (value: any) => {
        return value?.name;
      },
    },
  });

  const viewForm = useMemo(
    (): ModifyForm => ({
      _header: 'USER.DETAIL_DIALOG.TITLE',
      panel1: {
        _title: '',
        group1: viewGroup1,
        group2: viewGroup2,
      },
    }),
    [viewGroup1, viewGroup2],
  );

  const actions: any = useMemo(
    () => ({
      type: 'inside',
      data: {
        save: {
          role: 'submit',
          type: 'submit',
          linkto: HomePageURL.user,
          className: 'btn btn-primary mr-8 fixed-btn-width',
          label: 'COMMON_COMPONENT.MODIFY_DIALOG.SAVE_BTN',
          icon: loading ? (
            <Spinner style={iconStyle} animation="border" variant="light" size="sm" />
          ) : (
            <SaveOutlinedIcon style={iconStyle} />
          ),
        },
        cancel: {
          role: 'link-button',
          type: 'button',
          linkto: HomePageURL.user,
          className: 'btn btn-outline-primary fixed-btn-width',
          label: 'COMMON.BTN_CANCEL',
          icon: <CancelOutlinedIcon />,
        },
      },
    }),
    [loading],
  );

  const handleDeleteUsers = () => {
    setShowDelete(true);
    setDeleteEntity(selectedUserList);
  };

  const onCreate = () => {
    history.push(`${window.location.pathname}/0000000`);
  };

  const handleSelectManyUser = (users: any) => {
    // selectedUserList
    let listSelectCurrent = selectedUserList as any;

    if (users.length <= 0) {
      setSelectedUserList([]);
      return;
    }

    if (users.length <= listSelectCurrent.length) listSelectCurrent = [];
    users.forEach((user: any) => {
      let index = selectedUserList.findIndex((el: any) => el.code === user.code);
      // if (index !== -1) listSelectCurrent.splice(index, 1);
      if (index === -1) listSelectCurrent.push(user);
    });

    setSelectedUserList(listSelectCurrent);
  };

  const onModifyInfoUser = (value: any) => {
    // console.log('onModifyInfoUser value', value);
    return Promise.resolve([]);
  };

  return (
    <Fragment>
      <Switch>
        <Route path={`${HomePageURL.user}/0000000`}>
          <EntityCrudPage
            moduleName={'MODULE.NAME'}
            onModify={add}
            formModel={createForm}
            entity={createEntity}
            actions={actions}
            homePageUrl={HomePageURL.user}
          />
        </Route>
        <Route path={`${HomePageURL.user}/:code/edit`}>
          {({ match }) => (
            <EntityCrudPage
              onModify={update}
              entity={editEntity}
              setEditEntity={setEditEntity}
              moduleName={'MODULE.NAME'}
              get={GetById}
              formModel={updateForm}
              actions={actions}
              homePageUrl={HomePageURL.user}
            />
          )}
        </Route>

        <Route path={`${HomePageURL.user}/:code/view`}>
          {({ match }) => (
            <EntityCrudPage
              onModify={onModifyInfoUser}
              isEdit={false}
              entity={detailEntity}
              setEditEntity={setDetailEntity}
              moduleName={'MODULE.NAME'}
              formModel={viewForm}
              homePageUrl={HomePageURL.user}
            />
          )}
        </Route>

        <Route path={`${HomePageURL.user}`} exact={true}>
          <MasterHeader
            title={headerTitle}
            onSearch={value => {
              setPaginationProps(DefaultPagination);
              setFilterProps({
                ...value,
                role: value?.role?.role || '',
                state: value?.state?.code || '',
              });
            }}
            searchModel={searchModel}
          />
          <div className="user-body">
            <MasterBody
              title="USER.MASTER.TABLE.TITLE"
              onCreate={userRole == "admin" ? onCreate : undefined}
              entities={entities}
              total={total}
              columns={columns as any}
              loading={loading}
              paginationParams={paginationProps}
              setPaginationParams={setPaginationProps}
              hideHeaderButton={false}
              isShowId={true}
            />
          </div>
        </Route>
      </Switch>
          
      <DeleteEntityDialog
        entity={deleteEntity}
        onDelete={deleteFn}
        isShow={showDelete}
        loading={loading}
        error={error}
        onHide={() => {
          setShowDelete(false);
        }}
        title={'REPORT.DELETE.TITLE'}
        confirmMessage={'REPORT.DELETE.DELETE_MSG'}
        bodyTitle={'REPORT.DELETE.BODY_MSG'}
        deletingMessage={' '}
        deleteBtn={'COMMON.BTN_DELETE'}
        cancelBtn={'COMMON.BTN_CANCEL'}
      />
    </Fragment>
  );
}

export default User;
