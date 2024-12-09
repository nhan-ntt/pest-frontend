import { Fragment, useEffect, useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import moment from 'moment';
import {
  dangerIconStyle,
  DefaultPagination,
  HomePageURL,
  iconStyle,
  NormalColumn,
  successIconStyle,
} from '../../common-library/common-consts/const';
import { MasterHeader } from '../../common-library/common-components/master-header';
import {
  ModifyForm,
  ModifyInputGroup,
  RenderInfoDetail,
  SearchModel,
} from '../../common-library/common-types/common-type';
import { InitMasterProps, notifyError } from '../../common-library/helpers/common-function';
import { Route, Switch, useHistory } from 'react-router-dom';
import {
  Create,
  Delete,
  DeleteMany,
  GetAll,
  GetById,
  Update,
  CreateReportAPI,
  getPestLevelApi,
  getPlantStageApi,
} from './report.service';
import { MasterBody } from '../../common-library/common-components/master-body';
import { ActionsColumnFormatter } from '../../common-library/common-components/actions-column-formatter';
import { DeleteEntityDialog } from '../../common-library/common-components/delete-entity-dialog';
import { Spinner } from 'react-bootstrap';
import SaveOutlinedIcon from '@material-ui/icons/SaveOutlined';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
import { NotifyDialog } from '../../common-library/common-components/notify-dialog';
import { RootStateOrAny, useSelector } from 'react-redux';
import { MasterEntityDetailDialog } from '../../common-library/common-components/master-entity-detail-dialog';
import EntityCrudPage from '../../common-library/common-components/entity-crud-page';
import { GetProvince, GetDistrict, GetWards } from '../service/service.service';
import { LIST_PEST_LEVEL } from '../predict/warning-forecast';
import { object } from 'yup';
import store from '../../../redux/store';

const headerTitle = 'COMMON.MASTER.FILTER';

function Report() {
  const intl = useIntl();
    
  const currentUser = store.getState().auth;
    
  const {
    entities,
    deleteEntity,
    setDeleteEntity,
    createEntity,
    editEntity,
    setEditEntity,
    selectedEntities,
    showDelete,
    setShowDetail,
    detailEntity,
    setDetailEntity,
    showDetail,
    setShowDelete,
    paginationProps,
    setPaginationProps,
    filterProps,
    setFilterProps,
    total,
    loading,
    error,
    add,
    update,
    deleteFn,
    getAll,
    formatLongString,
  } = InitMasterProps<any>({
    createServer: Create,
    deleteServer: Delete,
    deleteManyServer: DeleteMany,
    getAllServer: GetAll,
    updateServer: Update,
  });

  const createTitle = 'COMMON.MASTER.CREATE';
  const updateTitle = 'COMMON.MASTER.UPDATE';
  const viewTitle = 'REPORT.MASTER.HEADER.TITLE';
  const viewInfoTitle = 'COMMON.MASTER.INFORMATION';

  const [currentTab, setCurrentTab] = useState<string | undefined>('0');
  const [trigger, setTrigger] = useState<boolean>(false);
  const [codeCity, setCodeCity] = useState(0);
  const [codeDistrict, setCodeDistrict] = useState(0);
  const [currentState, setCurrentState] = useState(undefined);
  const [currentCity, setCurrentCity] = useState(undefined);
  const [currentDistrict, setCurrentDistrict] = useState(undefined);
  const [isChange, setIsChange] = useState(false);
  const [showNotify, setShowNotify] = useState(false);
  const [currentPest, setCurrentPest] = useState(undefined);  
    
  const history = useHistory();

  const columns = useMemo(() => {
    return [
      {
        dataField: 'state',
        text: `${intl.formatMessage({ id: 'COMMON.MASTER.CITY' })}`,
        headerClasses: 'text-center',
        align: 'center',
        sort: true,
      },
      {
        dataField: 'city',
        text: `${intl.formatMessage({ id: 'COMMON.MASTER.DISTRICT' })}`,
        headerClasses: 'text-center',
        align: 'center',
        sort: true,
      },
      {
        dataField: 'district',
        text: `${intl.formatMessage({ id: 'COMMON.MASTER.WARD' })}`,
        headerClasses: 'text-center',
        align: 'center',
        sort: true,
      },
      {
        dataField: 'user',
        text: `${intl.formatMessage({ id: 'REPORT.MASTER.TABLE.REPORTER' })}`,
        formatter: (value: any) => {
          return value.fullName;
        },
        headerClasses: 'text-center',
        align: 'center',
        sort: true,
      },
      {
        dataField: 'updatedAt',
        text: `${intl.formatMessage({ id: 'REPORT.MASTER.TABLE.LAST_TIME_REPORT' })}`,
        formatter: (value: any) => {
          return moment(value).format('DD.MM.YYYY');
        },
        headerClasses: 'text-center',
        align: 'center',
        sort: true,
      },

      {
        dataField: 'action',
        text: `${intl.formatMessage({ id: 'COMMON.MASTER.ACTION' })}`,
        formatter: ActionsColumnFormatter,
        formatExtraData: {
          intl,
          onShowDetail: (entity: any) => {
            setDetailEntity(entity);
            getPestLevelApi().then((result: any) => {
              if (!result.data) return;

              const indexlastLevel = result.data.findIndex(
                (el: any) => el._id === entity.pestLevel,
              );

              setDetailEntity({
                ...entity,
                pestLevel: result.data[indexlastLevel]?.name || entity.pestLevel,
              });
            });
            history.push(`${window.location.pathname}/${entity._id}/view`);
            // setShowDetail(true);
          },
          onEdit: (entity: any) => {
            if (entity.user._id != currentUser._id) {
                setShowNotify(true);
                return;
            }    

            GetProvince().then((states: any) => {
              const stateData: any = states?.data;
              const state = stateData.find((el: any) => el.name_with_type === entity.state);
              setCodeCity(state.code);

              GetDistrict(state.code).then((citys: any) => {
                const cityData: any = citys?.data;
                const cityCurrent = cityData.find((el: any) => el.name_with_type === entity.city);
                setCodeDistrict(cityCurrent.code);

                GetWards(cityCurrent.code).then((districts: any) => {
                  const districtData: any = districts?.data;
                  const districtCurrent = districtData.find(
                    (el: any) => el.name_with_type === entity.district,
                  );
                  setEditEntity({
                    ...entity,
                    state: state,
                    city: cityCurrent,
                    district: districtCurrent,
                  });
                });
              });
            });
            history.push(`${window.location.pathname}/${entity._id}/edit`);
          },
          onDelete: (entity: any) => {
            if (entity.user._id != currentUser._id) {
                setShowNotify(true);
                return;
            }  

            setDeleteEntity(entity);
            setShowDelete(true);
          },
        },
        ...NormalColumn,
        style: { minWidth: '130px' },
      },
    ];
  }, []);

  useEffect(() => {
    setCodeCity(codeCity);
    setCodeDistrict(codeDistrict);
  }, [codeCity, codeDistrict]);

  useEffect(() => {
    setCurrentState(currentState);
    setCurrentCity(currentCity);
    setCurrentDistrict(currentDistrict);
  }, [currentState, currentCity, currentDistrict]);

  useEffect(() => {
    setIsChange(isChange);
  }, [isChange]);

  useEffect(() => {
    if (Object.keys(filterProps).length === 0) getAll({
        state: currentUser?.state?.name_with_type,
        city: currentUser?.city?.name_with_type,
        district: currentUser?.district?.name_with_type,
    })
    else getAll(filterProps);
    // CreateReportAPI({
    //   state: 'Thành phố Hà Nội',
    //   city: 'Quận Ba Đình',
    //   district: 'Test',
    //   timeEnd: '2022-05-17T17:37:13.426Z',
    //   pestLevel: 'abcxyz',
    //   address: 'temp',
    //   note: 'okay',
    // });
  }, [paginationProps, filterProps, trigger, currentTab]);

  const onChangeValueCity = (city: any) => {
    city && setCodeCity(city.code);
    setCurrentState(city);
    setCurrentCity(undefined);
    setCurrentDistrict(undefined);
    setCodeDistrict(0);
    setIsChange(true);
  };

  const onChangeValueDistrict = (district: any) => {
    district && setCodeDistrict(district.code);
    setCurrentCity(district);
    setCurrentDistrict(undefined);
    setIsChange(true);
  };

  const onChangeValueWards = (ward: any) => {
    setCurrentDistrict(ward);
  };

  // FILTER SEARCH
  const searchModel: SearchModel = useMemo(
    () => ({
      state: {
        type: 'search-select',
        label: 'COMMON.MASTER.CITY',
        placeholder: 'COMMON.MASTER.CITY',
        onSearch: GetProvince,
        onChange: value => onChangeValueCity(value),
        value: currentState,
        keyField: 'name_with_type',
      },
      city: {
        type: 'search-select',
        label: 'COMMON.MASTER.DISTRICT',
        placeholder: 'COMMON.MASTER.DISTRICT',
        code: codeCity,
        onSearch: GetDistrict,
        onChange: value => onChangeValueDistrict(value),
        value: currentCity,
        keyField: 'name_with_type',
      },
      district: {
        type: 'search-select',
        label: 'COMMON.MASTER.WARD',
        placeholder: 'COMMON.MASTER.WARD',
        code: codeDistrict,
        onSearch: GetWards,
        onChange: value => onChangeValueWards(value),
        value: currentDistrict,
        keyField: 'name_with_type',
      },
      fullName: {
        type: 'string',
        label: 'REPORT.MASTER.TABLE.REPORTER',
        placeholder: 'REPORT.MASTER.TABLE.REPORTER',
      },
      createdAt: {
        type: 'date-time-range',
        label: 'REPORT.MASTER.TABLE.TIME_REPORT',
        placeholder: 'REPORT.MASTER.TABLE.TIME_REPORT',
      },
    }),
    [currentTab, codeCity, codeDistrict, currentState, currentCity, currentDistrict],
  );

  // CREATE STATE
  const [createGroup1, setCreateGroup1] = useState<ModifyInputGroup | any>({
    _subTitle: 'REPORT.MASTER.TAB.INFOMATION_AREA',
    _className: 'px-4',
    _styleName: {
      gridArea: '1 / 1 / span 2 / auto',
    },
    state: {
      _type: 'search-select',
      label: 'COMMON.MASTER.CITY',
      placeholder: 'COMMON.MASTER.CITY',
      onSearch: GetProvince,
      value: currentState,
      onChange: (value: any) => onChangeValueCity(value),
      keyField: 'name_with_type',
      required: true,
    },
    city: {
      _type: 'search-select',
      label: 'COMMON.MASTER.DISTRICT',
      placeholder: 'COMMON.MASTER.DISTRICT',
      code: codeCity,
      onSearch: GetDistrict,
      value: currentCity,
      onChange: (value: any) => onChangeValueDistrict(value),
      keyField: 'name_with_type',
      required: true,
    },
    district: {
      _type: 'search-select',
      label: 'COMMON.MASTER.WARD',
      placeholder: 'COMMON.MASTER.WARD',
      code: codeDistrict,
      onSearch: GetWards,
      value: currentDistrict,
      onChange: (value: any) => onChangeValueWards(value),
      keyField: 'name_with_type',
      required: true,
    },
    address: {
      _type: 'string',
      label: 'COMMON.MASTER.ADDRESS',
      placeholder: 'COMMON.MASTER.ADDRESS',
    },
  });

  const [createGroup2, setCreateGroup2] = useState<ModifyInputGroup | any>({
    _subTitle: 'REPORT.MASTER.TAB.PREV_INFOMATION',
    _className: 'px-4',
    _styleName: {
      gridArea: '1 / 2 / auto / auto',
    },
    timeEnd: {
      _type: 'date-time',
      label: 'REPORT.MASTER.TABLE.TIME_END',
      placeholder: 'REPORT.MASTER.TABLE.TIME_END',
      disabledDate: (current: any) => {
        return moment().add(-1, 'days') <= current;
      },
    },
  });
    
  const [createGroup3, setCreateGroup3] = useState<ModifyInputGroup | any>({
    _subTitle: 'REPORT.MASTER.TAB.REPORT_INFOMATION',
    _className: 'px-4',
    _styleName: {
      gridArea: '2 / 2 / auto / auto',
    },
    pestLevel: {
      _type: 'search-select',
      label: 'PREDICT.MASTER.TABLE.PEST_LEVEL',
      placeholder: 'PREDICT.MASTER.TABLE.PEST_LEVEL',
      onSearch: () => Promise.resolve({ data: LIST_PEST_LEVEL }),
      onChange: (value: any) => setCurrentPest(value),
      keyField: 'name',
      required: true,
    },  
    note: {
      _type: 'string',
      label: 'COMMON.MASTER.NOTE',
      placeholder: 'COMMON.MASTER.NOTE',
    },
  });

  // EDIT STATE
  const [editGroup1, setEditGroup1] = useState<ModifyInputGroup | any>({
    _subTitle: 'REPORT.MASTER.TAB.INFOMATION_AREA',
    _className: 'px-4',
    _styleName: {
      gridArea: '1 / 1 / span 2 / auto',
    },
    state: {
      _type: 'search-select',
      label: 'COMMON.MASTER.CITY',
      placeholder: 'COMMON.MASTER.CITY',
      onSearch: GetProvince,
      value: currentState,
      onChange: (value: any) => onChangeValueCity(value),
      keyField: 'name_with_type',
      required: true,
    },
    city: {
      _type: 'search-select',
      label: 'COMMON.MASTER.DISTRICT',
      placeholder: 'COMMON.MASTER.DISTRICT',
      code: codeCity,
      value: currentCity,
      onSearch: GetDistrict,
      onChange: (value: any) => onChangeValueDistrict(value),
      keyField: 'name_with_type',
      required: true,
    },
    district: {
      _type: 'search-select',
      label: 'COMMON.MASTER.WARD',
      placeholder: 'COMMON.MASTER.WARD',
      code: codeDistrict,
      value: currentDistrict,
      onSearch: GetWards,
      keyField: 'name_with_type',
      required: true,
    },
    address: {
      _type: 'string',
      label: 'COMMON.MASTER.ADDRESS',
      placeholder: 'COMMON.MASTER.ADDRESS',
    },
  });

  const [editGroup2, setEditGroup2] = useState<ModifyInputGroup | any>({
    _subTitle: 'REPORT.MASTER.TAB.PREV_INFOMATION',
    _className: 'px-4',
    _styleName: {
      gridArea: '1 / 2 / auto / auto',
    },
    timeEnd: {
      _type: 'date-time',
      label: 'REPORT.MASTER.TABLE.TIME_END',
      placeholder: 'REPORT.MASTER.TABLE.TIME_END',
      disabledDate: (current: any) => {
        return moment().add(-1, 'days') <= current;
      },
    },
  });
    
  const [editGroup3, setEditGroup3] = useState<ModifyInputGroup | any>({
    _subTitle: 'REPORT.MASTER.TAB.REPORT_INFOMATION',
    _className: 'px-4',
    _styleName: {
      gridArea: '2 / 2 / auto / auto',
    },
    pestLevel: {
      _type: 'search-select',
      label: 'PREDICT.MASTER.TABLE.PEST_LEVEL',
      placeholder: 'PREDICT.MASTER.TABLE.PEST_LEVEL',
      onSearch: () => Promise.resolve({ data: LIST_PEST_LEVEL }),
      onChange: (value: any) => setCurrentPest(value),
      keyField: 'name',
      required: true,
    },  
    note: {
      _type: 'string',
      label: 'COMMON.MASTER.NOTE',
      placeholder: 'COMMON.MASTER.NOTE',
    },
  });  

  const [editGroup4, setEditGroup4] = useState<ModifyInputGroup | any>({
    _subTitle: 'REPORT.MASTER.TAB.REPORT_INFOMATION',
    _className: 'px-4 col-6',
    user: {
      _type: 'string',
      label: 'REPORT.MASTER.TABLE.REPORTER',
      placeholder: 'REPORT.MASTER.TABLE.REPORTER',
      formatter: (value: any) => {
        return value?.fullName;
      },
      keyField: 'fullName',
    },
    createdAt: {
      _type: 'date-time',
      label: 'REPORT.MASTER.TABLE.TIME_REPORT',
      placeholder: 'REPORT.MASTER.TABLE.TIME_REPORT',
    },
    updatedAt: {
      _type: 'date-time',
      label: 'REPORT.MASTER.TABLE.LAST_TIME_REPORT',
      placeholder: 'REPORT.MASTER.TABLE.LAST_TIME_REPORT',
    },
  });

  // VIEW STATE
  const [viewGroup1, setViewGroup1] = useState<ModifyInputGroup | any>({
    _subTitle: 'REPORT.MASTER.TAB.INFOMATION_AREA',
    _className: 'px-4',
    _styleName: {
      gridArea: '1 / 1 / span 2 / auto',
    },
    state: {
      _type: 'string',
      disabled: true,
      label: 'COMMON.MASTER.CITY',
      placeholder: 'COMMON.MASTER.CITY',
    },
    city: {
      _type: 'string',
      label: 'COMMON.MASTER.DISTRICT',
      placeholder: 'COMMON.MASTER.DISTRICT',
      disabled: true,
    },
    district: {
      _type: 'string',
      label: 'COMMON.MASTER.WARD',
      placeholder: 'COMMON.MASTER.WARD',
      disabled: true,
    },
    address: {
      _type: 'string',
      label: 'COMMON.MASTER.ADDRESS',
      placeholder: 'COMMON.MASTER.ADDRESS',
      disabled: true,
    },
  });

  const [viewGroup2, setViewGroup2] = useState<ModifyInputGroup | any>({
    _subTitle: 'REPORT.MASTER.TAB.PREV_INFOMATION',
    _className: 'px-4',
    _styleName: {
      gridArea: '1 / 2 / auto / auto',
    },
    timeEnd: {
      _type: 'string',
      label: 'REPORT.MASTER.TABLE.TIME_END',
      placeholder: 'REPORT.MASTER.TABLE.TIME_END',
      disabled: true,
      formatter: (value: any) => {
        return moment(value).format('DD.MM.YYYY');
      },
    },
  });
    
  const [viewGroup3, setViewGroup3] = useState<ModifyInputGroup | any>({
    _subTitle: 'REPORT.MASTER.TAB.REPORT_INFOMATION',
    _className: 'px-4',
    _styleName: {
      gridArea: '2 / 2 / auto / auto',
    },
    pestLevel: {
      _type: 'string',
      label: 'PREDICT.MASTER.TABLE.PEST_LEVEL',
      placeholder: 'PREDICT.MASTER.TABLE.PEST_LEVEL',
      disabled: true,
    },  
    note: {
      _type: 'string',
      label: 'COMMON.MASTER.NOTE',
      placeholder: 'COMMON.MASTER.NOTE',
      disabled: true,
    },
  });  

  const [viewGroup4, setViewGroup4] = useState<ModifyInputGroup | any>({
    _subTitle: 'REPORT.MASTER.TAB.REPORT_INFOMATION',
    _className: 'px-4 col-6',
    _styleName: {
      gridArea: '1 / 1 / 1 / 1',
    },
    user: {
      _type: 'string',
      disabled: true,
      label: 'REPORT.MASTER.TABLE.REPORTER',
      placeholder: 'REPORT.MASTER.TABLE.REPORTER',
      formatter: (value: any) => {
        return value?.fullName;
      },
    },
    createdAt: {
      _type: 'string',
      disabled: true,
      label: 'REPORT.MASTER.TABLE.TIME_REPORT',
      placeholder: 'REPORT.MASTER.TABLE.TIME_REPORT',
      formatter: (value: any) => {
        return moment(value).format('DD.MM.YYYY');
      },
    },
    updatedAt: {
      _type: 'date-time',
      disabled: true,
      label: 'REPORT.MASTER.TABLE.LAST_TIME_REPORT',
      placeholder: 'REPORT.MASTER.TABLE.LAST_TIME_REPORT',
      formatter: (value: any) => {
        return moment(value).format('DD.MM.YYYY');
      },
    },
  });

  const createForm = useMemo(
    (): ModifyForm => ({
      _header: createTitle,
      panel1: {
        _title: '',
        group1: {
          ...createGroup1,
          state: { ...createGroup1.state, value: currentState },
          city: { ...createGroup1.city, code: codeCity, value: currentCity },
          district: { ...createGroup1.district, code: codeDistrict, value: currentDistrict },
        },
        group2: createGroup2,
        group3: createGroup3,
      },
    }),
    [
      createGroup1,
      createGroup2,
      createGroup3,
      codeCity,
      codeDistrict,
      currentState,
      currentCity,
      currentDistrict,
    ],
  );

  const updateForm = useMemo(
    (): ModifyForm => ({
      _header: updateTitle,
      panel1: {
        _title: '',
        group1: {
          ...editGroup1,
          city: { ...editGroup1.city, code: codeCity },
          district: { ...editGroup1.district, code: codeDistrict },
        },
        group2: editGroup2,
        group3: editGroup3,
      },
    }),
    [editGroup1, editGroup2, editGroup3, codeCity, codeDistrict],
  );

  const infomationReportForm = useMemo(
    (): ModifyForm => ({
      _header: '',
      panel1: {
        _title: '',
        group1: editGroup4,
      },
    }),
    [editGroup4],
  );

  // VIEW
  const viewForm = useMemo(
    (): ModifyForm => ({
      _header: viewInfoTitle,
      panel1: {
        _title: '',
        group1: viewGroup1,
        group2: viewGroup2,
        group3: viewGroup3,
      },
    }),
    [viewGroup1, viewGroup2, viewGroup3],
  );

  const viewinfomationReportForm = useMemo(
    (): ModifyForm => ({
      _header: '',
      panel1: {
        _title: '',
        group1: viewGroup4,
      },
    }),
    [viewGroup4],
  );

  const actions: any = useMemo(
    () => ({
      type: 'inside',
      data: {
        save: {
          role: 'submit',
          type: 'submit',
          linkto: HomePageURL.report,
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
          linkto: HomePageURL.report,
          className: 'btn btn-outline-primary fixed-btn-width',
          label: 'COMMON.BTN_CANCEL',
          icon: <CancelOutlinedIcon />,
        },
      },
    }),
    [loading],
  );

  const onCreate = () => {
    // setCodeDistrict(0);
    // setCodeCity(0);
    setCurrentState(undefined);
    setCurrentCity(undefined);
    setCurrentDistrict(undefined);
    history.push(`${window.location.pathname}/0000000`);
  };

  const handleSelectManyUser = (report: any) => {
    console.log('report', report);
  };

  const handleDeleteUsers = () => {
    setShowDelete(true);
  };

  const onModifyInfoReport = (value: any) => {
    // console.log('onModifyInfoReport value', value);
    return Promise.resolve([]);
  };

  return (
    <Fragment>
      <Switch>
        <Route path={`${HomePageURL.report}/0000000`}>
          <EntityCrudPage
            moduleName={'MODULE.NAME'}
            onModify={add}
            formModel={createForm}
            entity={createEntity}
            actions={actions}
            homePageUrl={HomePageURL.report}
          />
        </Route>
        <Route path={`${HomePageURL.report}/:code/edit`}>
          {({ match }) => (
            <div>
              <EntityCrudPage
                onModify={update}
                entity={{
                  ...editEntity,
                  state: isChange ?  currentState : editEntity.state,
                  city: isChange ?  currentCity :  editEntity.city,
                  district: isChange ? currentDistrict : editEntity.district,
                  pestLevel: isChange ? currentPest : LIST_PEST_LEVEL.find((p: any) => p.value === editEntity.pestLevel),
                }}
                setEditEntity={setEditEntity}
                moduleName={'MODULE.NAME'}
                formModel={updateForm}
                actions={actions}
                homePageUrl={HomePageURL.report}
              />
              <EntityCrudPage
                onModify={onModifyInfoReport}
                isEdit={false}
                entity={editEntity}
                isBackHome={false}
                setEditEntity={setEditEntity}
                moduleName={'MODULE.NAME'}
                formModel={infomationReportForm}
              />
            </div>
          )}
        </Route>
        <Route path={`${HomePageURL.report}/:code/view`}>
          {({ match }) => (
            <div>
              <EntityCrudPage
                onModify={onModifyInfoReport}
                isEdit={false}
                entity={detailEntity}
                setEditEntity={setDetailEntity}
                moduleName={'MODULE.NAME'}
                formModel={viewForm}
                homePageUrl={HomePageURL.report}
              />
              <EntityCrudPage
                onModify={onModifyInfoReport}
                isEdit={false}
                entity={detailEntity}
                setEditEntity={setDetailEntity}
                moduleName={'MODULE.NAME'}
                formModel={viewinfomationReportForm}
              />
            </div>
          )}
        </Route>

        <Route path={`${HomePageURL.report}`} exact={true}>
          <MasterHeader
            title={headerTitle}
            onSearch={value => {
              setPaginationProps(DefaultPagination);
              setFilterProps({
                ...value,
                city: value?.city?.name_with_type,
                district: value?.district?.name_with_type,
                state: value?.state?.name_with_type,
              });
            }}
            searchModel={searchModel}
          />
          <div className="activity-body">
            <MasterBody
              title="REPORT.MASTER.TABLE.TITLE"
              onCreate={onCreate}
              entities={entities}
              total={total}
              columns={columns as any}
              loading={loading}
              paginationParams={paginationProps}
              setPaginationParams={setPaginationProps}
              isShowId={true}
              hideHeaderButton={false}
            />
          </div>
        </Route>
      </Switch>

      {/* <MasterEntityDetailDialog
        title={viewTitle}
        show={showDetail}
        entity={detailEntity}
        renderInfo={masterEntityDetailDialog}
        size="lg"
        onHide={() => {
          setShowDetail(false);
        }}
      /> */}

      <NotifyDialog
        isShow={showNotify}
        onHide={() => {
          setShowNotify(false);
        }}      
        title={'REPORT.NOTIFY.TITLE.PERMISSION_DENIED'}
        notifyMessage={'REPORT.NOTIFY.MESSAGE.PERMISSION_DENIED'}      
        cancelBtn={'COMMON.BTN_CANCEL'}      
      />

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

export default Report;
