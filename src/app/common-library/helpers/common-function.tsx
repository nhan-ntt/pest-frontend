import _, { isArray, isEmpty } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { DefaultPagination } from '../common-consts/const';
import {
  CountProps,
  CreateProps,
  DeleteManyProps,
  DeleteProps,
  GetAllPropsServer,
  GetProps,
  ModifyForm,
  UpdateProps,
} from '../common-types/common-type';
import { diff } from 'deep-object-diff';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useIntl } from 'react-intl';
import { getFieldV3 } from '../common-components/master-detail-page';

export const CapitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const GetCompareFunction = ({ key, orderType }: { key: string; orderType: 1 | -1 }) => {
  return (a: any, b: any) => {
    const _a = key && key != '' ? getFieldV3(a, key)[0] : a;
    const _b = key && key != '' ? getFieldV3(b, key)[0] : b;
    if (_a === undefined) return -1 * orderType;
    if (_b === undefined) return 1 * orderType;
    if (_a < _b) {
      return -1 * orderType;
    }
    if (_a > _b) {
      return 1 * orderType;
    }
    return 0;
  };
};

export const RoleArrayToObject = (arr: string[]) => {
  const scopes: any = {};
  arr.forEach((item: string) => {
    const key = item.split('.')[0];
    if (!scopes[key]) scopes[key] = [];
    scopes[key].push(item);
  });
  return scopes;
};
export const RoleObjectToArray = (scopes?: any) => {
  return scopes
    ? Object.values(scopes).reduce((pre: any, cur: any) => {
        pre.push(...cur);
        return pre;
      }, [])
    : [];
};

const _initValues = ({ inputs }: any): any => {
  return Object.keys(inputs).reduce((pre, key, k, o) => {
    const input = inputs[key];
    if (_.isString(input))
      throw new Error('Sử dụng sai cách ' + key + '\n' + JSON.stringify(inputs));
    const name = key;
    switch (input._type) {
      case 'string':
      case 'email':
      case 'string-number':
      case 'number':
      case 'date-time':
      case 'date-time-range':
      case 'radio':
      case 'boolean':
      case 'image':
      case 'tag':
      case 'checkbox':
      case 'custom':
        if (input.required) {
          return { ...pre, [name]: '' };
        }
        return pre;
      case 'search-select':
      case 'tree-select':
        if (input.required) {
          return { ...pre, [name]: '' };
        }
        return pre;
      case 'object':
        const { _type, _subTitle, _className, _inputClassName, ...innt } = input as any;
        const s =
          name === '' ? _initValues({ inputs: innt }) : { [name]: _initValues({ inputs: innt }) };
        return _.merge(pre, s);
    }
  }, {} as any);
};
export const InitValues = (formModel: ModifyForm) => {
  const result = {};
  const { _header, ...modifyPanels } = formModel;
  Object.keys(modifyPanels).map((key, index, keys) => {
    const val = modifyPanels[key];
    if (_.isString(val))
      throw new Error('Sử dụng sai cách ' + key + '\n' + JSON.stringify(modifyPanels));
    const { _title, ...panel } = val;
    const { _subTitle, ...pl } = panel;
    pl &&
      Object.values(pl).map((inputGroup, index) => {
        if (_.isString(inputGroup))
          throw new Error('Sử dụng sai cách ' + inputGroup + '\n' + JSON.stringify(pl));
        const { _subTitle, _className, _styleName, _inputClassName, ...inputs } = inputGroup;
        _.merge(result, _initValues({ inputs }));
      });
  });
  return result;
};

export const GetFieldCSSClasses = (touched: any, errors: any) => {
  const classes = ['form-control'];

  if (touched && errors) classes.push('is-invalid');

  if (touched && !errors) classes.push('');

  return classes.join(' ');
};

export const GetClassName = (labelWidth: number | null | undefined, labelStart: boolean) => {
  const classes: string[] = [];

  if (labelStart) {
    if (labelWidth == 0) classes.push('hidden');
    if (labelWidth != null) {
      classes.push(`col-xl-${labelWidth}`);
      classes.push(`col-md-${labelWidth}`);
      classes.push('col-12');
    } else {
      classes.push(`col-xl-4`);
      classes.push(`col-md-4`);
      classes.push('col-12');
    }
  } else {
    if (labelWidth != null) {
      if (labelWidth == 12) classes.push('hidden');
      classes.push(`col-xl-${12 - labelWidth}`);
      classes.push(`col-md-${12 - labelWidth}`);
      classes.push('col-12');
    } else {
      classes.push(`col-xl-8`);
      classes.push(`col-md-8`);
      classes.push('col-12');
    }
  }

  return classes.join(' ');
};

export const deCapitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toLowerCase() + string.slice(1);
};

