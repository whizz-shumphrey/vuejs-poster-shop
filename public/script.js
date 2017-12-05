var PRICE = 9.99;
var LOAD_NUM = 10;
new Vue({
    el: '#app',
    data: {
        total: 0,
        results: [],
        items: [],
        cart: [],
        newSearch: 'Jurassic Park',
        lastSearch: '',
        loading: false,
        price: PRICE,
    },
    computed: {
        noMoreItems: function() {
            return this.items.length === this.results.length && this.items.length > 0;
        }
    },
    methods: {
        onSubmit: function() {
            if(this.newSearch.length) {
                this.loading = true;
                this.items = [];
                this.$http
                .get('search/'.concat(this.newSearch))
                .then(function (res) {
                    this.lastSearch = this.newSearch;
                    this.results = res.data;
                    this.loading = false;
                    this.appendItems();
                });
            }
        },
        appendItems: function() {
            if(this.items.length < this.results.length) {
                var append = this.results.slice(this.items.length, this.items.length + LOAD_NUM);
                this.items = this.items.concat(append);
            }
        },
        addItem: function(index) {
            this.total += PRICE;
            var item = this.items[index];
            var found = false;
            for (var i = 0; i < this.cart.length; i++) {
                if (this.cart[i].id === item.id) {
                    found = true;
                    this.cart[i].qty++;
                    break;
                }
            }
            if(!found) {
                this.cart.push({
                    id: item.id,
                    title: item.title,
                    qty: 1,
                    price: PRICE,
                });
            }
        },
        inc: function(item) {
            item.qty++;
            this.total += item.price;
        },
        dec: function(item) {
            item.qty--;
            this.total -= item.price;
            if(item.qty <= 0) {
                for (var i = 0; i < this.cart.length; i++) {
                    if (this.cart[i].id === item.id) {
                        this.cart.splice(i, 1);
                        break;
                    }
                }
            }
        },
    },
    filters: {
        currency: function(price) {
            return '£'.concat(price.toFixed(2));
        }
    },
    mounted: function() {
        this.onSubmit();
        var instance = this;
        var elem = document.getElementById('product-list-bottom');
        var watcher = scrollMonitor.create(elem);
        watcher.enterViewport(function() {
            instance.appendItems();
        });
    },
});