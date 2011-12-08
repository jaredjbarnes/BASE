///<reference path="/scripts/BASE.js" />
///<reference path="/scripts/jQuery.js" />
///<reference path="/scripts/BASE/enableObserving.js" />
///<reference path="/scripts/leavitt/projects/Project.js" />

BASE.require(["BASE.enableObserving", "leavitt.projects.Project", "jQuery"], function () {

    var Project = leavitt.projects.Project;

    var DatabaseSync = function (options) {
        var databaseSync = this;
        var projectHash = options.projectHash;

        this.onProjectChange = function (e) {
            //this should be the context of the project Object.
            //If needed, reference the databaseSync with "databaseSync" variable.
            var projectID = this.projectID;
            var newValue = e.newValue;
            var oldValue = e.oldValue;
            var project = projectHash[projectID];

            //Sync with database if possible.
            $.ajax({
                url: "",
                type: "POST",
                data: JSON.stringify({}),
                success: function (data) {
                    var responseObj = eval("('" + data + "')");
                    var response = responseObj.d;

                    if (response.success) {

                    } else {

                    }
                },
                error: function () { }
            });
        };
        this.onEmployeeChange = function () {
            //this is in the context of the employee.
            //If needed, reference the databaseSync with "databaseSync" variable.
        };
    };

    BASE.namespace("leavitt.projects");
    leavitt.projects.ProjectManager = function (options) {
        ///<summary>
        ///A Data management class.
        ///ProjectManager interacts with the WebServices. It also optimizes
        ///WebService requests, by caching certain data, and requesting others.
        ///</summary>
        ///<param name="options" type="Object">
        ///options none for now.
        ///</param>

        //Private projects hash.
        var projectsHash = {};
        var employeeHash = {};

        //Private database sync.
        var databaseSync = new DatabaseSync({
            projectHash: this
        });

        this.projects = [];
        this.categories = [];

        this.getProject = function () { };
        this.getProjects = function (idArray, callback) {
            ///<summary>
            ///A method that interacts with the WebServices. It also optimizes
            ///WebService requests, by caching certain data, and requesting others.
            ///</summary>
            ///<param name="idArray" type="Array">
            ///An Array of project ids to fetch. If the Project Manager doesn't have the 
            ///ids, it will fetch them through the WebServices.
            ///e.g [3903,40011,390]
            ///</param>
            ///<param name="callback" type="Function">
            ///A function that will be invoked when ids are fetched. 
            ///An Object hash of projects will be the first argument in the callback.
            ///e.g function(projectObject){
            ///var certainProject = projectObject[3903];
            ///};
            ///</param>

            var returnObj = {};
            for (var x = 0; x < idArray; x++) {
                if (projectsHash[x]) {
                    returnObj[x] = projectsHash[x];
                } else {
                    returnObj[x] = null;
                }
            }

            $.ajax({
                url: "/API/Projects",
                type: "POST",
                data: JSON.Stringify({}),
                success: function (data) {
                    var responseObj = JSON.parse(data);
                    var projects = responseObj.d;
                    var project;
                    for (var x = 0; x < projects.length; x++) {
                        project = new leavitt.projects.Project(projects[x]);
                        returnObj[projects[x].id] = project;
                        BASE.enableObserving(project);
                        project.observe(databaseSync.onProjectChange);
                    }

                    callback(returnObj);
                },
                error: function () {
                    //Check to see if we are offline or not.
                }
            });
        };

        this.addProject = function (options, callback) {

        };
        this.removeProject = function (id, callback) {
            //projectsHash[id].unobserve(databaseSync.onProjectChange);

        };

        this.addTask = function (task) { };
        this.getTask = function (id) { };
        this.getTasks = function () { };
        this.removeTask = function (id) { };

        this.addQuickTask = function (task) { };
        this.getQuickTask = function (id) { };
        this.removeQuickTask = function (id) { };

        this.getEmployee = function (id) { };
        this.getEmployees = function () { };
    };

    //leavitt.projects.ProjectManager = ProjectManager;
});