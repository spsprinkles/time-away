import { ContextInfo } from "gd-sprest-bs";

// Updates the strings for SPFx
export const update = () => {
    // Update the values
    Strings.SourceUrl = ContextInfo.webServerRelativeUrl;
}

// Strings
const Strings = {
    AppElementId: "timeline-calendar",
    GlobalVariable: "TimelineCalendar",
    Lists: {
        TimeAway: "Timeline Calendar"
    },
    ProjectName: "Timeline Calendar",
    SourceUrl: ContextInfo.webServerRelativeUrl,
    Version: "0.1"
}
export default Strings;