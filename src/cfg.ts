import { Helper, SPTypes } from "gd-sprest-bs";
import Strings from "./strings";

/**
 * SharePoint Assets
 */
export const Configuration = Helper.SPConfig({
    ListCfg: [
        {
            ListInformation: {
                Title: Strings.Lists.TimeAway,
                BaseTemplate: SPTypes.ListTemplateType.Events
            },
            ContentTypes: [
                {
                    Name: "Event",
                    FieldRefs: [
                        "AssignedTo", "EventDate",
                        "EndDate", "Category", "Description"
                    ]
                }
            ],
            CustomFields: [
                {
                    name: "AssignedTo",
                    title: "Assigned To",
                    type: Helper.SPCfgFieldType.User,
                    required: true,
                    selectionMode: SPTypes.FieldUserSelectionType.PeopleOnly,
                    defaultValue: "[Me]"
                } as Helper.IFieldInfoUser
            ],
            ViewInformation: [
                {
                    ViewName: "All Events",
                    ViewFields: [
                        "AssignedTo", "EventDate", "EndDate", "Category", "Description"
                    ]
                }
            ]
        }
    ]
});