import * as React from "react";
import * as moment from "moment";
import { CSSProperties } from "react";
import { SummaryPos } from "../../src/Scheduler";

export const SummaryComponent: React.FC<{}> = (props) => {
    const { summary, left, width, top, schedulerData } = this.props;
    const { config } = schedulerData;
    const style: CSSProperties = {
        height: config.eventItemHeight,
        color: config.summaryColor,
        textAlign: "center",
        marginLeft: "6px",
        marginRight: "6px",
        fontSize: undefined,
    };

    if (summary.color != undefined) {
        style.color = summary.color;
    }
    if (config.summaryPos === SummaryPos.TopRight || config.summaryPos === SummaryPos.BottomRight) {
        style.textAlign = "right";
    } else if (config.summaryPos === SummaryPos.TopLeft || config.summaryPos === SummaryPos.BottomLeft) {
        style.textAlign = "left";
    }
    if (summary.fontSize != undefined) {
        style.fontSize = summary.fontSize;
    }

    return <>
        <a className="timeline-event header2-text" style={{ left, width, top, cursor: "default" }} >
            <div style={style}>
                {summary.text}
            </div>
        </a>
    </>;
}