import * as moment from "moment";
import { DataItem, DataSet, DataView, Timeline } from "vis-timeline/standalone";
import { formatDateValue } from "./common";
import { DataSource } from "./ds";

/**
 * Timeline
 */
export class TimeLine {
    private _el: HTMLElement = null;
    private _filter: string = null;
    private _groups: Array<any> = null;
    private _items: Array<any> = null;
    private _options: any = null;
    private _view: DataView = null;

    // Timeline
    private _timeline = null;
    get Timeline() { return this._timeline; }

    // Constructor
    constructor(el: HTMLElement) {
        // Save the properties
        this._el = document.createElement("div");
        this._el.id = "timeline";
        el.appendChild(this._el);

        // Load the events and groups
        this.loadEvents();

        // Render the timeline
        this.render();

        // Hide the timeline by default
        this.hide();
    }

    // Filters the timeline
    filter(value: string) {
        // Set the filter
        this._filter = value;

        // Refresh the timeline
        this._view ? this._view.refresh() : null;
    }

    // Filters the timeline data
    private filterEvents(row) {
        // See if a filter is defined
        if (this._filter) {
            // See if the category matches
            if (row.item.Category != this._filter) { return false; }
        }

        // Don't filter out the item
        return true;
    }

    // Hides the timeline
    hide() {
        // Hides the element
        this._el.classList.add("d-none");
    }

    // Loads the events
    private loadEvents() {
        // Clear the groups, items and options
        this._groups = [];
        this._items = [];
        this._options = {
            min: Date.now(),
            max: Date.now()
        };

        // See if items exist
        if (DataSource.Items) {
            let groups = {};
            let minDate: moment.Moment = null;
            let maxDate: moment.Moment = null;

            // Parse the events
            for (let i = 0; i < DataSource.Items.length; i++) {
                let item = DataSource.Items[i];

                // Validate the dates
                let startDate = item.EventDate;
                let endDate = item.EndDate;
                if (endDate && startDate) {
                    // Set the min/max dates
                    if (minDate == null) { minDate = moment(startDate); }
                    else if (minDate.isAfter(moment(startDate))) { minDate = moment(startDate); }
                    if (maxDate == null) { maxDate = moment(endDate); }
                    else if (maxDate.isBefore(moment(endDate))) { maxDate = moment(endDate); }

                    // Create the timeline item
                    let timelineItem: DataItem = {
                        item,
                        id: "Event_" + item.Id,
                        content: item.Title,
                        group: item.AssignedTo.Title,
                        title: item.Title,
                        start: formatDateValue(startDate),
                        end: formatDateValue(endDate, true)
                    } as any;

                    // Add an entry for this user
                    groups[item.AssignedTo.Title] = true;

                    // Add the timeline item
                    this._items.push(timelineItem);
                }
            }

            // Set the min/max dates
            this._options = {
                min: minDate.subtract(1, "d"),
                max: maxDate.add(1, "d")
            };

            // Parse the group names and sort them
            let groupNames = [];
            for (let key in groups) { groupNames.push(key); }
            groupNames = groupNames.sort((a, b) => {
                if (a.content < b.content) { return -1; }
                if (a.content > b.content) { return 1; }
                return 0;
            });

            // Parse the groups
            for (let i = 0; i < groupNames.length; i++) {
                let groupName = groupNames[i];

                // Add the group
                this._groups.push({
                    id: groupName,
                    content: groupName,
                    order: i
                });
            }
        }
    }

    // Refreshes the timeline
    refresh() {
        // Load the events and groups
        this.loadEvents();

        // See if data exists
        if (this._view && this._timeline) {
            // Update the view
            this._view.setData(new DataSet(this._items));

            // Update the groups
            this._timeline.setGroups(this._groups);
        } else {
            // Render the timeline
            this.render();
        }
    }

    // Shows the timeline
    show() {
        // Show the element
        this._el.classList.remove("d-none");
    }

    // Renders the timeline
    private render() {
        // Ensure items exist
        if (this._items.length > 0) {
            // Create the view
            this._view = new DataView(new DataSet(this._items), { filter: row => { return this.filterEvents(row); } });

            // Initialize the timeline
            this._timeline = new Timeline(this._el, this._view, this._groups, this._options);
        }
    }
}