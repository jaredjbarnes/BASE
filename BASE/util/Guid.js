(function () {

    BASE.namespace("BASE.util");

    var S4 = function () {
        return Math.floor(
                Math.random() * 0x10000 /* 65536 */
            ).toString(16);
    };

    BASE.util.Guid = {
        create: function () {
            return (
                    S4() + S4() + "-" +
                    S4() + "-" +
                    S4() + "-" +
                    S4() + "-" +
                    S4() + S4() + S4()
                );
        }
    };


})();