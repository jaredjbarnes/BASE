BASE.require(["BASE.unitTest.TeamCityUnitTest"], function () {

    BASE.namespace("BASE.unitTest");

    BASE.unitTest.createInstance = function (name) {
        ///<signature>
        ///<param name="name" Type="String">Name of the test.</param>
        ///<returns  type="BASE.unitTest.UnitTest" />
        ///</signature>

        return new BASE.unitTest.TeamCityUnitTest(name);
    };

});