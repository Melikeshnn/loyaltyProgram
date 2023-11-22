class ProductFilter{
    constructor(query, queryString){
        this.query = query;
        this.queryString = queryString;
    }

    
    search(){
        
            const keyword =this.queryString.keyword ? {
                name : {
                    $regex : this.queryString.keyword,
                    $options : 'i'
                }
            } : {}
            this.query = this.query.find({...keyword})
            return this;
    }
    filter(){
            const queryCopy = {...this.queryString};
            const deleteArea = ['keyword', 'limit', 'page'];
            deleteArea.forEach(item => delete queryCopy[item]);

            const queryStr = JSON.stringify(queryCopy); //belirli aralıkta filtreleme yapmak için örn (40 puan -150 puan arasındaki ürünleri getir)
            queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, key => `$${key}`); //regex ile string içindeki ifadeleri değiştirme
            this.query = this.query.find(JSON.parse(this.queryString));
            return this;
    }
    pagination(resultPerPage){
        // İçerikleri sayfalara ayırma işlemi yaptım.
            const activePage = this.queryString.page  || 1;
            const skip = resultPerPage * (activePage - 1);
            this .query = this.query.limit(resultPerPage).skip(skip);
            return this;
    }
}

module.exports = ProductFilter;

// Utils fonksiyonlar oluşturulur.