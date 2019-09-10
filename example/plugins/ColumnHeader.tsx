import * as React from "react";
import * as moment from "moment";
import { CSSProperties } from "react";
import { ColumnHeaderProps, CellUnits } from "../../src/Scheduler";

export const ColumnHeaderComponent: React.FC<ColumnHeaderProps> = (props) => {
    const { schedulerData, header, index, headersCount } = props;
    const { config, cellUnit } = schedulerData;
    const cellWidth = schedulerData.getContentCellWidth();

    let style: CSSProperties = {};
    const currentDateStyle: CSSProperties = {
        backgroundColor: "#118dea",
        color: "white",
    };

    if (cellUnit === CellUnits.Hour) {
        const minuteStepsInHour = schedulerData.getMinuteStepsInHour();
        if (index % minuteStepsInHour === 0) {
            style = !!header.nonWorkingTime ? { width: cellWidth * minuteStepsInHour, color: config.nonWorkingTimeHeadColor, backgroundColor: config.nonWorkingTimeHeadBgColor } : { width: cellWidth * minuteStepsInHour };

            if (index === headersCount - minuteStepsInHour) {
                style = !!header.nonWorkingTime ? { color: config.nonWorkingTimeHeadColor, backgroundColor: config.nonWorkingTimeHeadBgColor } : {};
            }

            const pFormattedList = config.nonAgendaDayCellHeaderFormat.split("|").map((i) => moment(header.time).format(i));

            if (moment(header.time).isSame(new Date(), "hour")) {
                style = currentDateStyle;
            }

            return <th key={moment(header.time).format()} style={style} className="header3-text">
                {pFormattedList.map((i, ind) => (
                    <div key={ind}>{i}</div>
                ))}
            </th>;
        }
    } else {
        style = !!header.nonWorkingTime ? { width: cellWidth, color: config.nonWorkingTimeHeadColor, backgroundColor: config.nonWorkingTimeHeadBgColor } : { width: cellWidth };
        if (index === headersCount - 1) {
            style = !!header.nonWorkingTime ? { color: config.nonWorkingTimeHeadColor, backgroundColor: config.nonWorkingTimeHeadBgColor } : {};
        }

        if (moment(header.time).isSame(new Date(), "day")) {
            style = currentDateStyle;
        }
        const pFormattedList = config.nonAgendaOtherCellHeaderFormat.split("|").map((i) => moment(header.time).format(i));
        return <th key={moment(header.time).format()} style={style} className="header3-text">
            {pFormattedList.map((i, ind) => (
                <div key={ind}>{i}</div>
            ))}
        </th>;
    }
};
