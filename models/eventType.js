const avro = require('avsc');

const type = avro.Type.forSchema({
    type: 'record',
    fields: [
        {
            name: 'gameId',
            type: 'string'
        },
        {
            name: 'gameName',
            type: 'string'
        },
        {
            name: 'tableId',
            type: 'string'
        },
        {
            name: 'tableName',
            type: 'string'
        },
        {
            name: 'roundID',
            type: 'string'
        },
        {
            name: 'roundStatus',
            type: 'string'
        },
        {
            name: 'betStatus',
            type: 'string'
        },
        {
            name: 'outcome',
            type: 'string'
        },
      
       
    ]
});

module.exports = type;