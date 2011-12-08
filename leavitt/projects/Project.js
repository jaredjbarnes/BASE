///<reference path="/vs-doc/BASE.js" />

(function () {

    BASE.namespace("leavitt.projects");
    leavitt.projects.Project = function (options) {

        if (!(this instanceof leavitt.projects.Project)) {
            return new Project(options);
        }

        options = options || {};
        this.name = options.Name || options.name || null;
        this.parentProjectID = options.ParentProjectID || options.parentProjectID || null;
        this.projectID = options.ProjectID || options.projectID || null;
        this.priorityID = options.PriorityID || options.proirityID || null;
        this.lastUpdataed = options.LastUpdated || options.lastUpdated || null;
        this.due = options.Due || options.due || null;
        this.estimatedHours = options.EstimatedHours || options.estimatedHours || null;
        this.active = options.Active || options.active || null;
        this.created = options.created || options.created || null;
        this.completedDate = options.CompletedDate || options.completedDate || null;
        this.isWaiting = options.IsWaiting || options.isWaiting || null;

        //These should only be ids! Reference only.
        this.members = options.Members || options.members || [];
        this.childProjects = options.ChildProjects || options.childProjects || [];
        this.files = options.Files || options.files || [];
        // End of ids only.

        this.ownerID = options.OwnerID || options.ownerId || null;
        this.canEdit = options.CanEdit || options.canEdit || false;
        this.canView = options.CanView || options.canView || false;
        this.requestedByID = options.RequestedById || options.requestedById || null;
        this.myID = options.MyId || options.myId || null;
        this.isOwner = options.IsOwner || options.isOwner || false;
        this.isTemplate = options.IsTemplate || options.isTemplate || false;
        this.isDeleted = options.IsDeleted || options.isDeleted || false;
        this.type = options.Type || options.type || "Project";
        this.customLink = options.CustomLink || options.customLink || null;
        this.custom = options.Custom || options.custom || null;
        this.categories = options.Categories || options.categories || [];

    };

})();