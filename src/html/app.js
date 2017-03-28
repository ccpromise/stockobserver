
var dispatcherUrl = 'http://127.0.0.1:8000/simulate';
var getAllSimTrade = function(callback) {
    var req = new XMLHttpRequest();
    console.log(dispatcherUrl);
    req.onreadystatechange = function() {
        if(req.readyState === 4 && req.status === 200) {
            var data = JSON.parse(req.responseText);
            data.sort((x, y) => { return x.secID < y.secID ? -1 : 1; });
            callback(data);
        }
        else {
            callback([]);
        }
    }
    req.open('POST', dispatcherUrl, true);
    req.setRequestHeader('verb', 'getMul'); // why not use find
    req.send('null');
}

Vue.filter('formatTs', (dateTs) => {
    return new Date(dateTs * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
});

new Vue({
    el: '#app',
    data: {
        searchItem: '', // search trade items by secID
        items: [], // the whole trade items
        filteredItems: [], // selected trade items by secID
        paginatedItems: [], //trade items in current page
        pagination: {
            range: 5, // number of pages shown in navigation
            itemPerPage: 10,
            currentPage: 0,
            filterPages: [] // the pages shown in navigation
        }
    },
    computed: {
        totalPage: function () {
            return Math.ceil(this.filteredItems.length / this.pagination.itemPerPage)
        }
    },
    methods: {
        buildPagination: function () {
            var totalItem = this.filteredItems.length;
        },
        selectPage: function (page) {
            this.pagination.currentPage = page;

            var start = 0;
            var end = 0;
            var margin = Math.floor(this.pagination.range / 2);
            if(this.totalPage < this.pagination.range) {
                start = 1;
                end = this.totalPage;
            }
            else if(page <= margin) {
                start = 1;
                end = this.pagination.range;
            }
            else if(page >= this.totalPage - margin) {
                start = this.totalPage - this.pagination.range + 1;
                end = this.totalPage;
            }
            else {
                start = page - margin;
                end = page + this.pagination.range - margin - 1;
            }
            this.pagination.filterPages = [];
            for(let i = start; i <= end; i ++) {
                this.pagination.filterPages.push(i);
            }
            this.paginatedItems = [];
            for(let i = (page - 1) * this.pagination.itemPerPage; i < page * this.pagination.itemPerPage && i < this.filteredItems.length; i ++) {
                this.paginatedItems.push(this.filteredItems[i]);
            }
        },
        loadData: function (page) {
            getAllSimTrade((data) => {
                this.items = data;
                this.filteredItems = this.items.filter((item) => {
                    return item.secID.indexOf(this.searchItem) >= 0;
                });
                this.buildPagination();
                this.selectPage(page || 1);
            })
        },
        search: function () {
            this.filteredItems = this.items.filter((item) => {
                return item.secID.indexOf(this.searchItem) >= 0;
            });
            this.buildPagination();
            this.selectPage(1);
        },
        clearSearch: function () {
            this.searchItem = '';
            search();
        },
        update: function () {
            this.loadData(this.currentPage);
        }
    },
    mounted: function () {
        this.loadData();
    }
});
