import * as React from "react";
import { Component, CSSProperties } from "react";
import { SchedulerData, ColumnHeaderProps } from "./Scheduler";

interface HeaderViewProps {
    schedulerData: SchedulerData;
    ColumnHeaderFC?: React.FC<ColumnHeaderProps>;
}

class HeaderView extends Component<HeaderViewProps> {
    constructor(props: Readonly<HeaderViewProps>) {
        super(props);
    }

    public render() {
        const { schedulerData, ColumnHeaderFC } = this.props;
        const { headers } = schedulerData;
        const headerHeight = schedulerData.getTableHeaderHeight();
        const css: CSSProperties = {
            height: headerHeight,
        };

        let headerList = [<div className="InternalError">Missing ColumnHeaderFC</div>];
        if (ColumnHeaderFC) {
            const count = headers.length;
            headerList = headers.map((header, index) =>
                <ColumnHeaderFC key={index} schedulerData={schedulerData} header={header} headersCount={count} index={index} />,
            );
        }

        return (
            <thead>
                <tr style={css}>
                    {headerList}
                </tr>
            </thead >
        );
    }
}

export default HeaderView;
