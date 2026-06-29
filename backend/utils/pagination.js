const paginate = async (model, query = {}, page = 1, limit = 10, populate = null, sort = { createdAt: -1 }) => {
  const skip = (page - 1) * limit;
  let dbQuery = model.find(query).sort(sort).skip(skip).limit(limit);
  if (populate) dbQuery = dbQuery.populate(populate);
  const [data, total] = await Promise.all([dbQuery, model.countDocuments(query)]);
  return {
    data,
    meta: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit),
    },
  };
};

module.exports = paginate;
