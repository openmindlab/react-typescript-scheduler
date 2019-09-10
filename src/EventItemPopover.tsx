import * as React from "react";
import { Component } from "react";
import { EventItemPopoverProps } from "./Scheduler";

class EventItemPopover extends Component<EventItemPopoverProps & { PopoverFC?: React.FC<EventItemPopoverProps> }> {
    constructor(props: Readonly<EventItemPopoverProps & { PopoverFC?: React.FunctionComponent<EventItemPopoverProps>; }>) {
        super(props);
    }

    public render() {
        const { PopoverFC } = this.props;
        if (PopoverFC) {
            return <PopoverFC {...this.props} />;
        } else {
            return <div className="InternalError">Missing popover plugin</div>;
        }
    }
}

export default EventItemPopover;
