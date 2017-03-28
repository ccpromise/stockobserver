
var getSecID = require('../../../datasrc/wmcloud').getSecID;
var config = require('../../../config');
var container = config.stockmetaContainer;
var azure = require('../../../utility').azureStorage(config.azureUsr);

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
