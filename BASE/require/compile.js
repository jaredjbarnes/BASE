/// <reference path="http://raw.github.com/jaredjbarnes/BASE/master/BASE.js" />
/// <reference path="http://raw.github.com/jaredjbarnes/BASE/master/jQuery.js" />
/// <reference path="http://raw.github.com/jaredjbarnes/BASE/master/Array/prototype/forEach.js" />
/// <reference path="http://raw.github.com/jaredjbarnes/BASE/master/Object/keys.js" />

BASE.require(["jQuery", "Array.prototype.forEach", "Object.keys"], function () {

    BASE.require.compile = function () {
        ///<summary>
        ///A method that compiles all scripts that have been loaded with BASE.require to this point.
        ///</summary>
        ///<returns type="undefined" >
        ///Returns undefined, and open a new tab with the compiled file.
        ///</returns>
        var dependencies = BASE.require.dependencyList;
        var compilation = [];
        var hash = {};

        dependencies.forEach(function (value) {
            hash[value] = value;
        });
        //Remove the require.compile from hash.
        delete hash["BASE.require.compile"]

        var urlList = Object.keys(hash);
        urlList.forEach(function (url) {
            $.ajax({
                url: BASE.require.getPath(url),
                type: "GET",
                dataType: "text",
                complete: function (xhr) {
                    var data = xhr.responseText;

                    compilation.push("/*FILE: " + url + " START*/\n" + data + "\n/*FILE: " + url + " END*/\n");
                    if (compilation.length === urlList.length) {
                        var encoded = encodeURI(compilation.join("\n"));
                        location.href = "data:application/javascript;charset=utf-8," + encoded;
                    }
                }
            });
        });
    };
});