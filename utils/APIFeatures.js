
class APIFeatures{
    constructor(query,queryString){
        this.query = query;
        this.queryString = queryString;
    }
    
    filtering(){
        console.log(this.queryString);
        let queryString = {...this.queryString};
        let removeFields = ['page','limit','sort','fields'];
        removeFields.forEach(val=> delete queryString[val]);
        queryString = JSON.parse(JSON.stringify(queryString).replace(/\b(gte|gt|lte|lt|regex)\b/gm,val=> `$${val}`));
        // for(let x in queryString){
        //     if(queryString[x]['$regex']){
        //         queryString[x]['$regex'] = new RegExp(queryString[x]['$regex'],'gim');
        //     }
        //     // for true false  && search inner Objects
        //     if(x.indexOf('_') > -1){
                
        //         if(queryString[x] === 'true'){
        //             queryString[x] = true;
        //         }else if(queryString[x] === 'false'){
        //             queryString[x] = false;
        //         }
        //         queryString[x.replace('_','.')] = queryString[x];
        //         delete queryString[x];
        //     }
        // }
        console.log(queryString);
        this.query =  this.query.find(queryString);
        return this;
    }
    sort(){
            // sort
            if(this.queryString.sort){
                let sort = this.queryString.sort.split(',').join(' ');
                this.query = this.query.sort(sort);
            }else{
                this.query = this.query.sort('-price');
            }
            return this;

    }
    select(){
        if(this.queryString.fields){
            let fields = this.queryString.fields.split(',').join(' ');
            this.query = this.query.select(fields);
        }else{
            this.query = this.query.select('-__v');
        }
        return this;

    }
    pagination(){
            let page = +this.queryString.page || 1;
            let limit = +this.queryString.limit || 50;
            let skip = (page -1)*limit;
            this.query.skip(skip).limit(limit);
            return this;
    }

}

module.exports = APIFeatures;