///<reference path="/vs-doc/BASE.js" />
///<reference path="/scripts/leavitt/projects/ProjectManager.js" />
///<reference path="/scripts/jQuery/fn/region.js" />

BASE.require(["leavitt.projects.ProjectManager", "jQuery.fn.region"], function () {
    var ProjectManager = leavitt.projects.ProjectManager;

    var InterfaceManager = function () {

        var projectManager = new leavitt.projects.ProjectManager();
        this.displayProjects = function () { };
        this.displayMenu = function () { };
        
    };

    BASE.namespace("leavitt.projects");

    leavitt.projects.InterfaceManager = InterfaceManager;
});