var listLevelData = [
    {order: 1, name: '助理'},
    {order: 2, name: '见习'},
    {order: 3, name: '初级'},
    {order: 4, name: '中级'},
    {order: 5, name: '高级'},
    {order: 6, name: '资深'},
    {order: 7, name: '全部'},
];
var listAddData = [
    {order: 1, name: '助理'},
    {order: 2, name: '见习'},
    {order: 3, name: '初级'},
    {order: 4, name: '中级'},
    {order: 5, name: '高级'},
    {order: 6, name: '资深'}
];

export default {
    getListLevels: function() {
        return listLevelData;
    },
    getAddLevels: function(){
        return listAddData
    },

}