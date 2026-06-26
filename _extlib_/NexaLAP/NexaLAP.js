if (nexacro) {
    nexacro.NexaLAP = {}
    nexacro.NexaLAP._projectNo = "";
    nexacro.NexaLAP._NexaLAPServer_url = "https://www.npangea.com/nexalapserver";

    if (nexacro.Environment) {
        nexacro.NexaLAP.init = function () {
            // NexaLAPServer Service Management
            nexacro._addService("NexaLAPServer", "bs", nexacro.NexaLAP._NexaLAPServer_url, "none", null, "", "0", "0");
        }
    }
}
