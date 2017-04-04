
const dispatcherUrl = 'http://127.0.0.1:8000/simulate';

var getSimData = function(pageNum, pageSize, secID, sort, callback) {
    var req = new XMLHttpRequest();
    req.onreadystatechange = function() {
        if(req.readyState === 4 && req.status === 200) {
            var data = JSON.parse(req.responseText);
            callback(data);
        }
    }
    req.open('POST', dispatcherUrl, true);
    req.setRequestHeader('verb', 'getMul');
    req.send(JSON.stringify({
        pageNum: pageNum,
        pageSize: pageSize,
        filter: secID === '' ? {} : { secID: secID.toLowerCase() },
        sort: sort
    }));
}

Vue.filter('formatTs', (dateTs) => {
    return new Date(dateTs * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
});

Vue.filter('numeral', (num) => {
    return num.toFixed(2);
})

new Vue({
    el: '#app',
    data: {
        searchItem: '',
        totalItems: 0,
        paginatedItems: [],
        sortKey: 'sdts',
        order: 1,
        pagination: {
            range: 5,
            itemPerPage: 10,
            currentPage: 0,
        }
    },
    computed: {
        totalPage: function () {
            return Math.ceil(this.totalItems / this.pagination.itemPerPage)
        },
        sort: function() {
            var res = Object.create(null);
            res[this.sortKey] = this.order;
            return res;
        }
    },
    methods: {
        selectPage: function (page) {
            getSimData(page, this.pagination.itemPerPage, this.searchItem, this.sort, (r) => {
                this.pagination.currentPage = r.pageNum;
                this.pagination.itemPerPage = r.pageSize;
                this.totalItems = r.total;
                this.paginatedItems = r.data;
            })
        },
        search: function () {
            this.selectPage(1);
        },
        clearSearch: function () {
            this.searchItem = '';
            this.selectPage(1);
        },
        update: function () {
            this.selectPage(this.pagination.currentPage);
        },
        sortBy: function(key) {
            if(key === this.sortKey) this.order = -this.order;
            else {
                this.sortKey = key;
                this.order = 1;
            }
            this.selectPage(this.pagination.currentPage);
        }
    },
    mounted: function () {
        this.selectPage(1);
    }
});
