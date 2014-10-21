BASE.require([
    "LG.core.dataModel.core.Person"
], function(){
    BASE.namespace("LG");

    LG.PersonProfileToolsBehavior = function () {
        var self = this;

        self.getProfileImage = function () {
            return new BASE.async.Future(function(setValue, setError){
                // Check to see if we have a profile picture attachment
                var dataContext = self.getChangeTracker().getDataContext();
                dataContext.profilePictureAttachments.asQueryable().where(function (e) {
                    return e.property("ownerId").isEqualTo(self.id);
                }).toArray(function (results) {
                    if (results.length > 0) {
                        
                    }
                });
            });
            
        };

    };

    LG.PersonProfileToolsBehavior.call(LG.core.dataModel.core.Person.prototype);
});