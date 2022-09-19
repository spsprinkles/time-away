import { InstallationRequired } from "dattatable";
import { WebParts } from "gd-sprest-bs";
import { App } from "./app";
import { Configuration } from "./cfg";
import { DataSource } from "./ds";
import Strings, { update } from "./strings";

// Styling
import "./styles.scss";

// Create the global variable for this solution
const GlobalVariable = {
    Configuration,
    render: (el: HTMLElement, cfg?: WebParts.ISPFxListWebPartCfg) => {
        // Initialize the solution
        DataSource.init(cfg).then(
            // Success
            () => {
                // Create the application
                new App(el);
            },
            // Error
            () => {
                // See if an install is required
                InstallationRequired.requiresInstall(Configuration).then(installFl => {
                    // See if an installation is required
                    if (installFl) {
                        // Show the installation dialog
                        InstallationRequired.showDialog();
                    } else {
                        // Log
                        console.error("[" + Strings.ProjectName + "] Error initializing the solution.");
                    }
                });
            }
        );
    },
    renderSPFx: (spfx, envType: number) => {
        // Render the SPFx webpart
        WebParts.SPFxListWebPart({
            envType,
            spfx,
            render: (el, cfg) => {
                // Render the solution
                GlobalVariable.render(el, cfg || {});
            }
        });

        // Update the strings
        update();
    }
};

// Update the DOM
window[Strings.GlobalVariable] = GlobalVariable;

// Get the element and render the app if it is found
let elApp = document.querySelector("#" + Strings.AppElementId) as HTMLElement;
if (elApp) {
    // Render the application
    GlobalVariable.render(elApp);
}