export const removeVietnameseTones = (str: string) => {
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
  str = str.replace(/đ/g, 'd');
  str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, 'A');
  str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, 'E');
  str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, 'I');
  str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'O');
  str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U');
  str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, 'Y');
  str = str.replace(/Đ/g, 'D');
  // Some system encode vietnamese combining accent as individual utf-8 characters
  // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ''); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
  str = str.replace(/\u02C6|\u0306|\u031B/g, ''); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
  // Remove extra spaces
  // Bỏ các khoảng trắng liền nhau
  str = str.replace(/ + /g, ' ');
  str = str.trim();
  // Remove punctuations
  // Bỏ dấu câu, kí tự đặc biệt
  str = str.replace(
    /!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g,
    ' ',
  );
  return str;
};

export const stringNomalize = (text: string, nonSpace = false) => {
  if (!text) return '';
  let returnText = '';
  returnText = text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  returnText = returnText.replace(/đ/g, 'd');
  if (nonSpace) returnText = returnText.replace(/[ ]/g, '_');
  return returnText;
};

export const generateInitForm = (modifyModel: any, initField?: string, initData?: string) => {
  const initValue = {} as any;

  Object.keys(modifyModel).map(key => {
    if (modifyModel[key].type === 'string') {
      initValue[key] = '';
    } else if (modifyModel[key].type === 'number') {
      initValue[key] = undefined;
    } else if (modifyModel[key].type === 'SearchSelect') {
      initValue[key] = null;
    } else if (modifyModel[key].type === 'Datetime') {
      initValue[key] = null;
    } else if (modifyModel[key].type === 'image') {
      initValue[key] = [];
    } else if (modifyModel[key].type === 'boolean') {
      initValue[key] = true;
    } else if (modifyModel[key].type === 'radioGroup') {
      initValue[key] = [];
    } else if (modifyModel[key].type === 'display') {
      initValue[key] = '';
    } else if (modifyModel[key].type === 'stateSelect') {
      initValue[key] = '';
    } else if (modifyModel[key].type === 'citySelect') {
      initValue[key] = '';
    } else if (modifyModel[key].type === 'districtSelect') {
      initValue[key] = '';
    } else if (modifyModel[key].type === 'option') {
      key === 'gender' ? (initValue[key] = '1') : (initValue[key] = '0'); // male gender
    }
    // else {
    //   initValue[key] = '';
    else if (modifyModel[key].type === 'object') {
      // initValue[key] = {}
      initValue[key] = generateInitForm(modifyModel[key].data);
      // console.log(generateInitForm(modifyModel[key].data))
      // Object.keys(modifyModel[key]).map(childKey => {
      //   if (modifyModel[key][childKey].type === 'string') {
      //     initValue[key][childKey] = ''
      //   } else if (modifyModel[key][childKey].type === 'number') {
      //     initValue[key][childKey] = undefined
      //   }
      // })
    }
  });

  if (initField && initData) {
    initValue[initField] = initData;
  }

  return initValue;
};

export const getOnlyFile = (arr: any[]) => {
  const fileArray: any[] = [];

  arr.forEach(values => {
    fileArray.push(values.file);
  });

  return fileArray;
};

export const getOnlyBase64 = (arr: any[]) => {
  const base64Array: any[] = [];

  arr.forEach(values => {
    base64Array.push(values.data_url);
  });

  return base64Array;
};

export const getNewImage = (prevArr: any[], currentArr: any[]) => {
  const newArr: any[] = [];
  prevArr = prevArr ?? [];
  if (prevArr.length === 0) {
    return currentArr;
  }

  currentArr.forEach((curEl: any) => {
    const index = prevArr.findIndex(prevEl => isEmpty(diff(curEl, prevEl)));

    if (index === -1) {
      newArr.push(curEl);
    }
  });

  return newArr;
};

export const getNewFile = (prevArr: any[], currentArr: any[]) => {
  console.log(prevArr);
  const newArr: any[] = [];
  prevArr = prevArr ?? [];
  if (prevArr.length === 0) {
    return currentArr;
  }

  currentArr.forEach((curEl: any) => {
    const index = prevArr.findIndex(prevEl => isEmpty(diff(curEl, prevEl)));

    if (index === -1) {
      newArr.push(curEl);
    }
  });

  return newArr;
};

export const GenerateAllFormField = (...params: any) => {
  let fieldForm: any = {};

  params.forEach((value: any) => {
    if (isArray(value)) {
      // fieldForm = {...fieldForm, ...Object.assign({}, ...value)}
      value.forEach((item: any) => {
        fieldForm = { ...fieldForm, ...item.data };
      });
    }
  });

  return fieldForm;
};

