require("../../../../BASE.js");
BASE.require.loader.root = "./";


BASE.require(["BASE.v1.util.Notifier"], function () {

    describe("BASE.v1.util.Notifier Spec", function () {

        it("Observing to the object, and notify it, the unobserve and notify.", function () {

            var executedObserveAll = false;
            var executedObserve = false;
            var allCount = 0;
            var count = 0;

            var observeAll = function () {
                allCount++;
                executedObserveAll = true;
            };
            var observe = function () {
                count++;
                executedObserve = true;
            };

            var obj = new BASE.v1.util.Notifier();
            
            obj.observe("myEvent", observe);
            obj.observeAll(observeAll);

            obj.notify("myEvent");

            obj.unobserve("myEvent", observe);
            obj.unobserveAll(observeAll);

            obj.notify("myEvent");

            runs(function () {
                expect(executedObserveAll).toBe(true);
                expect(executedObserve).toBe(true);
                expect(allCount).toBe(1);
                expect(count).toBe(1);
            });

        });

    });

});