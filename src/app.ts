import { Dashboard, ItemForm } from "dattatable";
import { Components } from "gd-sprest-bs";
import * as jQuery from "jquery";
import * as moment from "moment";
import { formatDateValue } from "./common";
import { DataSource, IItem } from "./ds";
import Strings from "./strings";

/**
 * Main Application
 */
export class App {
    // Constructor
    constructor(el: HTMLElement) {
        // Set the list name
        ItemForm.ListName = Strings.Lists.TimeAway;

        // Initialize the application
        DataSource.init().then(() => {
            // Render the dashboard
            this.render(el);
        });
    }

    // Renders the dashboard
    private render(el: HTMLElement) {
        // Create the dashboard
        let dashboard = new Dashboard({
            el,
            hideHeader: true,
            useModal: true,
            filters: {
                items: [{
                    header: "By Category",
                    items: DataSource.CategoryFilters,
                    onFilter: (value: string) => {
                        // Filter the table
                        dashboard.filter(3, value);
                    }
                }]
            },
            navigation: {
                title: Strings.ProjectName,
                items: [
                    {
                        className: "btn-outline-light",
                        text: "New Entry",
                        isButton: true,
                        onClick: () => {
                            // Create an item
                            ItemForm.create({
                                onUpdate: () => {
                                    // Load the data
                                    DataSource.load().then(items => {
                                        // Refresh the table
                                        dashboard.refresh(items);
                                    });
                                }
                            });
                        }
                    }
                ]
            },
            footer: {
                itemsEnd: [
                    {
                        text: "v" + Strings.Version
                    }
                ]
            },
            table: {
                rows: DataSource.Items,
                dtProps: {
                    dom: 'rt<"row"<"col-sm-4"l><"col-sm-4"i><"col-sm-4"p>>',
                    createdRow: function (row, data, index) {
                        jQuery('td', row).addClass('align-middle');
                    },
                    drawCallback: function (settings) {
                        let api = new jQuery.fn.dataTable.Api(settings) as any;
                        jQuery(api.context[0].nTable).removeClass('no-footer');
                        jQuery(api.context[0].nTable).addClass('tbl-footer');
                        jQuery(api.context[0].nTable).addClass('table-striped');
                        jQuery(api.context[0].nTableWrapper).find('.dataTables_info').addClass('text-center');
                        jQuery(api.context[0].nTableWrapper).find('.dataTables_length').addClass('pt-2');
                        jQuery(api.context[0].nTableWrapper).find('.dataTables_paginate').addClass('pt-03');
                    },
                    headerCallback: function (thead, data, start, end, display) {
                        jQuery('th', thead).addClass('align-middle');
                    },
                    // Order by the 1st column by default; ascending
                    order: [[1, "asc"]]
                },
                columns: [
                    {
                        name: "",
                        title: "AssignedTo",
                        onRenderCell: (el, column, item: IItem) => {
                            // Set the date/time filter/sort values
                            el.setAttribute("data-filter", item.AssignedTo.Title);
                            el.setAttribute("data-sort", item.AssignedTo.Title);

                            // Render a buttons
                            Components.ButtonGroup({
                                el,
                                buttons: [
                                    {
                                        text: item.AssignedTo.Title,
                                        type: Components.ButtonTypes.OutlinePrimary,
                                        onClick: () => {
                                            // Show the display form
                                            ItemForm.view({
                                                itemId: item.Id
                                            });
                                        }
                                    },
                                    {
                                        text: "Edit",
                                        type: Components.ButtonTypes.OutlineSuccess,
                                        onClick: () => {
                                            // Show the edit form
                                            ItemForm.edit({
                                                itemId: item.Id,
                                                onUpdate: () => {
                                                    // Refresh the data
                                                    DataSource.load().then(items => {
                                                        // Update the data
                                                        dashboard.refresh(items);
                                                    });
                                                }
                                            });
                                        }
                                    }
                                ]
                            });
                        }
                    },
                    {
                        name: "EventDate",
                        title: "Start Date",
                        onRenderCell: (el, col, item: IItem) => {
                            // Render the date/time value
                            el.innerHTML = formatDateValue(item.EventDate);

                            // Set the date/time filter/sort values
                            el.setAttribute("data-filter", moment(item.EventDate).format("dddd MMMM DD YYYY"));
                            el.setAttribute("data-sort", item.EventDate);
                        }
                    },
                    {
                        name: "EndDate",
                        title: "End Date",
                        onRenderCell: (el, col, item: IItem) => {
                            // Render the date/time value
                            el.innerHTML = formatDateValue(item.EndDate);

                            // Set the date/time filter/sort values
                            el.setAttribute("data-filter", moment(item.EndDate).format("dddd MMMM DD YYYY"));
                            el.setAttribute("data-sort", item.EndDate);
                        }
                    },
                    {
                        name: "Category",
                        title: "Category"
                    },
                    {
                        name: "Description",
                        title: "Description"
                    }
                ]
            }
        });
    }
}