export const GetHomePage = (url: string) => {
  const index = url.lastIndexOf('/');

  if (index === -1) return window.location.pathname;

  const homeURL: string = url.slice(0, index);

  return homeURL;
};

export const getField = (field: any, fieldName: string) => {
  if (fieldName.indexOf('.') === -1) {
    return field[fieldName];
  }

  const arrName = fieldName.split('.');

  if (!field[arrName[0]]) return;

  let fields: any = field[arrName[0]];

  arrName.forEach((el: string, key: number) => {
    if (key > 0) {
      if (fields[el]) {
        fields = fields[el];
      }
    }
  });

  return fields;
};

export const getFieldV2 = (field: any, fieldName: string[]) => {
  if (!field[fieldName[0]]) return;

  let fields: any = field[fieldName[0]];

  fieldName.forEach((el: string, key: number) => {
    if (key > 0) {
      if (fields[el]) {
        fields = fields[el];
      }
    }
  });

  return fields;
};
export const ToDataURL = (url: string) =>
  fetch(url)
    .then(response => response.blob())
    .then(
      blob =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        }),
    );
export const ConvertStatusToBoolean = (data: any) => {
  return data.status && typeof data.status === 'string'
    ? { ...data, status: data.status === '1' ? 'true' : 'false' }
    : data;
};

export const ConvertStatusToString = (data: any) => {
  return typeof data.status === 'boolean' || typeof data.status === 'string'
    ? {
        ...data,
        status: data.status === true || data.status === 'true' ? '1' : '0',
      }
    : data;
};

