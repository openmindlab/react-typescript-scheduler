import * as React from "react";

import {
    EventProps,
} from "../../src/Scheduler";

export const EventComponent: React.FC<EventProps> = (props) => {

    const borderWidth = props.isStart ? "4" : "0";
    let borderColor = "rgba(0,139,236,1)";
    let backgroundColor = "#80C5F6";
    const titleText = props.schedulerData.behaviors.getEventTextFunc(props.schedulerData, props.eventItem);
    if (!!props.eventItem.type) {
        borderColor = props.eventItem.type == 1 ? "rgba(0,139,236,1)" : (props.eventItem.type == 3 ? "rgba(245,60,43,1)" : "#999");
        backgroundColor = props.eventItem.type == 1 ? "#80C5F6" : (props.eventItem.type == 3 ? "#FA9E95" : "#D9D9D9");
    }
    let divStyle = { borderLeft: borderWidth + "px solid " + borderColor, backgroundColor, height: props.mustBeHeight, maxWidth: undefined };
    if (!!props.agendaMaxEventWidth) {
        divStyle = { ...divStyle, maxWidth: props.agendaMaxEventWidth };
    }

    return <div key={props.eventItem.id} className={props.mustAddCssClass} style={divStyle}>
        <span style={{ marginLeft: "4px", lineHeight: `${props.mustBeHeight}px` }}>{titleText}</span>
    </div>;
};

export const EventComponentRound: React.FC<EventProps> = (props) => {
    const { schedulerData, eventItem, isStart, isEnd, isInPopover, startResizeDiv, endResizeDiv } = props;
    const { config } = schedulerData;
    const titleText = schedulerData.behaviors.getEventTextFunc(schedulerData, eventItem);
    let bgColor = config.defaultEventBgColor;
    if (eventItem.bgColor) {
        bgColor = eventItem.bgColor;
    }
    const roundCls = isStart ? (isEnd ? "round-all" : "round-head") : (isEnd ? "round-tail" : "round-none");
    const eventItemTemplate = (
        <div className={roundCls + " event-item"} key={eventItem.id}
            style={{ height: config.eventItemHeight, backgroundColor: bgColor }}>
            <span style={{ marginLeft: "10px", lineHeight: `${config.eventItemHeight}px` }}>{isInPopover ? `${eventItem.start.format("HH:mm")} ${titleText}` : titleText}</span>
        </div>
    );

    return <a
        onClick={() => {
            alert(`You just clicked an event: {id: ${eventItem.id}, title: ${eventItem.title}}`);
        }}>
        {eventItemTemplate}
        {startResizeDiv}
        {endResizeDiv}
    </a>;
};
