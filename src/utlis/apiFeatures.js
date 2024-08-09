

class ApiFeatures {
  constructor(mongooseQuery, data) {
    (this.mongooseQuery = mongooseQuery), (this.data = data);
  }

  pagination() {
    let { page, limit } = this.data;

    // if front sends float number not int.
    page = parseInt(page)
    limit = parseInt(limit)

    // every page contains 5 products.
    if (!limit || limit <= 0) {
      limit = 5;
    }

    // if there is no page sent default is page one.
    if (!page || page <= 0) {
      page = 1;
    }
    const skip = (page - 1) * limit;
    this.mongooseQuery.limit(limit).skip(skip);
    return this;
  }
  sort() {
      this.mongooseQuery.sort(this.data.sort?.replaceAll(",", " "));
    return this;
  }
  // Select any fields in the products.
  select() {
      this.mongooseQuery.select(this.data.select?.replaceAll(",", " "));
    return this;
  }
  
  // Price[gt] = 2000 => get all prices greater than 2000
  filter(){
    let {page, limit, sort, select,search, ...filter} = this.data
    filter = JSON.parse(JSON.stringify(filter).replace(/gte|gt|lt|lte/g, match => `$${match}`))
    this.mongooseQuery.find(filter)
    return this
  }
  // Search in the name or title , Ex: search = Ga (get all names or titles contain Ga)
  search() {
    if (this.data.search) {
      this.mongooseQuery.find(
        {
        $or: [
          { title: { $regex: this.data.search}},
          {name: {$regex: this.data.search}},
        ]
      }
    );
    return this
    }
    return this;
  }
}

export default ApiFeatures