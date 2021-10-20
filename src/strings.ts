import { ContextInfo } from "gd-sprest-bs";

// Updates the strings for SPFx
export const setContext = (context) => {
    // Set the page context
    ContextInfo.setPageContext(context);

    // Update the values
    Strings.SolutionUrl = ContextInfo.webServerRelativeUrl + "/SiteAssets/Event-Registration/index.html";
}

// Strings
const Strings = {
    AppElementId: "time-away",
    GlobalVariable: "TimeAway",
    Lists: {
        TimeAway: "Time Away"
    },
    ProjectName: "Time Away",
    ProjectDescription: "Logs vacation time for employees.",
    SolutionUrl: ContextInfo.webServerRelativeUrl + "/siteassets/time-away/index.html",
    Version: "0.1"
}
export default Strings;