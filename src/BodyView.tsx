import * as React from "react";
import { Component, CSSProperties } from "react";
import { SchedulerData } from "./Scheduler";

interface BodyViewProps {
    schedulerData: SchedulerData;
}

class BodyView extends Component<BodyViewProps> {

    constructor(props: Readonly<BodyViewProps>) {
        super(props);
    }

    public render() {
        const { schedulerData } = this.props;
        const { renderData, headers, config, behaviors } = schedulerData;

        const cellWidth = schedulerData.getContentCellWidth();
        const displayRenderData = renderData.filter((o) => o.render);
        const tableRows = displayRenderData.map((item) => {
            const rowCells = headers.map((header, index) => {
                const key = item.slotId + "_" + header.time;
                const css: CSSProperties = {
                    width: index === headers.length - 1 ? undefined : cellWidth,
                    backgroundColor: undefined,
                };

                if (!!header.nonWorkingTime) {
                    css.backgroundColor = config.nonWorkingTimeBodyBgColor;
                }
                if (item.groupOnly) {
                    css.backgroundColor = config.groupOnlySlotColor;
                }

                return (
                    <td key={key} style={css}><div></div></td>
                );
            });
            const cssParent: CSSProperties = {
                height: item.rowHeight,
            };
            return (
                <tr key={item.slotId} style={cssParent}>
                    {rowCells}
                </tr>
            );
        });

        const cssToParent: CSSProperties = {};

        return (
            <tbody style={cssToParent}>
                {tableRows}
            </tbody >
        );
    }
}

export default BodyView;
