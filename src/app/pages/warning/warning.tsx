import { useEffect, useState, Fragment } from 'react';
import { Card, CardHeader, CardBody } from '../../common-library/card';
import { useIntl } from 'react-intl';
import { getWarningLevelApi, updateWarningURLApi } from './warning.service';
import { notifySuccess, notifyError } from '../../common-library/helpers/common-function';

function WarningPage() {
    const intl = useIntl();

    const [data, setData] = useState<any>(null);
    const [urlDisabled, setUrlDisabled] = useState<boolean>(true);

    useEffect(() => {
        async function fetchData() {
            const response = await getWarningLevelApi();
            const data_res = await response.data;

            setData(data_res);
        }

        fetchData();
    }, []);

    const handleUrlChange = (e: any, level: any) => {
        const newLevels = data.map((l: any) =>
            l.code === level.code ? { ...l, url: e.target.value } : l
        );

        setData(newLevels);
    };

    const handleUpdateClick = async () => {
        try {
            for (let i = 0; i < data.length; i++) {
                const response = await updateWarningURLApi(data[i]);   
            }

            notifySuccess(intl.formatMessage({ id: "WARNING.MASTER.EDIT.SUCCESS" }));
            setUrlDisabled(true);
        } catch (e: any) {
            notifyError(e);
        }
    };

    if (!data) {
        return (
            <div className="warning-page">
                <div className="activity-body">
                    LOADING
                </div>
            </div>
        );
    }

    return (
        <Fragment>
            <div className="warning-page">
                <div className="activity-body">
                    <Card>
                        <CardHeader title={intl.formatMessage({ id: "WARNING.MASTER.TITLE" }).toUpperCase()} />
                        <CardBody>
                            {data.map((level: any, index: any) => (
                                <div className="mb-5" key={level._id}>
                                    <label className='font-bold mb-2'>{level.name}</label>
                                    <input
                                        disabled={urlDisabled}
                                        className="border rounded w-50 py-2 px-3"
                                        type="text"
                                        value={level.url}
                                        onChange={(e) => handleUrlChange(e, level)}
                                    />
                                </div>
                            ))}
                            {urlDisabled && <button
                                className="btn btn-primary fixed-btn-width ml-0 mt-8"
                                type="button"
                                onClick={() => setUrlDisabled(false)}
                            >
                                {intl.formatMessage({ id: "WARNING.MASTER.EDIT" })}
                            </button>}
                            {!urlDisabled && <>
                                <button
                                    className="btn btn-primary fixed-btn-width mr-8 mt-8"
                                    type="button"
                                    onClick={handleUpdateClick}
                                >
                                    {intl.formatMessage({ id: "WARNING.MASTER.SAVE" })}
                                </button>
                                <button
                                    className="btn btn-outline-primary fixed-btn-width mr-8 mt-8"
                                    type="button"
                                    onClick={() => setUrlDisabled(true)}
                                >
                                    {intl.formatMessage({ id: "WARNING.MASTER.EXIT" })}
                                </button>
                            </>}
                        </CardBody>
                    </Card>
                </div>
            </div>
        </Fragment>
    );
}

export default WarningPage;