import * as React from 'react'
import { Component, CSSProperties } from 'react'
import { SchedulerData } from './Scheduler';

interface BodyViewProps {
    schedulerData: SchedulerData
}

class BodyView extends Component<BodyViewProps> {

    constructor(props: Readonly<BodyViewProps>) {
        super(props);
    }

    render() {
        const { schedulerData } = this.props;
        const { renderData, headers, config, behaviors } = schedulerData;

        let cellWidth = schedulerData.getContentCellWidth();
        let displayRenderData = renderData.filter(o => o.render);
        let tableRows = displayRenderData.map((item) => {
            let rowCells = headers.map((header, index) => {
                let key = item.slotId + '_' + header.time;
                let style: CSSProperties = {
                    width: index === headers.length - 1 ? undefined : cellWidth,
                    backgroundColor: undefined
                }

                if (!!header.nonWorkingTime)
                    style.backgroundColor = config.nonWorkingTimeBodyBgColor
                if (item.groupOnly)
                    style.backgroundColor = config.groupOnlySlotColor

                if (!!behaviors.getNonAgendaViewBodyCellBgColorFunc) {
                    let cellBgColor = behaviors.getNonAgendaViewBodyCellBgColorFunc(schedulerData, item.slotId, header);
                    if (!!cellBgColor)
                        style.backgroundColor = cellBgColor
                }
                return (
                    <td key={key} style={style}><div></div></td>
                )
            });

            return (
                <tr key={item.slotId} style={{ height: item.rowHeight }}>
                    {rowCells}
                </tr>
            );
        });

        return (
            <tbody>
                {tableRows}
            </tbody >
        );
    }
}

export default BodyView