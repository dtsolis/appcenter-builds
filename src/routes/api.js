const express = require('express');
const router = express.Router();

// GET /
router.get('/', function (req, res, next) {
  // no need for something more at the moment
  return res.json({
    response: 200
  });
});

module.exports = router;
