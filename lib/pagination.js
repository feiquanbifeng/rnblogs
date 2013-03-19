/**
 *  pagination.js 封装的分页类
 *  @author: JY
 *  @since: 2013-03-04
 */
function Pagination(options) {

    var options = options || {};
    // 当前第几页
    this.currentpage = options.currentpage || 5;
    // 每页显示条数
    this.pagesize = options.pagesize || 5;
    // 步长
    this.step = this.step || 2;
    // 总记录数
    this.total = options.total || 0;
    this.size = Math.ceil(this.total / this.pagesize);
    this.split = options.split || '/';
    this.url = (options.url || '/?page=');

    var min = this.currentpage - this.step;
    var max = this.currentpage + this.step;
    var pageno = this.size;

    if (min > 0) {
        if (max > pageno) {
            this.start = pageno - 2 * this.step > 0 ? pageno - 2 * this.step : 1;
        } else {
            this.start = min;
        }
    } else {
        this.start = 1
    }

    if (max < pageno) {
        if (min <= 0) {
            if (pageno < (2 * this.step + 1)) {
                this.end = pageno
            } else {
                this.end = 2 * this.step + 1;
            }
        } else {
            this.end = max;
        }
    } else {
        this.end = pageno;
    }
}

Pagination.prototype.draw = function() {
    var wrap = '<div class="pagination"><ul>';
    wrap += '<li><a href="'+this.url+'1"><<</a></li>';

    if (this.total === 0 || this.currentpage > this.size || this.currentpage <= 0) return '';
    if (this.currentpage > 3 && (this.currentpage - (2 * this.step + 1)) > 0) {
        wrap += '<li><a>...</a></li>';
    }

    for(var i = this.start; i <= this.end; i++) {
        var cls = this.currentpage == i ? ' class="active"' : '',
            item = '<li'+cls+'><a href="' + this.url + i + '">' + i + '</a></li>';
        wrap += item;
    }

    if ((this.currentpage + this.step < this.size) && (this.size > (2 * this.step + 1))) {
        wrap += '<li><a>...</a></li>';
    }

    wrap += '<li><a href="' + this.url + this.size + '">>></a></li>';
    wrap +='</ul></div>';
    return wrap;
}

Pagination.prototype.init = function() {
    return this.draw();
}

exports.Pagination = Pagination;
