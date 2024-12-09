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
  Get,
  GetAll,
  GetById,
  Update,
  GetPredictInMobile,
  getPlantStageApi,
  getPestLevelApi,
  EndPredict,
  GetUserById,
} from './predict.service';
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
import PredictBody from './predict-body';
import { ConfirmDialog } from '../../common-library/common-components/confirm-dialog';
import store from '../../../redux/store';
import WarningForecast from './warning-forecast';

const headerTitle = 'COMMON.MASTER.FILTER';

function Predict() {
  const intl = useIntl();
  
  const currentUser = store.getState().auth;

  const {
    entities,
    deleteEntity,
    setDeleteEntity,
    confirmEntity,
    setConfirmEntity,
    showFinish,
    setShowFinish,
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
    getServer: Get,
    createServer: Create,
    deleteServer: Delete,
    deleteManyServer: DeleteMany,
    getAllServer: GetAll,
    updateServer: Update,
  });

  const createTitle = 'COMMON.MASTER.CREATE';
  const updateTitle = 'COMMON.MASTER.UPDATE';
  const viewTitle = 'PREDICT.MASTER.HEADER.TITLE';
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

  const history = useHistory();

  useEffect(() => {
    if (Object.keys(filterProps).length === 0) getAll({
        state: currentUser?.state?.name_with_type,
        city: currentUser?.city?.name_with_type,
        district: currentUser?.district?.name_with_type,
    })
    else getAll(filterProps);
  }, [paginationProps, filterProps, trigger, currentTab]);

  useEffect(() => {
    setIsChange(isChange);
  }, [isChange]);

  useEffect(() => {
    setCurrentState(currentState);
    setCurrentCity(currentCity);
    setCurrentDistrict(currentDistrict);
  }, [currentState, currentCity, currentDistrict]);

  useEffect(() => {
    setCodeCity(codeCity);
    setCodeDistrict(codeDistrict);
  }, [codeCity, codeDistrict]);

  const columnsCurrent = useMemo(() => {
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
        dataField: 'timeStart',
        text: `${intl.formatMessage({ id: 'PREDICT.MASTER.TABLE.TIME_START' })}`,
        headerClasses: 'text-center',
        formatter: (value: any) => {
          return moment(value).format('DD.MM.YYYY');
        },
        align: 'center',
        sort: true,
      },
    //   {
    //     dataField: 'plantStage',
    //     text: `${intl.formatMessage({ id: 'PREDICT.MASTER.TABLE.PLANTING_STAGE' })}`,
    //     headerClasses: 'text-center',
    //     align: 'center',
    //   },
      {
        dataField: 'currentPestLevel',
        text: `${intl.formatMessage({ id: 'PREDICT.MASTER.TABLE.WARNING_LEVEL' })}`,
        headerClasses: 'text-center',
        formatter: (value: any) => {
          return value?.name ?? '';
        },
        align: 'center',
        sort: true,
      },
      {
        dataField: 'action',
        text: `${intl.formatMessage({ id: 'COMMON.MASTER.ACTION' })}`,
        formatter: ActionsColumnFormatter,
        formatExtraData: {
          intl,
        //     onFinish: (entity: any) => {
        //     if (entity.user != currentUser._id) {
        //         setShowNotify(true);
        //         return;
        //     }

        //     console.log('entity', entity);

        //     setDetailEntity(entity);
        //     setShowFinish(true);
        //     // setShowDetail(true);
        //   },
          onShowDetail: (entity: any) => {
            let entityDetail = entity;
            setDetailEntity(entity);
            entity.user &&
              GetUserById(entity.user).then((user: any) => {
                if (!user.data) return;
                entityDetail = {
                  ...entityDetail,
                  fullName: user.data.fullName,
                  email: user.data.email,
                };
                setDetailEntity({ ...entityDetail });
              });

            getPestLevelApi().then((result: any) => {
              const indexlastLevel = result.data.findIndex(
                (el: any) => el._id == entity.lastPestLevel,
              );
              if (!result.data) return;
              entityDetail = {
                ...entityDetail,
                lastPestLevel: result.data[indexlastLevel]?.name,
              };
              setDetailEntity({
                ...entityDetail,
              });
            });

            history.push(`${window.location.pathname}/${entity._id}/view`);
            // setShowDetail(true);
          },
          onEdit: (entity: any) => {
            if (entity.user != currentUser._id) {
                setShowNotify(true);
                return;
            }
              
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

            getPestLevelApi().then((result: any) => {
              const indexlastLevel = result.data.findIndex(
                (el: any) => el._id === entity.lastPestLevel,
              );
              if (!result.data) return;
              entityDetail = {
                ...entityDetail,
                lastPestLevel: result.data[indexlastLevel],
              };
              setEditEntity({
                ...entityDetail,
              });
            });

            // console.log('onEdit editEntity', editEntity);

            history.push(`${window.location.pathname}/${entity._id}/edit`);
          },
            onDelete: (entity: any) => {
            if (entity.user != currentUser._id) {
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

  const columnsFinished = useMemo(() => {
    return [
      {
        dataField: 'state',
        text: `${intl.formatMessage({ id: 'COMMON.MASTER.CITY' })}`,
        headerClasses: 'text-center',
        align: 'center',
      },
      {
        dataField: 'city',
        text: `${intl.formatMessage({ id: 'COMMON.MASTER.DISTRICT' })}`,
        headerClasses: 'text-center',
        align: 'center',
      },
      {
        dataField: 'district',
        text: `${intl.formatMessage({ id: 'COMMON.MASTER.WARD' })}`,
        headerClasses: 'text-center',
        align: 'center',
      },
      {
        dataField: 'timeStart',
        text: `${intl.formatMessage({ id: 'PREDICT.MASTER.TABLE.TIME_START' })}`,
        headerClasses: 'text-center',
        formatter: (value: any) => {
          return moment(value).format('DD.MM.YYYY');
        },
        align: 'center',
      },
      {
        dataField: 'plantStage',
        text: `${intl.formatMessage({ id: 'PREDICT.MASTER.TABLE.PLANTING_STAGE' })}`,
        headerClasses: 'text-center',
        align: 'center',
      },
      {
        dataField: 'currentPestLevel',
        text: `${intl.formatMessage({ id: 'PREDICT.MASTER.TABLE.WARNING_LEVEL' })}`,
        headerClasses: 'text-center',
        formatter: (value: any) => {
          return value?.name ?? '';
        },
        align: 'center',
      },
      {
        dataField: 'action',
        text: `${intl.formatMessage({ id: 'COMMON.MASTER.ACTION' })}`,
        formatter: ActionsColumnFormatter,
        formatExtraData: {
          intl,
          onShowDetail: (entity: any) => {
            let entityDetail = entity;
            setDetailEntity(entity);
            entity.user &&
              GetUserById(entity.user).then((user: any) => {
                if (!user.data) return;
                entityDetail = {
                  ...entityDetail,
                  fullName: user.data.fullName,
                  email: user.data.email,
                };
                setDetailEntity({ ...entityDetail });
              });

            getPestLevelApi().then((result: any) => {
              const indexlastLevel = result.data.findIndex(
                (el: any) => el._id === entity.lastPestLevel,
              );
              if (!result.data) return;
              entityDetail = {
                ...entityDetail,
                lastPestLevel: result.data[indexlastLevel].name,
              };
              setDetailEntity({
                ...entityDetail,
              });
            });

            history.push(`${window.location.pathname}/${entity._id}/view`);
            // setShowDetail(true);
          },
          onEdit: (entity: any) => {
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

            getPestLevelApi().then((result: any) => {
              const indexlastLevel = result.data.findIndex(
                (el: any) => el._id === entity.lastPestLevel,
              );
              if (!result.data) return;
              entityDetail = {
                ...entityDetail,
                lastPestLevel: result.data[indexlastLevel],
              };
              setEditEntity({
                ...entityDetail,
              });
            });

            // console.log('onEdit editEntity', editEntity);

            history.push(`${window.location.pathname}/${entity._id}/edit`);
          },
          onDelete: (entity: any) => {
            setDeleteEntity(entity);
            setShowDelete(true);
          },
        },
        ...NormalColumn,
        style: { minWidth: '130px' },
      },
    ];
  }, []);

  const tabData = useMemo(() => {
    return [
      {
        label: intl.formatMessage({ id: 'PREDICT.MASTER.TAB.IN_SEASON' }),
        tabTitle: intl.formatMessage({ id: 'PREDICT.MASTER.TAB.IN_SEASON' }),
        key: '0',
        isActive: true,
        entities: entities.filter(e => !e.isFinish),
        isShowId: true,
        columns: columnsCurrent,
        total: total,
        loading: loading,
        paginationParams: paginationProps,
        setPaginationParams: setPaginationProps,
        selectedEntities: handleSelectPredict,
        disabled: false,
        button: [
          {
            label: 'COMMON.MASTER.CREATE',
            onClick: () => onCreate(),
          },
        ],
      },
      {
        label: intl.formatMessage({ id: 'PREDICT.MASTER.TAB.SEASON_OVER' }),
        tabTitle: intl.formatMessage({ id: 'PREDICT.MASTER.TAB.SEASON_OVER' }),
        key: '1',
        isActive: false,
        isShowId: true,
        disabled: true,
        entities: entities.filter(e => e.isFinish),
        columns: columnsFinished,
        total: total,
        loading: loading,
        paginationParams: paginationProps,
        setPaginationParams: setPaginationProps,
        selectedEntities: handleSelectPredict,
        button: [],
      },
    ];
  }, [
    entities,
    columnsCurrent,
    columnsFinished,
    total,
    loading,
    paginationProps,
    setPaginationProps,
  ]);

  const onChangeValueCity = (city: any) => {
    city && setCodeCity(city.code);
    setCurrentState(city);
    setCurrentCity(undefined);
    setCurrentDistrict(undefined);
    setCodeDistrict(0);

    setIsChange(true);

    // setEditEntity({
    //   ...editEntity,
    //   state: city,
    //   city: undefined,
    //   district: undefined,
    // });
  };

  const onChangeValueDistrict = (district: any) => {
    district && setCodeDistrict(district.code);
    setCurrentCity(district);
    setCurrentDistrict(undefined);

    setIsChange(true);

    // setEditEntity({
    //   ...editEntity,
    //   city: district,
    //   district: undefined,
    // });
  };

  const onChangeValueWards = (ward: any) => {
    setCurrentDistrict(ward);
  };

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
      timeStart: {
        type: 'date-time-range',
        label: 'PREDICT.MASTER.TABLE.TIME_START',
        placeholder: 'PREDICT.MASTER.TABLE.TIME_START',
      },
      plantStage: {
        type: 'search-select',
        label: 'PREDICT.MASTER.TABLE.PLANTING_STAGE',
        placeholder: 'PREDICT.MASTER.TABLE.PLANTING_STAGE',
        onSearch: getPlantStageApi,
        keyField: 'name',
      },
      pestLevelId: {
        type: 'search-select',
        label: 'PREDICT.MASTER.TABLE.PEST_LEVEL',
        placeholder: 'PREDICT.MASTER.TABLE.PEST_LEVEL',
        onSearch: getPestLevelApi,
        keyField: 'name',
      },
    }),
    [currentTab, codeCity, codeDistrict, currentState, currentCity, currentDistrict],
  );

  // CREATE PREDICT
  const [createGroup1, setCreateGroup1] = useState<ModifyInputGroup | any>({
    _subTitle: 'PREDICT.MASTER.TAB.INFOMATION_AREA',
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
      onChange: (value: any) => onChangeValueWards(value),
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

  const [createGroup2, setCreateGroup2] = useState<ModifyInputGroup | any>({
    _subTitle: 'PREDICT.MASTER.TAB.PREV_INFOMATION',
    _className: 'px-4',
    _styleName: {
      gridArea: '1 / 2 / auto / auto',
    },
    lastTimeEnd: {
      _type: 'date-time',
      label: 'REPORT.MASTER.TABLE.TIME_END',
      placeholder: 'REPORT.MASTER.TABLE.TIME_END',
      disabledDate: (current: any) => {
        return moment().add(-1, 'days') <= current;
      },
    },
    lastPestLevel: {
      _type: 'search-select',
      label: 'PREDICT.MASTER.TABLE.WARNING_LEVEL',
      placeholder: 'PREDICT.MASTER.TABLE.WARNING_LEVEL',
      onSearch: getPestLevelApi,
      keyField: 'name',
    },
  });

  const [createGroup3, setCreateGroup3] = useState<ModifyInputGroup | any>({
    _subTitle: 'PREDICT.MASTER.TAB.CURRENT_INFOMATION',
    _className: 'px-4',
    _styleName: {
      gridArea: '2 / 2 / auto / auto',
    },
    timeStart: {
      _type: 'date-time',
      label: 'PREDICT.MASTER.TABLE.TIME_START',
      placeholder: 'PREDICT.MASTER.TABLE.TIME_START',
      disabledDate: (current: any) => {
        return moment().add(-1, 'days') <= current;
      },
      required: true,
    },
  });

  // EDIT PREDICT
  const [editGroup1, setEditGroup1] = useState<ModifyInputGroup | any>({
    _subTitle: 'PREDICT.MASTER.TAB.INFOMATION_AREA',
    _className: 'px-4',
    _styleName: {
      gridArea: '1 / 1 / span 2 / auto',
    },
    state: {
      _type: 'search-select',
      label: 'COMMON.MASTER.CITY',
      placeholder: 'COMMON.MASTER.CITY',
      onSearch: GetProvince,
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
    _subTitle: 'PREDICT.MASTER.TAB.PREV_INFOMATION',
    _className: 'px-4',
    _styleName: {
      gridArea: '1 / 2 / auto / auto',
    },
    lastTimeEnd: {
      _type: 'date-time',
      label: 'REPORT.MASTER.TABLE.TIME_END',
      placeholder: 'REPORT.MASTER.TABLE.TIME_END',
      disabledDate: (current: any) => {
        return moment().add(-1, 'days') <= current;
      },
    },
    lastPestLevel: {
      _type: 'search-select',
      label: 'PREDICT.MASTER.TABLE.WARNING_LEVEL',
      placeholder: 'PREDICT.MASTER.TABLE.WARNING_LEVEL',
      onSearch: getPestLevelApi,
      keyField: 'name',
    },
  });

  const [editGroup3, setEditGroup3] = useState<ModifyInputGroup | any>({
    _subTitle: 'PREDICT.MASTER.TAB.CURRENT_INFOMATION',
    _className: 'px-4',
    _styleName: {
      gridArea: '2 / 2 / auto / auto',
    },
    timeStart: {
      _type: 'date-time',
      label: 'PREDICT.MASTER.TABLE.TIME_START',
      placeholder: 'PREDICT.MASTER.TABLE.TIME_START',
      disabledDate: (current: any) => {
        return moment().add(-1, 'days') <= current;
      },
      required: true,
    },
  });

  // VIEW INFORMATION TAB 1
  const [viewGroup11, setViewGroup11] = useState<ModifyInputGroup | any>({
    _subTitle: 'PREDICT.MASTER.TAB.INFOMATION_AREA',
    _styleName: {
      gridArea: '1 / 1 / span 2 / auto',
    },
    _className: 'px-4',
    state: {
      _type: 'string',
      disabled: true,
      label: 'COMMON.MASTER.CITY',
      required: true,
      placeholder: 'COMMON.MASTER.CITY',
    },
    city: {
      _type: 'string',
      label: 'COMMON.MASTER.DISTRICT',
      placeholder: 'COMMON.MASTER.DISTRICT',
      disabled: true,
      required: true,
    },
    district: {
      _type: 'string',
      label: 'COMMON.MASTER.WARD',
      placeholder: 'COMMON.MASTER.WARD',
      disabled: true,
      required: true,
    },
    address: {
      _type: 'string',
      label: 'COMMON.MASTER.ADDRESS',
      placeholder: 'COMMON.MASTER.ADDRESS',
      disabled: true,
    },
  });

  const [viewGroup12, setViewGroup12] = useState<ModifyInputGroup | any>({
    _subTitle: 'PREDICT.MASTER.TAB.PREV_INFOMATION',
    _styleName: {
      gridArea: '1 / 2 / auto / auto',
    },
    _className: 'px-4',
    lastTimeEnd: {
      _type: 'string',
      label: 'REPORT.MASTER.TABLE.TIME_END',
      placeholder: 'REPORT.MASTER.TABLE.TIME_END',
      formatter: (value: any) => {
        return moment(value).format('DD.MM.YYYY');
      },
      disabled: true,
    },
    lastPestLevel: {
      _type: 'string',
      label: 'PREDICT.MASTER.TABLE.WARNING_LEVEL',
      disabled: true,
      placeholder: 'PREDICT.MASTER.TABLE.WARNING_LEVEL',
    },
  });

  const [viewGroup13, setViewGroup13] = useState<ModifyInputGroup | any>({
    _subTitle: 'PREDICT.MASTER.TAB.CURRENT_INFOMATION',
    _styleName: {
      gridArea: '2 / 2 / auto / auto',
    },
    _className: 'px-4',
    timeStart: {
      _type: 'string',
      disabled: true,
      label: 'PREDICT.MASTER.TABLE.TIME_START',
      placeholder: 'PREDICT.MASTER.TABLE.TIME_START',
      formatter: (value: any) => {
        return moment(value).format('DD.MM.YYYY');
      },
    },
  });

  // VIEW INFORMATION TAB 2
  const [viewGroup21, setViewGroup21] = useState<ModifyInputGroup | any>({
    _subTitle: 'PREDICT.MASTER.TAB.PREDICT_CURRENT',
    _styleName: {
      gridArea: '1 / 1 / 1 / 1',
    },
      _className: 'px-4',
      currentPestLevel: {
        _type: 'string',
        disabled: true,
        label: 'PREDICT.MASTER.TABLE.WARNING_LEVEL',
        placeholder: 'PREDICT.MASTER.TABLE.WARNING_LEVEL',
        formatter: (value: any) => {
          return value?.name ?? '';
        },
      },
    pestStage: {
      _type: 'string',
      disabled: true,
      label: 'PREDICT.MASTER.TABLE.PEST_LEVEL',
      placeholder: 'PREDICT.MASTER.TABLE.PEST_LEVEL',
    },
    plantStage: {
      _type: 'string',
      label: 'PREDICT.MASTER.TABLE.PLANTING_STAGE',
      placeholder: 'PREDICT.MASTER.TABLE.PLANTING_STAGE',
      disabled: true,
    },
  });

//   const [viewGroup22, setViewGroup22] = useState<ModifyInputGroup | any>({
//     _subTitle: 'PREDICT.MASTER.TAB.PREDICT_NEXT_7',
//     _styleName: {
//       gridArea: '2 / 1 / auto / auto',
//     },
//     _className: 'px-4',
//     oneWeekForecastWarning: {
//         _type: 'string',
//         disabled: true,
//         label: 'PREDICT.MASTER.TABLE.WARNING_LEVEL',
//         placeholder: 'PREDICT.MASTER.TABLE.WARNING_LEVEL',
//         formatter: (value: any) => {
//           return value?.name ?? '';
//         },
//       },
//     oneWeekForecastPest: {
//       _type: 'number',
//       disabled: true,
//       label: 'PREDICT.MASTER.TABLE.PEST_LEVEL',
//       placeholder: 'PREDICT.MASTER.TABLE.PEST_LEVEL',
//     },
//     oneWeekForecastPlant: {
//       _type: 'string',
//       label: 'PREDICT.MASTER.TABLE.PLANTING_STAGE',
//       placeholder: 'PREDICT.MASTER.TABLE.PLANTING_STAGE',
//       disabled: true,
//     },
//   });

//   const [viewGroup23, setViewGroup23] = useState<ModifyInputGroup | any>({
//     _subTitle: 'PREDICT.MASTER.TAB.PREDICT_ENV_DATA',
//     _styleName: {
//       gridArea: '1 / 2 / auto / auto',
//     },
//     _className: 'px-4',
//     temperature: {
//       _type: 'string',
//       disabled: true,
//       label: 'PREDICT.MASTER.ENV.TEMPERATURE',
//       placeholder: 'PREDICT.MASTER.ENV.TEMPERATURE',
//     },
//     humidity: {
//       _type: 'string',
//       disabled: true,
//       label: 'PREDICT.MASTER.ENV.HUMIDITY',
//       placeholder: 'PREDICT.MASTER.ENV.HUMIDITY',
//     },
//     rainfall: {
//       _type: 'string',
//       disabled: true,
//       label: 'PREDICT.MASTER.ENV.RAINFALL',
//       placeholder: 'PREDICT.MASTER.ENV.RAINFALL',
//     },
//   });

//   const [viewGroup24, setViewGroup24] = useState<ModifyInputGroup | any>({
//     _subTitle: 'PREDICT.MASTER.TAB.END_DATE_EXPECTED',
//     _styleName: {
//       gridArea: '2 / 2 / auto / auto',
//     },
//     _className: 'px-4',
//     timeEnd: {
//       _type: 'string',
//       disabled: true,
//       label: 'PREDICT.MASTER.LABEL.END_DATE_EXPECTED',
//       placeholder: 'PREDICT.MASTER.LABEL.END_DATE_EXPECTED',
//       formatter: (value: any) => {
//         return moment(value).format('DD.MM.YYYY');
//       },
//     },
//   });
    
  const [viewGroup22, setViewGroup22] = useState<ModifyInputGroup | any>({
    _subTitle: 'PREDICT.MASTER.TAB.END_DATE_EXPECTED',
    _styleName: {
      gridArea: '1 / 2 / auto / auto',
    },
    _className: 'px-4',
    timeEnd: {
      _type: 'string',
      disabled: true,
      label: 'PREDICT.MASTER.LABEL.END_DATE_EXPECTED',
      placeholder: 'PREDICT.MASTER.LABEL.END_DATE_EXPECTED',
      formatter: (value: any) => {
        return moment(value).format('DD.MM.YYYY');
      },
    },
  });
    
  // VIEW INFORMATION TAB 3
  const [viewGroup31, setViewGroup31] = useState<ModifyInputGroup | any>({
    _subTitle: 'PREDICT.MASTER.TAB.PREDICT_DATA',
    _styleName: {
      gridArea: '1 / 1 / auto / auto',
    },
    _className: 'px-4',
    warningForecast: {
      _type: 'custom',
      component: (value: any) => {
          return (<WarningForecast data={value?.values?.warningForecast} />)    
      },
    }
  });

  // VIEW INFORMATION TAB 4
  const [viewGroup41, setViewGroup41] = useState<ModifyInputGroup | any>({
    _subTitle: 'PREDICT.MASTER.TAB.INFOMATION_CREATER',
    _className: 'px-4 col-6',
    fullName: {
      _type: 'string',
      disabled: true,
      label: 'PREDICT.MASTER.TABLE.USERNAME',
      placeholder: 'PREDICT.MASTER.TABLE.USERNAME',
    },
    email: {
      _type: 'string',
      disabled: true,
      label: 'PREDICT.MASTER.TABLE.EMAIL',
      placeholder: 'PREDICT.MASTER.TABLE.EMAIL',
    },
    createdAt: {
      _type: 'string',
      disabled: true,
      label: 'PREDICT.MASTER.TABLE.TIME_CREATE',
      placeholder: 'PREDICT.MASTER.TABLE.TIME_CREATE',
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

  const viewForm1 = useMemo(
    (): ModifyForm => ({
      _header: viewInfoTitle,
      panel1: {
        _title: '',
        group1: viewGroup11,
        group2: viewGroup12,
        group3: viewGroup13,
      },
    }),
    [viewGroup11, viewGroup12, viewGroup13],
  );

  const viewForm2 = useMemo(
    (): ModifyForm => ({
      _header: '',
      panel1: {
        _title: '',
        group1: viewGroup21,
        group2: viewGroup22,
        // group3: viewGroup23,
        // group4: viewGroup24,
      },
    }),
    [viewGroup21, viewGroup22],
  );
    
  const viewForm3 = useMemo(
    (): ModifyForm => ({
      _header: '',
      panel1: {
        _title: '',
        group1: viewGroup31,
      },
    }),
    [viewGroup31],
  );

  const viewForm4 = useMemo(
    (): ModifyForm => ({
      _header: '',
      panel1: {
        _title: '',
        group1: viewGroup41,
      },
    }),
    [viewGroup41],
  );

  const actions: any = useMemo(
    () => ({
      type: 'inside',
      data: {
        save: {
          role: 'submit',
          type: 'submit',
          linkto: HomePageURL.predict,
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
          linkto: HomePageURL.predict,
          className: 'btn btn-outline-primary fixed-btn-width',
          label: 'COMMON.BTN_CANCEL',
          icon: <CancelOutlinedIcon />,
        },
      },
    }),
    [loading],
  );

  const onCreate = () => {
    setCurrentState(undefined);
    setCurrentCity(undefined);
    setCurrentDistrict(undefined);
    history.push(`${window.location.pathname}/0000000`);
  };

  const handleSelectPredict = (report: any) => {
    console.log('report', report);
  };

    // console.log(currentState, currentCity, currentDistrict);
    
  return (
    <Fragment>
      <Switch>
        {/* CREATE FORM */}
        <Route path={`${HomePageURL.predict}/0000000`}>
          <EntityCrudPage
            moduleName={'MODULE.NAME'}
            mode={'horizontal'}
            onModify={add}
            formModel={createForm}
            entity={createEntity}
            actions={actions}
            homePageUrl={HomePageURL.predict}
          />
        </Route>

        {/* EDIT FORM */}
        <Route path={`${HomePageURL.predict}/:code/edit`}>
          {({ match }) => (
            <EntityCrudPage
              onModify={update}
              mode={'horizontal'}
              entity={{
                ...editEntity,
                state: isChange ? currentState : editEntity.state,
                city: isChange ? currentCity : editEntity.city,
                district: isChange ? currentDistrict : editEntity.district,
              }}
              setEditEntity={setEditEntity}
              moduleName={'MODULE.NAME'}
              get={GetById}
              formModel={updateForm}
              actions={actions}
              homePageUrl={HomePageURL.predict}
            />
          )}
        </Route>

        {/* VIEW INFORMATION */}
        <Route path={`${HomePageURL.predict}/:code/view`}>
          {({ match }) => (
            <div>
              <EntityCrudPage
                isEdit={false}
                entity={detailEntity}
                setEditEntity={setDetailEntity}
                mode={'vertical'}
                moduleName={'MODULE.NAME'}
                formModel={viewForm1}
                homePageUrl={HomePageURL.report}
              />
              <EntityCrudPage
                isEdit={false}
                entity={detailEntity}
                setEditEntity={setDetailEntity}
                mode={'horizontal'}
                isBackHome={false}
                moduleName={'MODULE.NAME'}
                formModel={viewForm2}
                homePageUrl={HomePageURL.report}
              />
              <EntityCrudPage
                isEdit={false}
                entity={detailEntity}
                setEditEntity={setDetailEntity}
                mode={'horizontal'}
                isBackHome={false}
                moduleName={'MODULE.NAME'}
                formModel={viewForm3}
                homePageUrl={HomePageURL.report}
              />
              <EntityCrudPage
                isEdit={false}
                entity={detailEntity}
                setEditEntity={setDetailEntity}
                mode={'horizontal'}
                isBackHome={false}
                moduleName={'MODULE.NAME'}
                formModel={viewForm4}
                homePageUrl={HomePageURL.report}
              />          
            </div>
          )}
        </Route>

        {/* HOME */}
        <Route path={`${HomePageURL.predict}`} exact={true}>
          <MasterHeader
            title={headerTitle}
            onSearch={value => {
              setPaginationProps(DefaultPagination);
              setFilterProps({
                ...value,
                city: value?.city?.name_with_type,
                district: value?.district?.name_with_type,
                state: value?.state?.name_with_type,
                timeStart: value?.timeStart,
                pestLevelId: value?.pestLevelId?._id,
                plantStage: value?.plantStage?.name,
              });
            }}
            searchModel={searchModel}
          />
          <div className="activity-body">
            <PredictBody
              title="PREDICT.MASTER.TABLE.TITLE"
              tabData={tabData}
              currentTab={currentTab}
              setCurrentTab={() => {}}
              setEntities={() => {}}
              setTrigger={value => {
                console.log('value', value);
              }}
              trigger={true}
            />
          </div>
        </Route>
      </Switch>
          
      <NotifyDialog
        isShow={showNotify}
        onHide={() => {
          setShowNotify(false);
        }}      
        title={'PREDICT.NOTIFY.TITLE.PERMISSION_DENIED'}
        notifyMessage={'PREDICT.NOTIFY.MESSAGE.PERMISSION_DENIED'}      
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
        deletingMessage={' '}
        title={'PREDICT.DELETE.TITLE'}
        confirmMessage={'PREDICT.DELETE.DELETE_MSG'}
        bodyTitle={'PREDICT.DELETE.BODY_MSG'}
        deleteBtn={'COMMON.BTN_DELETE'}
        cancelBtn={'COMMON.BTN_CANCEL'}
      />

      <DeleteEntityDialog
        entity={confirmEntity}
        onDelete={(entity: any) => {
          console.log('detailEntity', detailEntity);
          EndPredict(detailEntity).then((result: any) => {
            if (!result.data) setShowFinish(false);
            else {
              getAll();
              setShowFinish(false);
            }
          });
        }}
        isShow={showFinish}
        loading={loading}
        error={error}
        onHide={() => {
          setShowFinish(false);
        }}
        deletingMessage={' '}
        title={'PREDICT.FINISH.TITLE'}
        confirmMessage={'PREDICT.FINISH.DELETE_MSG'}
        bodyTitle={'PREDICT.FINISH.BODY_MSG'}
        deleteBtn={'COMMON.BTN_CONFIRM'}
        cancelBtn={'COMMON.BTN_CANCEL'}
      />
    </Fragment>
  );
}

export default Predict;
