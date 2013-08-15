(function () {

    BASE.namespace("BASE.util");

    BASE.util.GUID = {
        create: function () {
            var S4 = function () {
                return Math.floor(
                        Math.random() * 0x10000 /* 65536 */
                    ).toString(16);
            };

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