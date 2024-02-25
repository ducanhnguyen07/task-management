const Task = require("../models/task.model");
const paginationHelper = require("../../../helpers/pagination");
const searchHelper = require("../../../helpers/search");

// [GET] /api/v1/tasks
module.exports.index = async (req, res) => {
  const find = {
    deleted: false,
  };

  // Bộ lọc
  if (req.query.status) {
    find.status = req.query.status;
  }
  // Hết Bộ lọc

  // Search
  const objectSearch = searchHelper(req.query);

  if (objectSearch.regex) {
    find.title = objectSearch.regex;
  }
  // End Search

  // Pagination
  const countTasks = await Task.countDocuments(find);
  let objectPagination = paginationHelper(
    {
      currentPage: 1,
      limitedItem: 2,
    },
    req.query,
    countTasks
  );
  // End pagination

  // Sort
  const sort = {};
  if (req.query.sortKey && req.query.sortValue) {
    sort[req.query.sortKey] = req.query.sortValue;
  }
  //End Sort

  const tasks = await Task.find(find)
    .sort(sort)
    .limit(objectPagination.limitedItem)
    .skip(objectPagination.skip);

  res.json(tasks);
};

// [GET] /api/v1/tasks/detail/:id
module.exports.detail = async (req, res) => {
  const id = req.params.id;
  const task = await Task.findOne({
    _id: id,
    deleted: false,
  });

  res.json(task);
};

// [PATCH] /api/v1/tasks/change-status/:id
module.exports.changeStatus = async (req, res) => {
  try {
    const id = req.params.id;

    await Task.updateOne({ _id: id }, { status: req.body.status });

    res.json({
      code: 200,
      message: "Cập nhật trạng thái thành công!"
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Cập nhật trạng thái không thành công!"
    });
  }
  
};