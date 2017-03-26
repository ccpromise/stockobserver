function item(secID) {
    this.secID = secID;
}

function getAllSimTrade() {
    var items = [];
    for(var i = 0; i < 102; i ++){
        items.push(new item(i));
    }
    return items;
}

window.app = new Vue({
    el: '#app',
    data: {
        searchItem: '', // search trade items by secID
        items: [], // the whole trade items
        filteredItems: [], // selected trade items by secID
        paginatedItems: [], //trade items in current page
        pagination: {
            range: 5, // number of pages shown in navigation
            itemPerPage: 10,
            totalPage: 0,
            currentPage: 0,
            filterPages: [] // the pages shown in navigation
        }
    },
    methods: {
        buildPagination() {
            var totalItem = this.filteredItems.length;
            this.pagination.totalPage = Math.ceil(totalItem / this.pagination.itemPerPage);
        },
        selectPage(page) {
            this.pagination.currentPage = page;

            var start = 0;
            var end = 0;
            var margin = Math.floor(this.pagination.range / 2);
            if(this.pagination.totalPage < this.pagination.range) {
                start = 1;
                end = this.pagination.totalPage;
            }
            else if(page <= margin) {
                start = 1;
                end = this.pagination.range;
            }
            else if(page >= this.pagination.totalPage - margin) {
                start = this.pagination.totalPage - this.pagination.range + 1;
                end = this.pagination.totalPage;
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
        }
    },
    mounted() {
        this.items = getAllSimTrade();
        this.filteredItems = this.items;
        this.buildPagination();
        this.selectPage(1);
        /*
        getAllSimTrade().then((data) => { // data is an array
            this.items = data;
            this.filteredItems = data;
            this.buildPagination();
            this.selectPage(1);
        });*/
    }
});
