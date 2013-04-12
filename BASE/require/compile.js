BASE.require(["jQuery", "Array.prototype.forEach", "Object.keys", "BASE.Synchronizer"], function () {

    BASE.require.compile = function () {
        ///<summary>
        ///A method that compiles all scripts that have been loaded with BASE.require to this point.
        ///</summary>
        ///<returns type="undefined" >
        ///Returns undefined, and open a new tab with the compiled file.
        ///</returns>
        var dependencies = BASE.require.dependencyList;
        var compilationHash = {};
        var synchronizer = new BASE.Synchronizer();

        dependencies.forEach(function (namespace) {
            if (namespace !== "BASE.require.compile") {
                synchronizer.add(function (callback) {
                    $.ajax({
                        url: BASE.require.getPath(namespace),
                        type: "GET",
                        dataType: "text",
                        complete: function (xhr) {
                            var data = xhr.responseText;
                            compilationHash[namespace] = "/*FILE: " + namespace + " START*/\n" + data + "\n/*FILE: " + namespace + " END*/\n";
                            callback();
                        }
                    });
                });
            }
        });

        synchronizer.start(function () {
            var compilation = [];
            dependencies.forEach(function (namespace) {
                compilation.push(compilationHash[namespace]);
            });
            var encoded = encodeURI(compilation.join("\n"));
            location.href = "data:application/javascript;charset=utf-8," + encoded;
        });
    };
});