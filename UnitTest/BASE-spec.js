require("../BASE.js");

BASE.require.loader.root = "./";


describe("BASE Spec", function () {

    it("Testing Observable, by observing, notifing, then unobserving and notifing again.", function () {

        var called = 0;
        var all = 0;

        var observable = new BASE.util.Observable();
        var observe = function () {
            called++;
        };

        var observeAll = function () {
            all++;
        };

        observable.observe("something", observe);
        observable.observeAll(observeAll);
        observable.notify({ type: "something" });
        observable.unobserve("something", observe);
        observable.unobserveAll(observeAll);
        observable.notify({ type: "something" });

        runs(function () {
            expect(called).toBe(1);
            expect(all).toBe(1);
        });
    });

    it("Run a test and cancel it, expect onComplete and ifCanceled to fire", function () {
        var callThen = 0;
        var callIfError = 0;
        var callCanceled = 0;
        var callOnComplete = 0;

        var future = new BASE.async.Future(function (setValue, setError) {
            setTimeout(function () {
                setValue(undefined);
            }, 1);
        });

        future.then(function () {
            callThen++;
        }).ifError(function () {
            callIfError++;
        }).ifCanceled(function () {
            callCanceled++;
        }).onComplete(function () {
            callOnComplete++;
        });

        future.cancel();

        runs(function () {
            expect(callThen).toBe(0);
            expect(callCanceled).toBe(1);
            expect(callOnComplete).toBe(1);
            expect(callIfError).toBe(0);
        });
    });

    it("Run a future, expect onComplete and then to fire", function () {
        var callThen = 0;
        var callIfError = 0;
        var callCanceled = 0;
        var callOnComplete = 0;

        var future = new BASE.async.Future(function (setValue, setError) {
            setTimeout(function () {
                setValue(undefined);
                done = true;
            }, 1);
        });

        future.then(function () {
            callThen++;
        }).ifError(function () {
            callIfError++;
        }).ifCanceled(function () {
            callCanceled++;
        }).onComplete(function () {
            callOnComplete++;
        });

        var done = false;
        waitsFor(function () {
            return done;
        });

        runs(function () {
            expect(callThen).toBe(1);
            expect(callCanceled).toBe(0);
            expect(callOnComplete).toBe(1);
            expect(callIfError).toBe(0);
        });
    });

    it("Run a future, set error, expect onComplete and ifError to fire", function () {
        var callThen = 0;
        var callIfError = 0;
        var callCanceled = 0;
        var callOnComplete = 0;

        var future = new BASE.async.Future(function (setValue, setError) {
            setTimeout(function () {
                setError(undefined);
                done = true;
            }, 1);
        });

        future.then(function () {
            callThen++;
        }).ifError(function () {
            callIfError++;
        }).ifCanceled(function () {
            callCanceled++;
        }).onComplete(function () {
            callOnComplete++;
        });

        var done = false;
        waitsFor(function () {
            return done;
        });

        runs(function () {
            expect(callThen).toBe(0);
            expect(callCanceled).toBe(0);
            expect(callOnComplete).toBe(1);
            expect(callIfError).toBe(1);
        });
    });


    it("Run three futures, check whenAll, whenAny, and onComplete.", function () {
        var done = false;

        var future1 = BASE.async.Future.fromResult("1");
        var future2 = BASE.async.Future.fromResult("2");
        var async = new BASE.async.Future(function (setValue, setError) {
            setTimeout(function () {
                setValue("Hello");
            }, 1);
        });

        var task = new BASE.async.Task(future1, future2, async);

        var whenAllCount = 0;
        var whenAnyCount = 0;
        var onCompleteCount = 0;
        var ifCanceledCount = 0;

        task.start().whenAll(function () {
            whenAllCount++;
        }).whenAny(function () {
            whenAnyCount++;
        }).ifCanceled(function () {
            ifCanceledCount++;
        }).onComplete(function () {
            onCompleteCount++;
            done = true;
        });

        waitsFor(function () { return done; });

        runs(function () {
            expect(whenAllCount).toBe(1);
            expect(whenAnyCount).toBe(3);
            expect(onCompleteCount).toBe(1);
            expect(ifCanceledCount).toBe(0);

        });


    });

    it("Run three futures, and cancel one, expect onComplete to fire and ifCanceled.", function () {

        var future1 = new BASE.async.Future(function (setValue, setError) {
            setTimeout(function () { setValue(undefined); }, 1);
        });

        var future2 = new BASE.async.Future(function (setValue, setError) {
            setTimeout(function () { setValue(undefined); }, 1);
        });

        var future3 = new BASE.async.Future(function (setValue, setError) {
            setTimeout(function () { setValue(undefined); }, 1);
        });

        var task = new BASE.async.Task(future1, future2, future3);

        future1.cancel();

        var whenAllCount = 0;
        var whenAnyCount = 0;
        var onCompleteCount = 0;
        var ifCanceledCount = 0;

        task.start().whenAll(function () {
            whenAllCount++;
        }).whenAny(function () {
            whenAnyCount++;
        }).ifCanceled(function () {
            ifCanceledCount++;
        }).onComplete(function () {
            onCompleteCount++;
            done = true;
        });

        waitsFor(function () { return done; });

        runs(function () {
            expect(whenAllCount).toBe(0);
            expect(whenAnyCount).toBe(0);
            expect(onCompleteCount).toBe(1);
            expect(ifCanceledCount).toBe(1);
        });

    });


    it("Test namespace, then get the namespace with getObject.", function () {
        BASE.namespace("Blah.blah");
        Blah.blah.Object = {};

        runs(function () {

            expect(Blah.blah.Object).toBe(BASE.getObject("Blah.blah.Object"));
            delete (function () { return this; }())["Blah"];

        });
    });


    it("Test BASE.require", function () {
        var done = false;

        BASE.require(["BASE.util.GUID"]).then(function () {
            done = true;
        });

        waitsFor(function () {
            return done;
        });

        runs(function () {
            expect(BASE.getObject("BASE.util.GUID")).toBe(BASE.util.GUID);
        });
    });

    it("Test BASE.require", function () {
        var done = false;

        BASE.require(["BASE.somefake.namespace"]).ifError(function () {
            done = true;
        });

        waitsFor(function () {
            return done;
        });

        runs(function () {

        });
    });


    it("Testing Loader.", function () {

        var loader = new BASE.Loader();
        loader.setNamespace("MY.crazyNamespace", "/SomeUrl/My/CrazyNamespace/");
        loader.setObject("MY.Object", "/MyCrazyObject.js");
        loader.setNamespace("MY", "/AnotherUrl");
        loader.root = "/SomeUrl";

        runs(function () {
            expect(loader.getPath("MY.crazyNamespace")).toBe("/SomeUrl/My/CrazyNamespace.js");
            expect(loader.getPath("MY.Object")).toBe("/MyCrazyObject.js");
            expect(loader.getPath("MY.OtherObject")).toBe("/AnotherUrl/OtherObject.js");
            expect(loader.getPath("Loaner")).toBe("/SomeUrl/Loaner.js");
        });

    });

    it("Testing Loader with node.js paths.", function () {

        var loader = new BASE.Loader();
        loader.setNamespace("MY.crazyNamespace", "../SomeUrl/My/CrazyNamespace/");
        loader.setObject("MY.Object", "./MyCrazyObject.js");
        loader.setNamespace("MY", "./AnotherUrl");
        loader.root = "SomeUrl";

        runs(function () {
            expect(loader.getPath("MY.crazyNamespace")).toBe("../SomeUrl/My/CrazyNamespace.js");
            expect(loader.getPath("MY.Object")).toBe("./MyCrazyObject.js");
            expect(loader.getPath("MY.OtherObject")).toBe("./AnotherUrl/OtherObject.js");
            expect(loader.getPath("Loaner")).toBe("SomeUrl/Loaner.js");
        });

    });

    it("Testing Loader with full urls.", function () {

        var loader = new BASE.Loader();
        loader.setNamespace("MY.crazyNamespace", "http://someurl.com/SomeUrl/My/CrazyNamespace/");
        loader.setObject("MY.Object", "https://someurl.com/MyCrazyObject.js");
        loader.setNamespace("MY", "https://someurl.com/AnotherUrl");
        loader.root = "SomeUrl";

        runs(function () {
            expect(loader.getPath("MY.crazyNamespace")).toBe("http://someurl.com/SomeUrl/My/CrazyNamespace.js");
            expect(loader.getPath("MY.Object")).toBe("https://someurl.com/MyCrazyObject.js");
            expect(loader.getPath("MY.OtherObject")).toBe("https://someurl.com/AnotherUrl/OtherObject.js");
            expect(loader.getPath("Loaner")).toBe("SomeUrl/Loaner.js");
        });

    });

});
