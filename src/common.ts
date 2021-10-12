import * as moment from "moment";

// Formats the date value
export const formatDateValue = (value: string) => {
    // Ensure a value exists
    if (value) {
        // Return the date value
        return moment(value).format("MM/DD/YYYY");
    }

    // Return nothing
    return "";
}