export const notifyError = (error: string) => {
  toast.error(error, {
    position: 'top-right',
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};

export const notifySuccess = (message: string) => {
  toast.success(message, {
    position: 'top-right',
    autoClose: 2000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};

export function InitMasterProps<T>({
  getAllServer,
  countServer,
  getServer,
  createServer,
  updateServer,
  deleteServer,
  deleteManyServer,
}: {
  getAllServer: GetAllPropsServer<T>;
  getServer?: GetProps<T>;
  countServer?: CountProps<T>;
  createServer: CreateProps<T>;
  updateServer: UpdateProps<T>;
  deleteServer: DeleteProps<T>;
  deleteManyServer: DeleteManyProps<T>;
}) {
  const intl = useIntl();
  const [entities, setEntities] = useState<T[]>([]);
  const [deleteEntity, setDeleteEntity] = useState<T>(null as any);
  const [confirmEntity, setConfirmEntity] = useState<T>(null as any);
  const [editEntity, setEditEntity] = useState<T | null>({} as any);
  const [createEntity, setCreateEntity] = useState<T | null>({} as any);
  const [selectedEntities, setSelectedEntities] = useState<T[]>([]);
  const [detailEntity, setDetailEntity] = useState<T>(null as any);
  const [showDelete, setShowDelete] = useState(false);
  const [showFinish, setShowFinish] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [showDeleteMany, setShowDeleteMany] = useState(false);
  const [paginationProps, setPaginationProps] = useState(DefaultPagination);
  const [filterProps, setFilterProps] = useState({});
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [error, setError] = useState({ error: '' });

  const notifyError = useCallback((error: string) => {
    const getError = (error: string): string | { message: string; additional: string }[] => {
      try {
        return JSON.parse(error);
      } catch (e) {
        return error;
      }
    };
    const _innerError = getError(error);

    toast.error(
      _.isString(_innerError) ? (
        intl.formatMessage(
          { id: _innerError ?? 'COMMON_COMPONENT.TOAST.DEFAULT_ERROR' },
          { additional: '' },
        )
      ) : (
        <span>
          {_innerError.map((e, index) => (
            <span key={`abc${index}`} style={{ display: 'block' }}>
              {intl.formatMessage({ id: e.message }, e)}
            </span>
          ))}
        </span>
      ),
      {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      },
    );
  }, []);
  const notifySuccess = useCallback((message?: string) => {
    toast.success(intl.formatMessage({ id: message ?? 'COMMON_COMPONENT.TOAST.DEFAULT_SUCCESS' }), {
      position: 'top-right',
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  }, []);
  useEffect(() => {
    setError({ error: '' });
  }, [showDetail, showDeleteMany, showDelete, showFinish]);

  useEffect(() => {
    setEditEntity(editEntity);
  }, [editEntity]);

  useEffect(() => {
    setSelectedEntities(
      selectedEntities.filter((t: any) => entities.some((e: any) => e._id === t._id)),
    );
  }, [entities]);

  const dispatch = useDispatch();
  useEffect(() => {
    if (error.error !== '') {
      notifyError(error.error);
    }
  }, [error]);
  const getAll = useCallback(
    (filterProps?) => {
      setLoading(true);
      return getAllServer({ paginationProps, queryProps: filterProps })
        .then(getAllResponse => {
          // countServer(filterProps).then(countResponse => {
          //   setEntities(getAllResponse.data);
          //   setLoading(false);
          //   setTotal(countResponse.data);
          // });
          const data: any = getAllResponse.data;
          setTotal(data?.total ?? 5);
          setEntities(data?.data ?? data ?? []);

          setLoading(false);
          setSpinning(false);
          // notifySuccess();
        })
        .catch(error => {
          setError({ error: error.message || error.response.data || JSON.stringify(error) });
          setSpinning(false);
          setLoading(false);
          throw error;
        });
    },
    [getAllServer, paginationProps],
  );

  const refreshData = useCallback(() => {
    // setPaginationProps({ ...paginationProps, page: 1 });
    setShowDelete(false);
    setShowFinish(false);
    setShowDetail(false);
    setShowEdit(false);
    setShowDeleteMany(false);
    setShowCreate(false);
    setSelectedEntities([]);
    setLoading(false);
    setSpinning(false);
    setFilterProps({});
    setError({ error: '' });
  }, []);

  const deleteFn = useCallback((entity: T) => {
    setLoading(true);
    return deleteServer(entity)
      .then(e => {
        refreshData();
        notifySuccess('COMMON_COMPONENT.TOAST.DELETE_SUCCESS');
        return e;
      })
      .catch(error => {
        setError({ error: error.message || error.response.data || JSON.stringify(error) });
        setLoading(false);
        throw error;
      });
  }, []);

  const deleteMany = useCallback((entities?: T[]) => {
    setLoading(true);
    return deleteManyServer(entities ?? selectedEntities)
      .then(e => {
        refreshData();
        notifySuccess('COMMON_COMPONENT.TOAST.DELETE_SUCCESS');
        return e;
      })
      .catch(error => {
        console.log(error);
        setError({ error: error.message || error.response.data || JSON.stringify(error) });
        setLoading(false);
        throw error;
      });
  }, []);

  const get = useCallback((entity: T) => {
    if (!getServer) return;
    return getServer(entity)
      .then(res => {
        setDetailEntity(res.data);
        setEditEntity(res.data);
        // notifySuccess('COMMON_COMPONENT.TOAST.GET_SUCCESS');
        return res;
      })
      .catch(error => {
        setError({ error: error.message || error.response.data || JSON.stringify(error) });
        throw error;
      });
  }, []);
  const update = useCallback((entity: T) => {
    setLoading(true);
    return updateServer(entity)
      .then((e: any) => {
        if (!e.success) {
          setError({ error: e.reason });
          throw error;
          // return;
        }
        refreshData();
        notifySuccess('COMMON_COMPONENT.TOAST.UPDATE_SUCCESS');
        return e;
      })
      .catch(error => {
        setError({ error: error.message || error.response.data || JSON.stringify(error) });
        throw error;
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const add = useCallback((entity: T) => {
    setLoading(true);
    return createServer(entity)
      .then((e: any) => {
        if (!e.success) {
          setError({ error: e.reason });
          throw error;
          // return;
        }

        refreshData();
        notifySuccess('COMMON_COMPONENT.TOAST.ADD_SUCCESS');
        return e;
      })
      .catch(error => {
        setError({ error: error.message || error.response.data || JSON.stringify(error) });
        throw error;
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const formatLongString = useCallback(
    (string: string, firstLength: number = 500, lastLength: number = 0) => {
      if (!string) return '';
      if (string.length < firstLength) return string;
      if (firstLength + lastLength >= string.length) return string;
      return `${string.substr(0, firstLength)}...${string.substr(
        string.length - lastLength,
        string.length,
      )}`;
    },
    [],
  );

  return {
    entities,
    setEntities,
    deleteEntity,
    setDeleteEntity,
    editEntity,
    setEditEntity,
    createEntity,
    setCreateEntity,
    selectedEntities,
    setSelectedEntities,
    detailEntity,
    setDetailEntity,
    showDelete,
    setShowDelete,
    showEdit,
    setShowEdit,
    showCreate,
    setShowCreate,
    showDetail,
    setShowDetail,
    showDeleteMany,
    setShowDeleteMany,
    paginationProps,
    setPaginationProps,
    filterProps,
    setFilterProps,
    total,
    setTotal,
    loading,
    setLoading,
    error,
    setError,
    add,
    update,
    get,
    intl,
    spinning,
    setSpinning,
    deleteMany,
    deleteFn,
    getAll,
    refreshData,
    notifySuccess,
    notifyError,
    formatLongString,
    confirmEntity,
    setConfirmEntity,
    showFinish,
    setShowFinish,
  };
}
