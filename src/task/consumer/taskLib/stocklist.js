
var getSecID = require('../../../datasrc/wmcloud').getSecID;
var container = require('../../../config').stockmetaContainer;
var azure = require('../../../utility').azureStorage

exports.run = function() {
    return getSecID().then((list) => {
        return azure.createContainerIfNotExists(container).then(() => {
            return azure.createBlobFromText(container, 'allstocks.txt', list.join(';'));
        })
    })
}

exports.checkArgs = function(args) {
    return args === undefined;
}
