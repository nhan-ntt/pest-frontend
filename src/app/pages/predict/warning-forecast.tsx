import { useState, useEffect, ReactNode } from "react";
import Calendar, { CalendarTileProperties } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Formik, Form, Field } from 'formik';
import { useIntl } from "react-intl";

export const LIST_PEST_LEVEL = [
    {
        name: "Trứng",
        value: 0,
        term: "egg",
    },
    {
        name: "Sâu non 1",
        value: 1,
        term: "instar_1",
    },
    {
        name: "Sâu non 2",
        value: 2,
        term: "instar_2",
    },
    {
        name: "Sâu non 3",
        value: 3,
        term: "instar_3",
    },
    {
        name: "Sâu non 4",
        value: 4,
        term: "instar_4",
    },
    {
        name: "Sâu non 5",
        value: 5,
        term: "instar_5",
    },
    {
        name: "Sâu non 6",
        value: 6,
        term: "instar_6",
    },
    {
        name: "Nhộng",
        value: 7,
        term: "pupal",
    },
    {
        name: "Trưởng thành",
        value: 8,
        term: "adult",
    },
];

const LIST_PLANT = [
    {
        name: "Cây non",
        last: 42,
        value: "a",
    },
    {
        name: "Cây con",
        last: 42,
        value: "b",
    },
    {
        name: "Cây bắp",
        last: 42,
        value: "c",
    },
];

const getPestLevelName = (lvl: number) => {
    const res = LIST_PEST_LEVEL.find((tmp: any) => tmp.value === lvl );
    if (res) return res.name;
    return null;
}

const getPlantLevelName = (lvl: string) => {
    const res = LIST_PLANT.find((tmp: any) => tmp.value === lvl);
    if (res) return res.name;
    return null;
}


interface WarningData {
    date: Date;
    warningLevel: number;
    pestLevel: number;
    plantLevel: string;
}

interface WarningDataProps {
    data: Array<WarningData>;
}


function WarningForecast({ data }: WarningDataProps) {
    const intl = useIntl();

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showingData, setShowingData] = useState<WarningData | null>(null);

    const setClickDay = () => {
        if (!data) return;

        const matched = data.find(
            (item) => {
                const tmpDate = new Date(item.date);

                return tmpDate.toDateString() === selectedDate.toDateString();
            }
        );

        if (matched) {
            setShowingData(matched);
        } else {
            setShowingData(null);
        }
    };

    useEffect(() => {
        setClickDay();
    }, [selectedDate])

    const getTileContent = ({ date, view }: CalendarTileProperties) => {
        if (view !== "month") return null;
        if (!data) return null;

        for (let i = 0; i < data.length; i++) {
            const tmpDate = new Date(data[i].date);

            if (tmpDate.toDateString() === date.toDateString()) {
                return (
                    <div
                      style={{
                        backgroundColor:
                          data[i].warningLevel === 1
                            ? 'yellow'
                            : data[i].warningLevel === 2
                            ? 'orange'
                            : 'red',
                        color:
                          data[i].warningLevel === 1
                            ? 'red'
                            : data[i].warningLevel === 2
                            ? 'green'
                            : 'yellow',
                      }}
                    >!</div>
                );
            }
        }

        return null;
    };

    return (
        <div className="row mb-8">
            <div className="ml-16">
                <Calendar
                    onChange={setSelectedDate}
                    value={selectedDate}
                    tileContent={getTileContent}
                />
            </div>
            {showingData && (
                <div className="ml-auto mr-8 w-50">
                    <Formik initialValues={showingData} onSubmit={(values: WarningData) => { }} enableReinitialize={true}>
                        <Form>
                            <div className="mb-5">
                                <label className='font-bold mb-2' htmlFor="date">{intl.formatMessage({ id: 'WARNING.FORECAST.DATE' })}</label>
                                <Field name="date" type="text" disabled
                                    value={new Date(showingData?.date).toISOString().slice(0, 10)}
                                    className="border rounded w-100 py-2 px-3"/>
                            </div>
                            <div className="mb-5">
                                <label className='font-bold mb-2' htmlFor="warningLevel">{intl.formatMessage({ id: 'WARNING.FORECAST.WARNING_LEVEL' })}</label>
                                <Field name="warningLevel" type="text" disabled className="border rounded w-100 py-2 px-3"/>
                            </div>
                            <div className="mb-5">
                                <label className='font-bold mb-2' htmlFor="pestLevel">{intl.formatMessage({ id: 'WARNING.FORECAST.PEST_LEVEL' })}</label>
                                <Field name="pestLevel" type="text" disabled
                                    value={getPestLevelName(showingData?.pestLevel)} 
                                    className="border rounded w-100 py-2 px-3"/>
                            </div>
                            <div className="mb-5">
                                <label className='font-bold mb-2' htmlFor="plantLevel">{intl.formatMessage({ id: 'WARNING.FORECAST.PLANT_LEVEL' })}</label>
                                <Field name="plantLevel" type="text" disabled
                                    value={getPlantLevelName(showingData?.plantLevel)} 
                                    className="border rounded w-100 py-2 px-3"/>
                            </div>
                        </Form>
                    </Formik>
                </div>
            )}
        </div>
    );
}

export default WarningForecast;