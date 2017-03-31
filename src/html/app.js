
var dispatcherUrl = 'http://127.0.0.1:8000/simulate';

var getTotalItems = function(secID, callback) {
    var req = new XMLHttpRequest();
    req.onreadystatechange = function() {
        if(req.readyState === 4 && req.status === 200) {
            callback(JSON.parse(req.responseText));
        }
    }
    req.open('POST', dispatcherUrl, true);
    req.setRequestHeader('verb', 'count');
    req.send(secID === '' ? '{}' : JSON.stringify({ secID: secID.toLowerCase() }));
}

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
            this.pagination.currentPage = page;

            if(this.pagination.currentPage === 0) this.paginatedItems = [];
            else getSimData(this.pagination.currentPage, this.pagination.itemPerPage, this.searchItem, this.sort, (ret) => {
                this.paginatedItems = ret.data;
            })
        },
        loadData: function (page) {
            getTotalItems(this.searchItem, (N) => {
                this.totalItems = N;
                this.selectPage(Math.min(page, this.totalPage));
            })
        },
        search: function () {
            this.loadData(1);
        },
        clearSearch: function () {
            this.searchItem = '';
            this.loadData(1);
        },
        update: function () {
            this.loadData(this.pagination.currentPage);
        },
        sortBy: function(key) {
            if(key === this.sortKey) this.order = -this.order;
            else {
                this.sortKey = key;
                this.order = 1;
            }
            this.loadData(this.pagination.currentPage);
        }
    },
    mounted: function () {
        this.loadData(1);
    }
});
